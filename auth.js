const API = "/api";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const r = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!r.ok) return alert("Ошибка входа");

  const data = await r.json();
  localStorage.setItem("token", data.token);
  location.href = "dashboard.html";
}

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const r = await fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!r.ok) return alert("Ошибка регистрации");
  location.href = "login.html";
}

function checkAuth() {
  if (!localStorage.getItem("token")) {
    location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  location.href = "index.html";
}
