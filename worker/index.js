export default {
  async fetch(req, env) {
    const url = new URL(req.url)

    // РЕГИСТРАЦИЯ
    if (url.pathname === "/api/register" && req.method === "POST") {
      const { login, password } = await req.json()

      if (await env.USERS.get(login)) {
        return new Response("User exists", { status: 409 })
      }

      await env.USERS.put(login, JSON.stringify({
        password,
        plan: "none"
      }))

      return new Response("OK")
    }

    // ЛОГИН
    if (url.pathname === "/api/login" && req.method === "POST") {
      const { login, password } = await req.json()
      const user = await env.USERS.get(login, { type: "json" })

      if (!user || user.password !== password) {
        return new Response("Invalid", { status: 401 })
      }

      const token = crypto.randomUUID()
      await env.SESSIONS.put(token, login, { expirationTtl: 86400 })

      return new Response("OK", {
        headers: {
          "Set-Cookie": `session=${token}; Path=/; HttpOnly`
        }
      })
    }

    // ПРОВЕРКА СЕССИИ
    if (url.pathname === "/api/me") {
      const cookie = req.headers.get("Cookie") || ""
      const token = cookie.split("session=")[1]

      if (!token) return new Response("No auth", { status: 401 })

      const login = await env.SESSIONS.get(token)
      if (!login) return new Response("Expired", { status: 401 })

      const user = await env.USERS.get(login, { type: "json" })

      return new Response(JSON.stringify({
        login,
        plan: user.plan
      }), { headers: { "Content-Type": "application/json" } })
    }

    return new Response("Not found", { status: 404 })
  }
}
