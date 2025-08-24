
document.addEventListener('DOMContentLoaded', async ()=>{
  let cfg = null;
  try{ cfg = await fetch('config.json').then(r=>r.json()).catch(()=>null); }catch(e){}
  const langs = (cfg && cfg.languages) ? cfg.languages : ['en','ru','es','fr','de','zh','pt-br','ar','hi','ja','it','ko','tr','pl'];
  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');
  if(!langMenu) return;
  langMenu.innerHTML = '';
  langMenu.style.display = 'none';
  langs.forEach(l=>{
    const li = document.createElement('li');
    li.textContent = l;
    li.dataset.lang = l;
    li.style.cursor='pointer';
    li.addEventListener('click', ()=>{ selectLang(l); langMenu.style.display='none'; });
    langMenu.appendChild(li);
  });
  if(langBtn){
    langBtn.addEventListener('click', (e)=>{ e.stopPropagation(); langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block'; });
    document.addEventListener('click', ()=>{ if(langMenu) langMenu.style.display='none'; });
  }
  const navLang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  const normalized = normalizeLang(navLang, langs);
  if(normalized && normalized !== 'en'){
    const page = normalized + '.html';
    try{
      const res = await fetch(page, {method:'HEAD'});
      if(res && res.ok && !location.pathname.endsWith(page)){
        location.href = page;
        return;
      }
    }catch(e){}
  }
  await loadLocale(normalized);
  function normalizeLang(navLang, available){
    if(!navLang) return 'en';
    const ln = navLang.toLowerCase();
    if(available.includes(ln)) return ln;
    const map = {'pt-br':'pt-br','pt':'pt-br','zh-cn':'zh','zh-hans':'zh','zh-tw':'zh','en-us':'en','en-gb':'en','es-es':'es','es-419':'es','ko-kr':'ko','ja-jp':'ja','ar-sa':'ar','hi-in':'hi'};
    if(map[ln]) return map[ln];
    const primary = ln.split(/[-_]/)[0];
    if(available.includes(primary)) return primary;
    return 'en';
  }
  async function loadLocale(code){
    if(!code) code='en';
    const localePath = 'locales/' + code + '.json';
    try{
      const r = await fetch(localePath);
      if(!r.ok) return;
      const data = await r.json();
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const key = el.getAttribute('data-i18n');
        if(data[key]) el.innerText = data[key];
      });
    }catch(e){ console.warn('Locale load failed', e); }
  }
  window.selectLang = async function(code){ await loadLocale(code); };
});
