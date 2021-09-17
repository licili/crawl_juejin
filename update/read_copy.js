const puppeteer = require('puppeteer')

const sleep = time=>new Promise(resolve=>{
    setTimeout(resolve,time)
})



  

exports.tags = async function (url) {
  console.log(`start visit page ${url}`)
  let browser = await puppeteer.launch({
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ]
  })
  let page = await browser.newPage()
  page.setViewport({
    width: 1920,
    height:1080
  })

  await page.goto(url)

  await sleep(3000);
  let result = await page.$$eval('.tag-list .item .info-box', lists => lists.filter((item,index) => index <= 5).map(list => {
    let href = list.querySelector('a').getAttribute('href')
    let image = list.querySelector('a img.thumb').getAttribute('src')
    let name = list.querySelector('a div.title').innerText
    return {
      href,
      image:image,
      name
    }
  }))
  return result
}


// exports.tags('https://juejin.cn/subscribe/all').then(res => {
//   console.log(res)
// })


exports.articleList = async function (url) {
  console.log('开始爬取articleList')

  let browser = await puppeteer.launch({
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ]
  })
  let page = await browser.newPage()
  page.setViewport({
    width: 1920,
    height:1080
  })

  await page.goto(url)
  console.log('进入url')
  await sleep(1000);

  let result = await page.$$eval('.content-box .content-main a.title', links => {
    return links.map( link => {
      let title = link.innerText
      let href = link.href
      let id = href.slice(-19)
      return {
        title,
        href,
        id
      }
    })
  })

  for (let i = 0; i < result.length; i++) {
    let res = result[i]
    await page.goto(res.href)
    await sleep(3000);
    await page.waitForSelector(".article-content");
    let content = await page.$eval('.article-content', el => el.innerHTML)
    let tags = await page.$$eval('.tag-title',tags => [... new Set(tags.map(tag => tag.innerText))])
    result[i].content = 'content'
    result[i].tags = tags
    console.log(`爬取完${i+1}条数据`)
  }


  console.log(`爬取完闭`)
  await browser.close()
  return result
}
exports.articleList('https://juejin.cn/tag/%E5%89%8D%E7%AB%AF').then(result => {
  console.log(result)
})


