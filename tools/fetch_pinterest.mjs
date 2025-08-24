
// Usage: node tools/fetch_pinterest.mjs
import fs from 'fs/promises';
import fetch from 'node-fetch';

async function extractImagesFromBoard(boardUrl){
  const html = await (await fetch(boardUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }})).text();
  const m = html.match(/<script id="__PWS_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if(!m) throw new Error('Pinterest payload not found for ' + boardUrl);
  const data = JSON.parse(m[1]);
  const imgs = new Set();
  const titles = new Map();
  function walk(obj){
    if(!obj) return;
    if (Array.isArray(obj)) obj.forEach(walk);
    else if (typeof obj === 'object'){
      for(const k in obj){
        if (k==='images' && obj[k]){
          for(const size in obj[k]){
            const url = obj[k][size]?.url;
            if (url && url.includes('pinimg.com')){
              imgs.add(url.split('?')[0]);
              const t = obj['title'] || obj['grid_title'] || obj['seo_title'] || obj['description'] || '';
              if (t) titles.set(url.split('?')[0], t);
            }
          }
        }
        walk(obj[k]);
      }
    }
  }
  walk(data);
  const out = Array.from(imgs).slice(0,500).map(u=>({url:u, title: titles.get(u) || '', description:''}));
  return out;
}

async function run(){
  const cfg = JSON.parse(await fs.readFile('config.json','utf-8'));
  const main = cfg.gallery?.mainBoard;
  const alt = cfg.gallery?.altBoard;
  const outMainFile = cfg.gallery?.dataFileMain || 'gallery.json';
  const outAltFile = cfg.gallery?.dataFileAlt || 'gallery_alt.json';
  if(main){
    try{
      console.log('Fetching main board', main);
      const mainImgs = await extractImagesFromBoard(main);
      await fs.writeFile(outMainFile, JSON.stringify(mainImgs,null,2));
      console.log('Saved', mainImgs.length, 'to', outMainFile);
    }catch(e){ console.error('Main board fetch failed', e.message); }
  }
  if(alt){
    try{
      console.log('Fetching alt board', alt);
      const altImgs = await extractImagesFromBoard(alt);
      await fs.writeFile(outAltFile, JSON.stringify(altImgs,null,2));
      console.log('Saved', altImgs.length, 'to', outAltFile);
    }catch(e){ console.error('Alt board fetch failed', e.message); }
  }
}

run().catch(e=>{ console.error(e); process.exit(1); });
