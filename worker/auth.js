export async function createSession(DB, userId) {
  const id = crypto.randomUUID();
  const expires = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 дней

  await DB.prepare(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
  ).bind(id, userId, expires).run();

  return id;
}

export async function getSession(DB, cookie) {
  if (!cookie) return null;

  const sessionId = cookie.split("session=")[1];
  if (!sessionId) return null;

  const { results } = await DB.prepare(
    `SELECT users.id, users.role 
     FROM sessions 
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.id = ? AND sessions.expires_at > ?`
  ).bind(sessionId, Date.now()).all();

  return results[0] || null;
}
