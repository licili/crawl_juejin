const express = require('express')
const path = require('path')
const app = express()

app.set('view engine', 'html')
app.set('views', path.resolve(__dirname, 'views'))
app.engine('html', require('ejs').__express)


const { query } = require('./db')

app.get('/', async function (req, res) {
  console.log('hhh')
  let { tagId } = req.query
  let tags = await query(`SELECT * FROM tags`)
  let articles = await query(`SELECT articles.* FROM articles INNER JOIN article_tag ON articles.id=article_tag.a_id WHERE article_tag.t_id = ?`, [tagId ? tagId : tags[0].id])
  await res.render('index',{tags,articles})

})
app.get('/detail/:id', async (req, res) => {
  let id = req.params.id
  console.log(id)
  let articles = await query(`SELECT * FROM articles WHERE id=?`, [id])
  let article = articles[0]
  let tags = await query(`SELECT * FROM tags`)
  let articleTags = await query(`SELECT tags.* FROM article_tag INNER JOIN tags on article_tag.t_id = tags.id WHERE article_tag.a_id=?`, [id])
  res.render('detail',{article,articleTags,tags})
})
app.listen(8080,_ => {
  console.log('server is running at 8080')
})

// 定时执行任务
const CronJob = require('cron').CronJob
// // // 引入子进程
const {spawn} = require('child_process')
// // // 每个30min跑一次index.js
// const job = new CronJob('0 */30 * * * *', function () {
//   let child = spawn(process.execPath, [path.resolve(__dirname, 'update/indexjs')])
//   // 子进程输出，有日志就打印
//   child.stdout.pipe(process.stdout)
//   child.stderr.pipe(process.stderr)
//   child.on('error', function () {
//     console.log('任务执行出错')
//   })
// })
// job.start()