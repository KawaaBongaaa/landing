async function loadGallery() {
  const config = await fetch("config.json").then(r => r.json());
  const boardUrl = config.pinterestBoard;

  const carousel = document.getElementById("carousel");

  // ⚠️ Заглушка: В реальном режиме нужен Pinterest API или middleware
  // Для демо вставляем пример изображений (замени на запрос к API)
  const exampleImages = [
    { url: "https://i.pinimg.com/564x/1f/5b/07/1f5b07.jpg", title: "AI Artwork 1" },
    { url: "https://i.pinimg.com/564x/2d/6c/1e/2d6c1e.jpg", title: "AI Artwork 2" },
    { url: "https://i.pinimg.com/564x/3e/8f/5a/3e8f5a.jpg", title: "AI Artwork 3" }
  ];

  exampleImages.forEach(img => {
    const imageEl = document.createElement("img");
    imageEl.src = img.url;
    imageEl.alt = img.title;
    imageEl.title = img.title;
    carousel.appendChild(imageEl);
  });

  // Автопрокрутка
  let scrollAmount = 0;
  function autoScroll() {
    scrollAmount += 1;
    carousel.scrollTo({
      left: scrollAmount,
      behavior: "smooth"
    });
    if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
      scrollAmount = 0;
    }
  }
  setInterval(autoScroll, 50); // медленно крутится
}

document.addEventListener("DOMContentLoaded", loadGallery);
