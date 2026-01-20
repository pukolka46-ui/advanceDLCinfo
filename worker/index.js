import { sign, verify } from "https://esm.sh/jose@5.2.0";

const SECRET = new TextEncoder().encode("ADVANCEDLC_SECRET");

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/api/register" && req.method === "POST") {
      const { email, password } = await req.json();

      if (!email || !password)
        return json({ error: "Invalid data" }, 400);

      const hashed = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(password)
      );

      try {
        await env.DB.prepare(
          "INSERT INTO users (email, password, created_at) VALUES (?, ?, ?)"
        )
          .bind(email, Buffer.from(hashed).toString("hex"), new Date().toISOString())
          .run();
      } catch {
        return json({ error: "User exists" }, 400);
      }

      return json({ success: true });
    }

    if (url.pathname === "/api/login" && req.method === "POST") {
      const { email, password } = await req.json();

      const hashed = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(password)
      );

      const user = await env.DB.prepare(
        "SELECT * FROM users WHERE email=? AND password=?"
      )
        .bind(email, Buffer.from(hashed).toString("hex"))
        .first();

      if (!user) return json({ error: "Invalid credentials" }, 401);

      const token = await sign(
        { id: user.id },
        SECRET,
        { algorithm: "HS256", expiresIn: "7d" }
      );

      return json({ token });
    }

    return new Response("Not found", { status: 404 });
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
