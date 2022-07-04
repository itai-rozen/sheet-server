const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
// const serverless = require('serverless-http')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

 const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT
  })


const sqlQuery = query => {
  console.log('hi sqlQuery ', query)
  const rows = db.query(query, (err, results) => {
    if (err) console.log('Error: ', err)
    return results
  })
  console.log('res: ', rows)
  return rows
}

getSqlInsertQuery = (tableName, obj) => `INSERT INTO ${tableName} (${Object.keys(obj).join()}) VALUES (${Object.values(obj).map(val => `'${val}'`).join()});`

app.get('/invites', (req, res) => {
  console.log('entered app.get')
  db.query("SELECT * FROM invites limit 1;", (err,results) => {
    if (err) res.send(err.message)
    else res.send(results)
  })
})

// app.get('/', (req,res) => res.send('yo from root'))
// app.get('/test', (req,res) => res.send('yo from test'))
// app.post('/test', (req,res) => {
//   const { body } = req
//   console.log('body: ',body)
//   res.send('ok')
// })
app.post('/', (req, res) => {
  const { body } = req
  const query = getSqlInsertQuery('invites', body)
  sqlQuery(query)
  res.send('success')
})




// app.use('/.netlify/functions/index', router)

// module.exports.handler = serverless(app)
const port = process.env.PORT || 3001 
app.listen(port, () =>  db.connect(err => {
  if (err) throw ('error @connect: ', err)
  console.log('connected sql, listening on port: ',port)
})
)