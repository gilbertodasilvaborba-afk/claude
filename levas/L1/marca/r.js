const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [f,w,h] of [['logo',1080,1080],['banner',1640,624],['preco',1080,1080],['banner_lado',1640,624],['banner_lados',1640,624]]){
const p=await b.newPage({viewport:{width:w,height:h}});await p.goto('file://'+process.cwd()+'/'+f+'.html');await p.waitForTimeout(500);await p.screenshot({path:f+'.png'});}
await b.close()})()
