const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
// const serverless = require('serverless-http')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const router = express.Router()

 const db = mysql.createConnection({
    host: 'nl-srv-web216.main-hosting.eu',
    user: 'u636091749_itai_the_man',
    password: process.env.MYSQL_PASS,
    database: 'u636091749_testim4itai',
    port: 3306
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
app.get('/', (req, res) => {
  db.query("SELECT * FROM invites limit 1;", (err,results) => {
    res.send(results)
  })
})

app.post('/', (req, res) => {
  const { body } = req
  const query = getSqlInsertQuery('invites', JSON.parse(body.toString()))
  sqlQuery(query)
  res.send('success')
})




// app.use('/.netlify/functions/index', router)

// module.exports.handler = serverless(app)
app.listen(process.env.PORT || 3001, () =>  db.connect(err => {
  if (err) console.log('error: ', err)
  console.log('connected sql')
})
)