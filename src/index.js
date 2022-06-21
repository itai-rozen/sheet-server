const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const serverless = require('serverless-http')
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


 db.connect(err => {
  if (err) console.log('error: ', err)
  console.log('connected sql')
})



const sqlQuery = query => {
  const [rows] = db.query(query, (err, results) => {
    if (err) console.log('Error: ', err)
    return results
  })
  console.log('res: ', rows)
  return rows
}

getSqlInsertQuery = (tableName, obj) => `INSERT INTO ${tableName} (${Object.keys(obj).join()}) VALUES (${Object.values(obj).map(val => `'${val}'`).join()});`

router.get('/', (req, res) => {
  db.query("SELECT * FROM invites limit 1;", (err,results) => {
    res.send(results)
  })
})

router.post('/', (req, res) => {
  console.log('/')
  // const query = ` ;`
  const { body } = req
  console.log('body : ', body.toString())
  const query = getSqlInsertQuery('all_rows', JSON.parse(body.toString()))
  sqlQuery(query)
  res.send('success')
})

router.post('/invalid', (req, res) => {
  const { body } = req
  const query = getSqlInsertQuery('invalid_rows', body)
  sqlQuery(query)
  res.end()
})

router.post('/create-table', async (req, res) => {
  console.log('/create-table')
  const { body } = req
  const query1 = "DROP TABLE IF EXISTS all_rows,invalid_rows,valid_rows;"
  const query2 = `CREATE TABLE all_rows(${body.map(key => key !== 'rowNum' ? `${key} text` : `${key} int PRIMARY KEY NOT NULL`).join()} );`
  const query3 = `CREATE TABLE invalid_rows(rowNum INT,problem VARCHAR(255),value TEXT,FOREIGN KEY (rowNum) REFERENCES all_rows(rowNum) );`
  try {
    sqlQuery(query1)
    sqlQuery(query2)
    sqlQuery(query3)
  } catch (err) {
    console.log(err)
  }
  res.end()
})

app.use('/.netlify/functions/index', router)

module.exports.handler = serverless(app)
// app.listen(process.env.PORT || 3001, () => console.log('listening on port 3001'))