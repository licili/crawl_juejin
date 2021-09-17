
const { query } = require('../db')

// 此方法把标签数组保存到MYSQL数据库中
exports.tags = async function (tags) {
  for (tag of tags) {
    let oldTags = await query(`SELECT * FROM tags WHERE name=?`, [tag.name])
    if (Array.isArray(oldTags) && oldTags.length > 0) {
      await query(`UPDATE tags SET href=?,image=? WHERE id=?`,[tag.href,tag.article,tag.id])
    } else {
      await query(`INSERT INTO tags(name,href,image) VALUES (?,?,?)`, [tag.name, tag.href,tag.image])
    }
  }
}
// 一个文章关联多个标签，一个标签可能有多个文章，所以要建立一个关联表
exports.articles = async function (articles) {
  for (article of articles) {
    let oldArticles = await query(`SELECT * FROM articles WHERE id=?`, [article.id])
    if (oldArticles.length > 0) {
      console.log('update')
      await query(`UPDATE articles SET title=?,content=?,href=? WHERE id =?`,[article.title,article.content,article.href,article.id])
    } else {
       console.log('insert')
      await query(`INSERT INTO articles(id,title,content,href) VALUES (?,?,?,?)`, [article.id,article.title,article.content,article.href])
    }
    // 处理文章标签关系 先删除文章所有的标签，然后再插入
    await query(`DELETE FROM article_tag WHERE a_id=?`, [article.id])
    // 查询此文章对应标签的ID数组
    let tagWhere = "'" + article.tags.join("','") + "'"
    let tagIds = await query(`SELECT id FROM tags WHERE name IN(${tagWhere})`)
    // [{id:1},{id:2}]
    for (tagId of tagIds) {
      await query(`INSERT INTO article_tag(a_id,t_id) VALUES(?,?)`,[article.id,tagId.id])
    }
  }
}
