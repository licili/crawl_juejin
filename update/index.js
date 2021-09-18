let read = require('./read')
let write = require('./write')
const puppeteer = require('puppeteer')
const {query} = require('../db')

!(async function () {
   let browser = await puppeteer.launch({
     args: [
       '--disable-setuid-sandbox',
       '--no-sandbox',
     ],
    //  headless: false,
    //  userDataDir: "./data"
   })
   let page = await browser.newPage()
   page.setViewport({
     width: 1920,
     height: 1080
   })

  let tagUrl = 'https://juejin.cn/subscribe/all'
  // 读取标签列表
  // let tags = await read.tags(tagUrl,page)
  // 把标签写入数据库中保存
  console.log('标签读取成功')

  // await write.tags(tags)

  let tags = await query('select * from tags')
  console.log(tags)
 
  let allArticles = {}
  // 标签有很多，不同的标签下面的文章可能会重复
  for (tag of tags) {
    console.log(`开始读取${tag.name}的文章`)
    let articles = await read.articleList(`https://juejin.cn${tag.href}`,page)
    articles.forEach(article => allArticles[article.id] = article)
  }
  console.log(allArticles)
  // {id,article}
  // 保存文章
  await write.articles(Object.values(allArticles))
  // 退出
  process.exit()
})()