
document.addEventListener('DOMContentLoaded', async ()=>{
  // load config
  let cfg = null;
  try{ cfg = await fetch('config.json').then(r=>r.json()); }catch(e){}

  // Ensure telegram links for CTAs and pricing
  const mainTg = 'https://t.me/pixPLaceBot?start=landing-page-main-buton';
  const openTg = 'https://t.me/pixPLaceBot?start=landing-page-open-in-telegram-buton';
  document.querySelectorAll('a[href*="stripe"]').forEach(a=> a.href = mainTg);
  document.querySelectorAll('a').forEach(a=>{
    if(a.classList.contains('btn-footer')) a.href = openTg;
  });
  // Pricing links
  document.querySelectorAll('a').forEach(a=>{
    if(a.textContent && a.textContent.trim().toLowerCase()==='starter') a.href='https://t.me/pixPLaceBot?start=landing-page-tarif-starter-buton';
    if(a.textContent && a.textContent.trim().toLowerCase()==='creator') a.href='https://t.me/pixPLaceBot?start=landing-page-tarif-creator-buton';
    if(a.textContent && a.textContent.trim().toLowerCase()==='studio') a.href='https://t.me/pixPLaceBot?start=landing-page-tarif-studio-buton';
  });

  // Language dropdown: populate from config if present, else fallback list
  const langs = (cfg && cfg.languages) ? cfg.languages : ['en','ru','es','fr','de','zh','pt-br','ar','hi','ja','it','ko','tr','pl'];
  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');
  if(langBtn && langMenu){
    langMenu.innerHTML = '';
    langs.forEach(l=>{
      const li = document.createElement('li');
      li.textContent = l;
      li.style.cursor='pointer';
      li.addEventListener('click', ()=>{
        // if there is a dedicated page like ru.html navigate, else try to load locale and replace texts
        const page = (l==='en') ? 'index.html' : (l + '.html');
        fetch(page, {method:'HEAD'}).then(r=>{
          if(r.ok) window.location.href = page;
          else {
            // try to load locales/<code>.json into current page
            const code = l;
            fetch('locales/' + code + '.json').then(r2=>{
              if(r2.ok) return r2.json();
              throw new Error('no locale');
            }).then(data=>{
              document.querySelectorAll('[data-i18n]').forEach(el=>{
                const key = el.getAttribute('data-i18n');
                if(data[key]) el.innerText = data[key];
              });
              langMenu.style.display='none';
            }).catch(e=>{ alert('No page or locale for ' + l); });
          }
        }).catch(()=>{ alert('Cannot switch to ' + l); });
      });
      langMenu.appendChild(li);
    });
    langBtn.addEventListener('click', ()=>{
      langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block';
    });
  }
});
