let read = require('./read')
let write = require('./write')

!(async function () {
  let tagUrl = 'xxx'
  // 读取标签列表
  let tags = await read.tags(tagUrl)
  // 把标签写入数据库中保存
  await write.tags(tags)
  let allArticles = {}
  // 标签有很多，不同的标签下面的文章可能会重复
  for (tag of tags) {
    let articles = await read.articleList(tag.href)
    articles.forEach(article => allArticles[article.id] = article)
  }
  // {id,article}
  
  await write.articles(Object.values(allArticles))
  // 退出
  process.exit()
})()