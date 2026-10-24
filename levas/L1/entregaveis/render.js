const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [h,o] of [process.argv.slice(2)]){
const p=await b.newPage();await p.goto('file://'+process.cwd()+'/'+h);await p.waitForTimeout(800);
await p.pdf({path:o,width:'148mm',height:'210mm',printBackground:true,preferCSSPageSize:true,displayHeaderFooter:false});}
await b.close()})()
