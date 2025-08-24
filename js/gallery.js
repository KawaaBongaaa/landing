
async function loadGallery() {
  try {
    const res = await fetch('gallery.json',{cache:'no-store'});
    const items = await res.json();
    const track = document.querySelector('.carouselTrack');
    if (!track) return;

    // Shuffle for randomness
    const shuffled = items.slice().sort(() => Math.random() - .5);

    // Build slides
    for (const it of shuffled) {
      const card = document.createElement('div');
      card.className = 'carouselItem';
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = it.url;
      const title = it.title || '';
      const desc = it.description || '';
      img.alt = title || desc || 'pixPLace artwork';
      img.title = title || desc || 'pixPLace artwork';
      const cap = document.createElement('div');
      cap.className = 'caption';
      cap.textContent = title || desc || '';
      card.appendChild(img);
      card.appendChild(cap);
      track.appendChild(card);
    }

    // Duplicate slides to ensure seamless infinite scroll
    for (const it of shuffled) {
      const card = document.createElement('div');
      card.className = 'carouselItem';
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = it.url;
      const title = it.title || '';
      const desc = it.description || '';
      img.alt = title || desc || 'pixPLace artwork';
      img.title = title || desc || 'pixPLace artwork';
      const cap = document.createElement('div');
      cap.className = 'caption';
      cap.textContent = title || desc || '';
      card.appendChild(img);
      card.appendChild(cap);
      track.appendChild(card);
    }

    // Continuous auto scroll
    let pos = 0;
    function tick(){
      pos += 0.25; // speed
      const max = track.scrollWidth / 2; // we duplicated
      if (pos >= max) pos = 0;
      track.style.transform = `translateX(${-pos}px)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  } catch(e){
    console.error('Gallery load failed', e);
  }
}
document.addEventListener('DOMContentLoaded', loadGallery);
