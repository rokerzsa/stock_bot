const fetch = require('node-fetch');
const jsdom = require('jsdom');
var CronJob = require('cron').CronJob;


async function fetchHTML(url){
  try{
    //access the url
    const response = await fetch(url,{
      headers: {
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
  const obj = doc.window.document.querySelector('#spotValue');
  let price = obj.value;
  return price;
}
let key = 'NIFTY 50';
let url = 'https://www.moneycontrol.com/indian-indices/nifty-50-9.html';
var job = new CronJob('*/15 * * * * *', function() {
  let ms = Date.now();
  fetchHTML(url+'?dummy'+ms).then((doc)=>{
    const price = getPrice(doc);
    console.log(`${key} | Price: ${price} | Date: ${ms}`);
  });
}, null, true, 'America/Los_Angeles');
job.start();
