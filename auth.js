async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const r = await fetch("/api/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });

  const d = await r.json();
  if (d.success) location.href = "login.html";
  else alert(d.error);
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const r = await fetch("/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });

  const d = await r.json();
  if (d.success) {
    localStorage.setItem("auth", "1");
    location.href = "dashboard.html";
  } else alert(d.error);
}
