const sleep = time=>new Promise(resolve=>{
    setTimeout(resolve,time)
})


exports.tags = async function (url,page) {

  await page.goto(url, {
    timeout:0
  })
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


exports.articleList = async function (url, page) {

  console.log(`开始爬取${url} 页面的数据`)
  await page.goto(url, { timeout: 0 })

  await page.waitForSelector(".content-box .content-main a.title");
  await sleep(2000)
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
    console.log(`读取《${result[i].title}》 详细内容`,i)
    await page.goto(result[i].href,{timeout:0})
    await sleep(3000);
    await page.waitForSelector(".article-content");
    let content = await page.$eval('.article-content', el => el.innerHTML)
    let tags = await page.$$eval('.tag-title',tags => [... new Set(tags.map(tag => tag.innerText))])
    result[i].content = content
    result[i].tags = tags
    console.log(`读取成功${i + 1} 条`)
  }
  console.log('爬取完毕')
  return result
}


