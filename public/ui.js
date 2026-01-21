document.addEventListener("DOMContentLoaded", () => {

  console.log("UI JS загружен!"); // проверка загрузки

  // Скролл по кнопкам
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.scroll;
      document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    });
  });

  // Поддержка
  document.getElementById("supportBtn")?.addEventListener("click", () => {
    alert("Поддержка скоро будет доступна");
  });

  // Смена темы
  let wave = true;
  document.getElementById("themeBtn")?.addEventListener("click", () => {
    if(wave){
      document.body.style.animation = "none";
      document.body.style.background = "#020014";
    } else {
      document.body.style.animation = "waveBg 15s ease infinite";
      document.body.style.background = "";
    }
    wave = !wave;
  });

  // Выбор плана
  document.querySelectorAll(".select").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Покупка временно недоступна");
    });
  });

  // Reveal элементы при скролле
  const reveal = () => {
    document.querySelectorAll(".reveal").forEach(el => {
      if(el.getBoundingClientRect().top < window.innerHeight - 100){
        el.classList.add("active");
      }
    });
  };
  window.addEventListener("scroll", reveal);
  reveal();

  // Анимация чисел
  const animateNums = () => {
    document.querySelectorAll(".stat .num").forEach(el => {
      const target = +el.dataset.target;
      let count = 0;
      const step = Math.ceil(target / 100);
      const interval = setInterval(() => {
        count += step;
        if(count >= target){
          el.textContent = target;
          clearInterval(interval);
        } else {
          el.textContent = count;
        }
      }, 20);
    });
  };
  animateNums();
});
