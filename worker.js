export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") return cors();

    if (url.pathname === "/api/register") {
      const {email, password} = await req.json();
      const ex = await env.DB.prepare(
        "SELECT id FROM users WHERE email=?"
      ).bind(email).first();

      if (ex) return json({error:"Уже есть"},400);

      await env.DB.prepare(
        "INSERT INTO users (email,password) VALUES (?,?)"
      ).bind(email,password).run();

      return json({success:true});
    }

    if (url.pathname === "/api/login") {
      const {email,password} = await req.json();
      const u = await env.DB.prepare(
        "SELECT * FROM users WHERE email=? AND password=?"
      ).bind(email,password).first();

      if (!u) return json({error:"Неверно"},401);
      return json({success:true});
    }

    return new Response("404");
  }
};

const cors = ()=>new Response(null,{headers:{
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"Content-Type"
}});

const json=(d,s=200)=>new Response(JSON.stringify(d),{
  status:s,
  headers:{
    "Content-Type":"application/json",
    "Access-Control-Allow-Origin":"*"
  }
});
