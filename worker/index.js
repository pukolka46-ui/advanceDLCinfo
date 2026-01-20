export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/api/register" && req.method === "POST") {
      return register(req, env);
    }

    if (url.pathname === "/api/login" && req.method === "POST") {
      return login(req, env);
    }

    if (url.pathname === "/api/me") {
      return me(req, env);
    }

    return new Response("Not found", { status: 404 });
  }
};

async function register(req, env) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return json({ error: "Bad data" }, 400);
  }

  try {
    await env.DB.prepare(
      "INSERT INTO users (id, email, password, created_at) VALUES (?, ?, ?, ?)"
    ).bind(
      crypto.randomUUID(),
      email,
      password,
      Date.now()
    ).run();
  } catch {
    return json({ error: "User exists" }, 400);
  }

  return json({ success: true });
}

async function login(req, env) {
  const { email, password } = await req.json();

  const user = await env.DB.prepare(
    "SELECT * FROM users WHERE email = ? AND password = ?"
  ).bind(email, password).first();

  if (!user) {
    return json({ error: "Invalid login" }, 401);
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Set-Cookie": `auth=${user.id}; Path=/; HttpOnly`
    }
  });
}

async function me(req, env) {
  const cookie = req.headers.get("Cookie") || "";
  const id = cookie.split("auth=")[1];

  if (!id) return json({ error: "Unauthorized" }, 401);

  const user = await env.DB.prepare(
    "SELECT email FROM users WHERE id = ?"
  ).bind(id).first();

  if (!user) return json({ error: "Unauthorized" }, 401);

  return json(user);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
