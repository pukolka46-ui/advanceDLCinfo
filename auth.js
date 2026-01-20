function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (!email || !pass) {
    alert("Заполни все поля");
    return;
  }

  // ❗ ВРЕМЕННО: проверка premium
  fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, pass })
  })
    .then(res => res.json())
    .then(data => {
      if (data.premium) {
        localStorage.setItem("user", email);
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "buy.html";
      }
    });
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}

function checkAuth() {
  if (!localStorage.getItem("user")) {
    location.href = "login.html";
  }
}
