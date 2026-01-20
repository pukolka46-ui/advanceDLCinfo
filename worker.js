export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/api/register") {
      const { email, password } = await req.json();
      await env.DB.prepare(
        "INSERT INTO users (email, password) VALUES (?, ?)"
      ).bind(email, password).run();
      return Response.json({ ok: true });
    }

    if (url.pathname === "/api/login") {
      const { email, password } = await req.json();
      const user = await env.DB.prepare(
        "SELECT * FROM users WHERE email=? AND password=?"
      ).bind(email, password).first();

      if (!user) return new Response("Unauthorized", { status: 401 });

      return Response.json({ token: crypto.randomUUID() });
    }

    return new Response("OK");
  }
};
