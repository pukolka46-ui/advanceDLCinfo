export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/register" && request.method === "POST") {
      try {
        const { email, password } = await request.json();

        if (!email || !password) {
          return new Response("Missing data", { status: 400 });
        }

        const hashed = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(password)
        );

        const hashHex = [...new Uint8Array(hashed)]
          .map(b => b.toString(16).padStart(2, "0"))
          .join("");

        await env.DB.prepare(
          "INSERT INTO users (email, password) VALUES (?, ?)"
        ).bind(email, hashHex).run();

        return new Response("OK");
      } catch (e) {
        return new Response("Registration error", { status: 500 });
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
