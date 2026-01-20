import { getSession } from "./auth";

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const session = await getSession(env.DB, req.headers.get("Cookie"));

    // API
    if (url.pathname === "/api/me") {
      return Response.json({ user: session });
    }

    // Guard cabinet
    if (url.pathname.startsWith("/cabinet") && !session) {
      return Response.redirect(new URL("/login.html", req.url), 302);
    }

    return fetch(req);
  }
};
