const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const pages = [
 ['portada', 'index.html'],
 ['inclusion-accesibilidad', 'inclusion-accesibilidad/index.html'],
 ['bienestar-personal', 'bienestar-personal/index.html'],
 ['desarrollo-espiritual', 'desarrollo-espiritual/index.html'],
 ['educacion-aprendizaje', 'educacion-aprendizaje/index.html']
];
(async () => {
 const browser = await chromium.launch({headless:true});
 const out = 'preview-web';
 fs.mkdirSync(out,{recursive:true});
 const results = [];
 try {
  for(const device of [{id:'escritorio',width:1440,height:900},{id:'movil',width:390,height:844}]){
   const context = await browser.newContext({viewport:{width:device.width,height:device.height},deviceScaleFactor:1,reducedMotion:'reduce'});
   const tab = await context.newPage();
   for(const [name,relative] of pages){
    const errors=[];
    tab.on('pageerror',e=>errors.push(e.message));
    const url=pathToFileURL(path.resolve(relative)).href;
    await tab.goto(url,{waitUntil:'load'});
    await tab.screenshot({path:path.join(out,device.id+'-'+name+'.png'),fullPage:true,animations:'disabled'});
    const overflow=await tab.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
    const heading=await tab.locator('h1').first().textContent();
    results.push({device:device.id,page:name,heading,overflow,jsErrors:errors});
    if(overflow) throw new Error('Desbordamiento horizontal: '+name+' '+device.id);
    if(errors.length) throw new Error('JS '+name+': '+errors.join('; '));
   }
   await context.close();
  }
  fs.writeFileSync(path.join(out,'resultados.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
 } finally {await browser.close()}
})().catch(err=>{console.error(err);process.exitCode=1});
