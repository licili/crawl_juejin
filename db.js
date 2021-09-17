const mysql = require('mysql')
const Promise = require('bluebird')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database:'juejin'
})  

module.exports = {
  query:Promise.promisify(connection.query).bind(connection)
}