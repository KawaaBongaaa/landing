
async function loadGalleries(){
  const cfg = await fetch('config.json').then(r=>r.json()).catch(()=>null);
  const mainFile = (cfg && cfg.gallery && cfg.gallery.dataFileMain) ? cfg.gallery.dataFileMain : 'gallery.json';
  const altFile = (cfg && cfg.gallery && cfg.gallery.dataFileAlt) ? cfg.gallery.dataFileAlt : 'gallery_alt.json';

  // --- Masonry grid ---
  try{
    const res = await fetch(mainFile + '?t=' + Date.now(), {cache:'no-store'});
    const items = await res.json();
    const grid = document.getElementById('gallery-grid') || document.querySelector('.masonry-grid');
    if(grid && items && items.length){
      grid.innerHTML = '';
      // create items
      const gap = 12; // must match CSS gap
      const rowHeight = 8; // must match grid-auto-rows
      const fragment = document.createDocumentFragment();
      items.slice(0, 60).forEach((it, idx) => {
        const img = document.createElement('img');
        img.src = it.url;
        img.alt = it.title || it.description || 'pixPLace artwork';
        img.loading = 'lazy';
        img.className = 'masonry-item';
        // wrap in div if needed
        const wrapper = document.createElement('div');
        wrapper.className = 'masonry-item-wrap';
        wrapper.style.width = '100%';
        wrapper.appendChild(img);
        fragment.appendChild(wrapper);
        // after load, compute row span
        img.addEventListener('load', () => {
          const height = img.getBoundingClientRect().height;
          const span = Math.ceil((height + gap) / rowHeight);
          wrapper.style.gridRowEnd = 'span ' + span;
        });
        // fallback in case already cached
        if (img.complete) {
          const height = 300;
          const span = Math.ceil((height + gap) / rowHeight);
          wrapper.style.gridRowEnd = 'span ' + span;
        }
      });
      grid.appendChild(fragment);
      // on resize recalc
      let resizeTimer = null;
      window.addEventListener('resize', ()=> {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(()=> {
          document.querySelectorAll('.masonry-item-wrap img').forEach(img => {
            const wrapper = img.parentElement;
            const height = img.getBoundingClientRect().height;
            const span = Math.ceil((height + gap) / rowHeight);
            wrapper.style.gridRowEnd = 'span ' + span;
          });
        }, 150);
      });
    }
  }catch(e){ console.warn('Main gallery load failed', e); }

  // --- Carousel alt ---
  try{
    const res2 = await fetch(altFile + '?t=' + Date.now(), {cache:'no-store'});
    const items2 = await res2.json();
    const carousel = document.getElementById('gallery-alt') || document.querySelector('.carousel');
    if(carousel && items2 && items2.length){
      carousel.innerHTML = '';
      // build sequence and duplicate for seamless effect
      const seq = items2.slice(0, 40);
      function makeFrag(arr){
        const frag = document.createDocumentFragment();
        arr.forEach(it => {
          const img = document.createElement('img');
          img.src = it.url;
          img.alt = it.title || it.description || 'pixPLace artwork';
          img.loading = 'lazy';
          frag.appendChild(img);
        });
        return frag;
      }
      carousel.appendChild(makeFrag(seq));
      carousel.appendChild(makeFrag(seq)); // duplicate

      // continuous JS scroll
      let pos = 0;
      let speed = 0.25; // pixels per frame, tweak for slower/faster
      const trackWidth = () => {
        // width of first sequence
        let w = 0;
        for(let i=0;i<carousel.children.length/2;i++){
          w += carousel.children[i].getBoundingClientRect().width + parseInt(getComputedStyle(carousel).gap || 14);
        }
        return w;
      };
      let seqWidth = null;
      function frame(){
        if(seqWidth === null) seqWidth = trackWidth();
        pos += speed;
        if(pos >= seqWidth) pos = 0;
        carousel.style.transform = `translateX(${-pos}px)`;
        requestAnimationFrame(frame);
      }
      // set needed styles for seamless effect
      carousel.style.display = 'flex';
      carousel.style.willChange = 'transform';
      carousel.style.gap = '14px';
      carousel.style.transform = 'translateX(0)';
      requestAnimationFrame(frame);
    }
  }catch(e){ console.warn('Alt gallery load failed', e); }
}

document.addEventListener('DOMContentLoaded', loadGalleries);
