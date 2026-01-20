async function login() {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      login: login.value,
      password: password.value
    })
  })

  if (res.ok) {
    location.href = "/dashboard.html"
  } else {
    alert("Неверные данные")
  }
}
