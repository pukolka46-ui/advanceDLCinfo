export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/api/register" && req.method === "POST") {
      const { email, password } = await req.json();

      if (!email || !password) {
        return new Response("Invalid data", { status: 400 });
      }

      try {
        await env.DB.prepare(
          "INSERT INTO users (email, password) VALUES (?, ?)"
        ).bind(email, password).run();

        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (e) {
        return new Response(
          JSON.stringify({ error: "User exists" }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (url.pathname === "/api/login" && req.method === "POST") {
      const { email, password } = await req.json();

      const user = await env.DB.prepare(
        "SELECT * FROM users WHERE email=? AND password=?"
      ).bind(email, password).first();

      if (!user) {
        return new Response("Unauthorized", { status: 401 });
      }

      return new Response(
        JSON.stringify({ token: crypto.randomUUID() }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response("OK");
  }
};
