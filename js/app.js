
document.addEventListener('DOMContentLoaded', async ()=>{
  // load config
  let cfg = null;
  try{ cfg = await fetch('config.json').then(r=>r.json()); }catch(e){}
  const mainTg = 'https://t.me/pixPLaceBot?start=landing-page-main-buton';
  const openTg = 'https://t.me/pixPLaceBot?start=landing-page-open-in-telegram-buton';
  // Ensure anchors with main CTA exist - set href where id stripeBtn exists
  document.querySelectorAll('#stripeBtn').forEach(a=> a.setAttribute('href', mainTg));
  // Pricing links: set based on order of priceCard
  const pricingLinks = [
    'https://t.me/pixPLaceBot?start=landing-page-tarif-starter-buton',
    'https://t.me/pixPLaceBot?start=landing-page-tarif-creator-buton',
    'https://t.me/pixPLaceBot?start=landing-page-tarif-studio-buton'
  ];
  document.querySelectorAll('.priceCard').forEach((card, i) => {
    const a = card.querySelector('a.btn');
    if(a) a.setAttribute('href', pricingLinks[Math.min(i, pricingLinks.length-1)]);
  });
  // Footer open in Telegram
  document.querySelectorAll('.btn-footer').forEach(a=> a.setAttribute('href', openTg));

  // Language dropdown init
  const langs = (cfg && cfg.languages) ? cfg.languages : ['en','ru','es','fr','de','zh','pt-br','ar','hi','ja','it','ko','tr','pl'];
  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');
  function applyLocale(code){
    fetch('locales/' + code + '.json').then(r=> {
      if(!r.ok) throw new Error('no locale');
      return r.json();
    }).then(data=>{
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const key = el.getAttribute('data-i18n');
        if(data[key]) el.innerText = data[key];
      });
    }).catch(()=>{ /* ignore */ });
  }
  // Initial load: try to apply page lang
  const pageLang = document.documentElement.lang || (cfg && cfg.defaultLang) || 'en';
  applyLocale(pageLang);

  if(langBtn && langMenu){
    langMenu.innerHTML = '';
    langs.forEach(l=>{
      const li = document.createElement('li');
      li.textContent = l;
      li.style.cursor = 'pointer';
      li.addEventListener('click', ()=>{
        // if static page exists (e.g., ru.html) then navigate
        const page = (l==='en') ? 'index.html' : (l + '.html');
        fetch(page, { method:'HEAD' }).then(r=>{
          if(r.ok) window.location.href = page;
          else applyLocale(l);
        }).catch(()=> applyLocale(l));
        langMenu.style.display = 'none';
      });
      langMenu.appendChild(li);
    });
    langBtn.addEventListener('click', ()=>{
      langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block';
    });
  }
});
