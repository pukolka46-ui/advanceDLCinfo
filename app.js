async function login() {
  const email = email.value;
  const password = password.value;

  const r = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (r.ok) {
    location.href = "dashboard.html";
  } else {
    alert("Access denied");
  }
}
