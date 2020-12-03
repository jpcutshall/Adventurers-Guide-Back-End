const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT
const mongodbURI = process.env.MONGODBURI

const app = express()
app.use(express.json())


app.use(cors())


mongoose.connection.on('error', err => console.log(err.message + ' is Mongod not running!?'))
mongoose.connection.on('disconnected', () => console.log('mongo disconnected!?'))

mongoose.connect(mongodbURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
mongoose.connection.once('open', ()=>{
    console.log('connected to mongoose!?')
})
mongoose.set('useCreateIndex', true);

// CONTROLLERS

const usersController = require('./controllers/usersController.js')

app.use('/users', usersController)



app.listen(PORT, () => {
	console.log('express listening to port : ', PORT)
})
