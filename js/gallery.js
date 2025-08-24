
async function loadGalleries(){
  async function tryFetch(path){
    try{ const r = await fetch(path + '?t=' + Date.now()); if(!r.ok) return null; return await r.json(); }catch(e){ return null; }
  }
  const main = await tryFetch('gallery.json');
  const alt = await tryFetch('gallery_alt.json');
  const grid = document.getElementById('gallery-grid') || document.querySelector('.masonry');
  const carousel = document.getElementById('gallery-alt') || document.querySelector('.carousel');

  if(main && main.length){
    renderMasonry(main, grid);
  } else {
    if(grid){
      const note = document.createElement('div');
      note.style.padding='10px'; note.style.color='#666'; note.innerText = 'Gallery offline: gallery.json not found. Run tools/fetch_pinterest.mjs to populate it.';
      grid.appendChild(note);
      const demo = [];
      for(let i=1;i<=9;i++) demo.push({url:'https://picsum.photos/seed/'+i+'/800/600', title:'Demo '+i, description:''});
      renderMasonry(demo, grid);
    }
  }

  if(alt && alt.length){
    renderCarousel(alt, carousel);
  } else {
    if(carousel){
      const note2 = document.createElement('div');
      note2.style.padding='10px'; note2.style.color='#666'; note2.innerText = 'Alt gallery offline: gallery_alt.json not found. Run tools/fetch_pinterest.mjs to populate it.';
      carousel.appendChild(note2);
      for(let i=0;i<8;i++){
        const img = document.createElement('img'); img.src='https://picsum.photos/seed/car'+i+'/400/300'; img.alt='Demo'; carousel.appendChild(img);
      }
    }
  }

  function renderMasonry(items, container){
    if(!container) return;
    container.innerHTML='';
    items.forEach((it, idx)=>{
      const img = document.createElement('img');
      img.src = it.url;
      img.alt = it.title || it.description || 'pixPLace artwork';
      img.loading = 'lazy';
      img.style.borderRadius = '10px';
      img.style.border = '1px solid rgba(0,0,0,0.06)';
      img.style.boxShadow = '0 10px 30px rgba(2,6,23,0.4)';
      img.style.display = 'block';
      if(idx % 7 === 0) img.style.height='520px'; else if(idx % 5 ===0) img.style.height='360px'; else img.style.height='260px';
      container.appendChild(img);
    });
  }
  function renderCarousel(items, container){
    if(!container) return;
    container.innerHTML='';
    const seq = items.slice(0,40);
    const build = (arr)=> arr.forEach(it=>{
      const img = document.createElement('img');
      img.src = it.url; img.alt = it.title || it.description || 'pixPLace artwork'; img.loading='lazy'; img.style.borderRadius='10px';
      container.appendChild(img);
    });
    build(seq); build(seq);
  }
}
document.addEventListener('DOMContentLoaded', loadGalleries);
