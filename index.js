const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
console.log('enviroment: ',process.env.NODE_ENV)
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))


const db = mysql.createConnection({
  host: process.env.NODE_ENV === 'development'? 'localhost' : '18.233.171.245',
  user: 'root',
  password: process.env.MYSQL_PASS,
  database:'excel_rows'
})

db.connect(err => {
  if (err) throw err
  console.log('connected sql')
})

const init = () => {

}

const sqlQuery = query => {
    console.log('query: ',query)
    const res = db.query(query, (err, results) => {
      if (err) console.log('Error: ',err.sqlMessage)
      return results
    })
    return res
} 

getSqlInsertQuery = (tableName, obj) => `INSERT INTO ${tableName} (${Object.keys(obj).join()}) VALUES (${Object.values(obj).map(val => `'${val}'`).join()});` 

app.post('/', (req,res) => {
  console.log('/')
  // const query = ` ;`
  const { body } = req
  const query = getSqlInsertQuery('all_rows', body)
  sqlQuery(query)
  res.end()
})

app.post('/invalid', (req,res) => {
  const { body } = req
  const query = getSqlInsertQuery('invalid_rows', body)
  sqlQuery(query)
  res.end()
})

app.post('/create-table',  async (req,res) => {
  console.log('/create-table')
  const { body } = req
  console.log('body : ',body)
  const query1 = "DROP TABLE IF EXISTS all_rows,invalid_rows,valid_rows;"
  const query2 = `CREATE TABLE all_rows(${body.map(key => key !== 'rowNum'? `${key} text` : `${key} int PRIMARY KEY NOT NULL`).join()} );`
  const query3 = `CREATE TABLE invalid_rows(rowNum INT,problem VARCHAR(255),value TEXT,FOREIGN KEY (rowNum) REFERENCES all_rows(rowNum) );`
  try {
    sqlQuery(query1) 
    sqlQuery(query2)
    sqlQuery(query3)
  } catch(err){
    console.log(err)
  }
  res.end()
})


app.listen(process.env.PORT || 3001, () => console.log('listening on port 3001'))