/**
 * 此文件用来读取远程接口数据
 */

const request = require('request-promise')
const cheerio = require('cheerio')

exports.tags = async function (url) {
  let options = {
    url,
    // 拿到的响应体进行解析转为$
    transform (body) {
      return cheerio.load(body) // 转为jQuery对象 $
    }
  }
  return request(options).then($ => {
    let infoBoxs = $('.item .tag .info-box')
    console.log(infoBoxs)
    let tags = []
    infoBoxs.each((index, info) => {
      let tagInfo = $(info)
      let href = tagInfo.children().first().attr('href')
      let image = tagInfo.find('div.thumb').first().data('src')
      let name = tagInfo.find('div.title').first().text()
      let subscribe = tagInfo.find('.meta-box div.subscribe').first().text()
      let article = tagInfo.find('.meta-box div.article').first().text()
      tags.push({
        name,
        image,
        href,
        subscribe,
        article
      })
    })
    return tags
  })
}

exports.articleList = async function (url) {
  let options = {
    url,
    // 拿到的响应体进行解析转为$
    transform (body) {
      return cheerio.load(body) // 转为jQuery对象 $
    }
  }
  return request(options).then($ => {
    let articleTitles = $('.item .content-box .content-wrapper')
    let articles = []
    articleTitles.each((index, item) => {
      let article = $(item)
      let href = article.find('a.title').first().attr('href')
      let title = article.find('.title .text-highlight').first().text()
      let id = href.slice(6)
      let articleDetail = await exports.articleDetail(`https://juejin.cn${href}`)
      articles.push({
        id,
        href:`https://juejin.cn${href}`,
        title,
        content: articleDetail.content,
        tags:articleDetail.tags
      })
    })
    return articles
  })
}
exports.articleDetail = async function (uri) {
  let options = {
    uri,
    // 拿到的响应体进行解析转为$
    transform (body) {
      console.log(body,"???")
      return cheerio.load(body,{ decodeEntities: false }) // 转为jQuery对象 $
    }
  }
  return request(options).then($ => {
    let title = $('h1.article-title').first().text()
    let content = $('div.article-content .markdown-body').first().html()
    return {
      title,
      content
    }
  })
}

// 掘金全部标签的地址
// let tagurl = 'https://juejin.cn/subscribe/all'

// exports.tags(tagurl).then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log(err)
// })

// let articleUrl = 'https://juejin.cn/tag/%E5%89%8D%E7%AB%AF'

// exports.articleList(articleUrl).then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log(err)
// })


let articleDetailUrl = 'https://juejin.cn/post/7005956935937687583'
exports.articleDetail(articleDetailUrl).then(res => {
  // console.log(res)
}).catch(err => {
  console.log(err)
})