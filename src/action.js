const https    = require('https'),
      fs       = require('fs'),
      puppeteer = require('puppeteer');
      require('dotenv').config();

let   mail      = process.env.MAIL,
      key       = process.env.KEY,
      phone     = process.env.PHONE,
      tweetText = "Art peeked from Midjourney's Community showcase.\nPrompt for each image is in its ALT.",
      store    = [],
      imgAlt   = [];
      fillStore();


//Scraping Images from Midjourney
https.get('https://www.midjourney.com/showcase/recent/', (resp)=>{

  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response data has been received.
  resp.on('end', async () => {

       let parsedResponse = JSON.parse( data.slice(data.match('{"props"')['index'], data.match('scriptLoader')['index']+17) );

        let filed = parsedResponse['props']['pageProps']['jobs'];
        await download(filed[store[0]]['event']['seedImageURL'],'image1', filed[store[0]]['event']['textPrompt'][0])
        await download(filed[store[1]]['event']['seedImageURL'],'image2', filed[store[1]]['event']['textPrompt'][0])
        await download(filed[store[2]]['event']['seedImageURL'],'image3', filed[store[2]]['event']['textPrompt'][0])
        await download(filed[store[3]]['event']['seedImageURL'],'image4', filed[store[3]]['event']['textPrompt'][0])

  });

  
}).on("error", (err) => {
    console.error("Error: " + err.message);
});
    

//Launching Puppeteer to do the Twitter Magic
(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  await page.goto('https://twitter.com/i/flow/login')

  // Making sure the page is loaded by checking if the
  // X button is on the page with XPath
  await page.waitForXPath("//div[@role='button']")

  //Type in email address
  await page.type('.r-30o5oe', mail, {delay: 100})
  
  // Find and click NEXT button element after 
  //  mail form is filled
  const nextBtn = await page.$$('.r-13qz1uu')
  await nextBtn[9].click()

  //Wait for page to load
  await page.waitForXPath("//div[@role='button']")

  //check to see if Twitter thinks code is a bot, by checking if there is a mention of phone in header
  const twBotCheck = await page.$eval('#modal-header', el => el.children[0].children[0].innerText.includes('phone'));

  //If it asks, we give number
  if(twBotCheck){
      await page.keyboard.type(phone, {delay: 100});
      const nxt = await page.$('.r-19yznuf')
      await nxt.click()
  }

  //Wait for new password login page to load
  await page.waitForXPath("//div[@role='button']")

  //Imitate human keyboard press to fill in password
  await page.keyboard.type(key, {delay: 100});

  //Click login button
  await page.$eval('.r-pw2am6', el => {el.children[0].click()});


  //Making sure Tweet Button is available
  await page.waitForSelector('.r-e7q0ms')
  await page.click('.r-e7q0ms')

  //Wait. then type in Tweet text
  await page.waitForSelector('.r-5vhgbc')
  await page.keyboard.type(tweetText,{delay:10});


  //FETCHING IMAGES FROM FILE SYSTEM

  const [filechooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('.r-5vhgbc')
  ])
  
  filechooser.accept(['image1.png','image2.png','image3.png', 'image4.png'])
  

  //ALT Texts

  //Wait for selector
  await page.waitForSelector('.r-170w6zn')

  //(IMG 1)
  //Click Edit
  await page.$$eval('.r-170w6zn', el => el[0].children[0].click());
  //Wait for selector
  await page.waitForSelector('.r-cpa5s6')
  //Click ALT
  await page.$$eval('.r-cpa5s6', el => el[1].children[0].click());
  //Type in ALT
  await page.keyboard.type(imgAlt[0],{delay:10});
  //Save
  await page.$$eval('.r-19u6a5r', el => el[0].click());
  
    //(IMG 2)
  //Click Edit
  await page.$$eval('.r-170w6zn', el => el[2].children[0].click());
  //Wait for selector
  await page.waitForSelector('.r-cpa5s6')
  //Click ALT
  await page.$$eval('.r-cpa5s6', el => el[1].children[0].click());
  //Type in ALT
  await page.keyboard.type(imgAlt[1],{delay:10});
  //Save
  await page.$$eval('.r-19u6a5r', el => el[0].click());


    //(IMG 3)
  //Click Edit
  await page.$$eval('.r-170w6zn', el => el[1].children[0].click());
  //Wait for selector
  await page.waitForSelector('.r-cpa5s6')
  //Click ALT
  await page.$$eval('.r-cpa5s6', el => el[1].children[0].click());
  //Type in ALT
  await page.keyboard.type(imgAlt[2],{delay:10});
  //Save
  await page.$$eval('.r-19u6a5r', el => el[0].click());


    //(IMG 4)
  //Click Edit
  await page.$$eval('.r-170w6zn', el => el[3].children[0].click());
  //Wait for selector
  await page.waitForSelector('.r-cpa5s6')
  //Click ALT
  await page.$$eval('.r-cpa5s6', el => el[1].children[0].click());
  //Type in ALT
  await page.keyboard.type(imgAlt[3],{delay:10});
  //Save
  await page.$$eval('.r-19u6a5r', el => el[0].click());


  //Post Tweet
  const tweet = await page.$$('.r-l5o3uw')
  await tweet[1].click()

  //Wait till Tweet is sent (when Modal closes)
  await page.waitForSelector('.r-rsyp9y', {hidden:true})

  //Deleting Images from devices
  deleteImgs();



  //Test Phase
  //Taking Screenshots
  // await page.screenshot({ path: 'test6.png' })


  await browser.close();
})();



//UTILITY FUNCTIONS

//Array filling function
function fillStore(Qt = 4){
    while (store.length < Qt){
        nValue = getRandomInt(0, 80);
        if(!store.includes(nValue)){
            store.push(nValue);
        }
    }
}


//Generating Random Integer
function getRandomInt(min, max) {
    min = Math.ceil(min);max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//Saving Images to Disk(Download)
async function download(uri,fileName, alt){

    const file = fs.createWriteStream(`./${fileName}.png`);

    const downloadImg = https.get(uri,(res)=>{
        res.pipe(file);

        file.on('finish', ()=>{file.close()});
    })
    downloadImg.on('error', (err)=>{console.error(err)})
    downloadImg.end();

    imgAlt.push(alt.slice(0,1000));
}


//Delete downloaded images
function deleteImgs(){
    try {
        fs.unlinkSync('./image1.png');
        fs.unlinkSync('./image2.png');
        fs.unlinkSync('./image3.png');
        fs.unlinkSync('./image4.png');
    } catch (error) {
        console.error('an error occured while deleting.')
    }
}