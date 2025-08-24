
async function loadGalleries(){
  const cfg = await fetch('config.json').then(r=>r.json()).catch(()=>null);
  const mainFile = (cfg && cfg.gallery && cfg.gallery.dataFileMain) ? cfg.gallery.dataFileMain : 'gallery.json';
  const altFile = (cfg && cfg.gallery && cfg.gallery.dataFileAlt) ? cfg.gallery.dataFileAlt : 'gallery_alt.json';

  // load main gallery (masonry)
  try{
    const res = await fetch(mainFile + '?t=' + Date.now(), {cache:'no-store'});
    const items = await res.json();
    const grid = document.getElementById('gallery-grid') || document.querySelector('.masonry');
    if(grid && items && items.length){
      // clear
      grid.innerHTML='';
      // shuffle to vary layout
      const shuffled = items.slice().sort(()=>Math.random()-0.5);
      shuffled.forEach((it, idx) => {
        const img = document.createElement('img');
        img.src = it.url;
        img.alt = it.title || it.description || 'pixPLace artwork';
        img.loading = 'lazy';
        // occasionally make tall images for tetris feel
        if(idx % 7 === 0) img.style.height = '520px';
        else if(idx % 5 === 0) img.style.height = '360px';
        else img.style.height = '260px';
        grid.appendChild(img);
      });
    }
  }catch(e){ console.warn('Main gallery load failed', e); }

  // load alt gallery (carousel)
  try{
    const res2 = await fetch(altFile + '?t=' + Date.now(), {cache:'no-store'});
    const items2 = await res2.json();
    const carousel = document.getElementById('gallery-alt') || document.querySelector('.carousel');
    if(carousel && items2 && items2.length){
      carousel.innerHTML='';
      // create duplicated sequence for seamless scroll
      const seq = items2.slice(0,40); // limit to reasonable count
      const build = (arr)=>{
        arr.forEach(it=>{
          const img = document.createElement('img');
          img.src = it.url;
          img.alt = it.title || it.description || 'pixPLace artwork';
          img.loading = 'lazy';
          carousel.appendChild(img);
        });
      };
      build(seq); build(seq); // duplicate
      // CSS animation handles scroll (set variable width)
    }
  }catch(e){ console.warn('Alt gallery load failed', e); }
}

document.addEventListener('DOMContentLoaded', loadGalleries);
