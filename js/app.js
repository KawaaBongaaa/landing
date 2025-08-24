const supportedLangs = ['en','ru','es','fr','de','zh','pt-br','ar','hi','ja','it','ko','tr','pl'];
const langBtn = document.getElementById('lang-btn');
const langMenu = document.getElementById('lang-menu');

// Toggle lang menu
langBtn.addEventListener('click', () => {
  langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block';
});

// Populate lang menu
supportedLangs.forEach(l => {
  const li = document.createElement('li');
  li.innerText = l;
  li.onclick = () => switchLang(l);
  langMenu.appendChild(li);
});

function switchLang(lang) {
  fetch(`locales/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(data[key]) el.innerText = data[key];
      });
    });
}

// Load galleries
const boards = {
  main: "https://www.pinterest.com/888k_ideas/to-print/",
  alt: "https://www.pinterest.com/888k_ideas/sticker-logo-wallpaper-art-posters-clipart/"
};

// Just placeholder images for demo, replace with API calls to Pinterest later
const galleryGrid = document.getElementById('gallery-grid');
const galleryAlt = document.getElementById('gallery-alt');
for(let i=1;i<=12;i++){
  let img=document.createElement('img');
  img.src=`https://picsum.photos/400/300?random=${i}`;
  img.alt=`Gallery image ${i}`;
  galleryGrid.appendChild(img);
}
for(let i=13;i<=20;i++){
  let img=document.createElement('img');
  img.src=`https://picsum.photos/400/300?random=${i}`;
  img.alt=`Carousel image ${i}`;
  galleryAlt.appendChild(img);
}