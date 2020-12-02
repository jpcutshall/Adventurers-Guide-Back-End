const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const session = require('express-session')
require('dotenv').config()
const PORT = process.env.PORT
const mongodbURI = process.env.mongodbURI
app.use(express.json())

const whitelist = ['http://localhost:3000']
const corsOptions = {
	origin: (origin, callback) => {
		if(whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('CORS BLOCKED IT'))
		}
	}, credentials: true
}

app.use(cors(corsOptions))
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialiazed: false
  })
)

mongoose.connection.on('error', err => console.log(err.message + ' is Mongod not running!?'))
mongoose.connection.on('disconnected', () => console.log('mongo disconnected!?'))

mongoose.connect(mongodbURI, { useNewUrlParser: true , useUnifiedTopology: true})
mongoose.connection.once('open', ()=>{
    console.log('connected to mongoose!?')
})

// CONTROLLERS




app.listen(PORT, () => {
	console.log('express listening to port : ', PORT)
})
