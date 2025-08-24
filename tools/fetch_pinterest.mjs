
// Usage: node tools/fetch_pinterest.mjs
// Reads config.json (board URL), fetches images, writes gallery.json
import fs from 'fs/promises';
import fetch from 'node-fetch';

async function run(){
  const cfg = JSON.parse(await fs.readFile('config.json','utf-8'));
  const board = cfg.gallery?.board;
  if(!board) throw new Error('No board in config.json');

  const html = await (await fetch(board, { headers: { 'User-Agent': 'Mozilla/5.0' }})).text();
  const m = html.match(/<script id="__PWS_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if(!m) throw new Error('Pinterest payload not found');
  const data = JSON.parse(m[1]);
  // Heuristic extraction of images
  const imgs = new Set();
  const titles = new Map();
  function walk(obj){
    if(!obj) return;
    if (Array.isArray(obj)){
      obj.forEach(walk);
    } else if (typeof obj === 'object'){
      for(const k in obj){
        if (k==='images' && obj[k]){
          for(const size in obj[k]){
            const url = obj[k][size]?.url;
            if (url && url.includes('pinimg.com')){
              imgs.add(url);
              const t = obj['title'] || obj['grid_title'] || obj['seo_title'] || obj['rich_metadata?.title'];
              if (t) titles.set(url,t);
            }
          }
        }
        walk(obj[k]);
      }
    }
  }
  walk(data);
  const out = Array.from(imgs).slice(0,200).map(u=>({url:u, title: titles.get(u) || '', description:''}));
  await fs.writeFile('gallery.json', JSON.stringify(out,null,2));
  console.log(`Saved ${out.length} images to gallery.json`);
}

run().catch(e=>{
  console.error(e);
  process.exit(1);
});
