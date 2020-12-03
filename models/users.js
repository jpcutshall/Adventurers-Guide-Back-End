const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
	email: { type: String, unique: true, required: true },
	username: { type: String },
	password: { type: String, required: true }

}, { timestamps: { createdAt: 'created_at'}})

const User = mongoose.model('User', userSchema)

module.exports = User
