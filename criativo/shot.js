const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(async()=>chromium.launch());
const p=await b.newPage({viewport:{width:1080,height:1080}});
await p.goto('file://'+__dirname+'/chupeta.html');await p.screenshot({path:'criativo-chupeta.png'});await b.close()})();
