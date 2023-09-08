// const puppeteer = require("puppeteer");

const { default: puppeteer } = require('puppeteer')
const { writeFile, readFile } = require('fs/promises')
const { load } = require('cheerio')
// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto("https://www.amazon.in/");

//   const content = await page.evaluate(() => {
//     const pgtag = document.querySelector(
//       "sg-col-4-of-24 sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 sg-col s-widget-spacing-small sg-col-4-of-20"
//     );
//     return pgtag.innertext;
//   });

//   console.log(content);
//   //  await browser.close();
// })();

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage()
  await page.goto('https://www.myntra.com/')
  await page.type('.desktop-searchBar','nike shoes for men')
  await page.keyboard.press('Enter')

  await page.waitForTimeout(4000)

  // const html = await page.content()
  // await writeFile('amazon.html', html)

  const productsData = []
  const $ = load(await page.content())
  $('.results-base > li').each((_, el) => {
    const productCard = $(el);
    const title = productCard.find('.product-product').text().trim();
    const price = productCard.find('.product-price').text().trim();
    const imagelink = productCard.find('.img.img-responsive').attr('src');
    productsData.push({
     title,
     price,
     imagelink,
    })
  })
  await writeFile('products.json', JSON.stringify(productsData))
  
  page.close()

  /*const showdata = await page.evaluate(() => {
    const pgtag = document.querySelector(
      's-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis.puis-v11f16tn6b5f9e2nrycg91ik6p8.s-latency-cf-section.s-expand-last-child.s-card-border'
    );
    return pgtag.innerHTML;
  });
  
    
      console.log(showdata);

 */

}

main()
