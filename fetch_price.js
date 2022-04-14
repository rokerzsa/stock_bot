const fetch = require('node-fetch');
const jsdom = require('jsdom');
var CronJob = require('cron').CronJob;
let db = require('./stock_db.json')
async function fetchHTML(url){
  try{
    //access the url
    const response = await fetch(url,{
      headers: {
        'User-Agent' : 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0',
        'Cache-Control': 'no-cache'
      }
    }
  );
    //text response from url
    const body = await response.text();
    //parse text to dom output
    const doc = new jsdom.JSDOM(body);
    return doc;
  }
  catch(e){
    console.log(e);
  }
}
function getPrice(doc){
  const obj1 = doc.window.document.querySelector('#nsespotval');
  const obj2 = doc.window.document.querySelector('#bsespotval');
  const obj3 = doc.window.document.querySelector('#spotValue');
  let obj = obj1
  if(obj1==null){
    obj = obj2;
    if(obj2==null)
      obj = obj3;
  }
  else{
    obj = obj1
  }
  let price = obj.value;
  return price;
}
for(let i=0;i<db.length;i++){
  let url = db[i]["URL"];
  console.log(db[i]["SYMBOL"])
  let ms = Date.now();
  fetchHTML(url+'?dummy'+ms).then((doc)=>{
    const symbol = db[i]["SYMBOL"];
    const price = getPrice(doc);
    console.log(`SymbolPrice: ${symbol} | Price: ${price} | Date: ${ms}`);
  });
}
// var job = new CronJob('0 */1 * * * *', function() {
  
// }, null, true, 'Asia/Kolkata');
// job.start();
