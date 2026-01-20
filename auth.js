function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Заполните все поля");
    return;
  }

  localStorage.setItem("user", email);  
  window.location.href = "dashboard.html";
}

function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  if (!email || !password) {
    alert("Заполните все поля");
    return;
  }

  localStorage.setItem("user", email);
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

function checkAuth() {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "login.html";
  }
}
  
