require('dotenv').config()
const express = require('express')
const cors = require('cors')
const route = require('./routes')
require('./databaseconnection')

const todolistServer = express()
todolistServer.use(cors())
todolistServer.use(express.json())
todolistServer.use(route)

PORT = 4000 ||process.env.PORT
todolistServer.listen(PORT, ()=>{
console.log(`Server running Successfully at port number ${PORT} `);

})