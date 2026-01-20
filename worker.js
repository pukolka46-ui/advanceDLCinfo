export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/login") {
      const { email, password } = await request.json();

      // ❗ ПРИМЕР: премиум если email есть
      const isPremium = email && password;

      return new Response(
        JSON.stringify({ premium: isPremium }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    return new Response("API работает", { status: 200 });
  }
};
