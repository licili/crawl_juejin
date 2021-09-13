
const { query } = require('../db')

// 此方法把标签数组保存到MYSQL数据库中
exports.tags = async function (tags) {
  for (tag of tags) {
    let oldTags = query(`SELECT * FROM tags WHERE name=?`, [tag.name])
    if (Array.isArray(oldTags) && oldTags.length > 0) {
      await query(`UPDATE tags SET image=?,subscribe=?,article=? WHERE id =?`,[tag.image,tag.subscribe,tag.article,oldTags[0].id])
    } else {
      await query(`INSERT INTO tags(name,image,suscribe,article) VALUES (?,?,?,?)`, [tag.name, tag.image, tag.suscribe, tag.article])
    }

  }
}
exports.articles = async function (articles) {
  for (article of articles) {
    let oldArticles = query(`SELECT * FROM articles WHERE id=?`, [article.id])
    if (oldArticles.length > 0) {
      await query(`UPDATE articles SET title=?,content=?,href=? WHERE id =?`,[article.title,article.content,article.href,article.id])
    } else {
      await query(`INSERT INTO articles(id,title,content,href) VALUES (?,?,?,?)`, [article.id,article.title,article.content,article.href])
    }
    // 处理文章标签关系 先删除文章所有的标签，然后再插入
    await query(`DELETE FROM article_tag WHERE article_id=?`, [article.id])
    // 查询此文章对应标签的ID数组
    let tagWhere ="'"+article.tags.join("','")+"'"
    let tagIds = await query(`SELECT id FROM tags WHERE name IN(${tagWhere})`)
    // [{id:1},{id:2}]
    for (tagId of tagIds) {
      await query(`INSERT INTO article_tag(article_id,tag_id) VALUES(?,?)`,[aticle.id,tagId.id])
    }
  }
}
