const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = Schema({
	name: { type: String, required: true, unique: true},
	about: String,
	background: String,
	camping: String,
	gtk: String,
	lat: String,
	long: String,
	tags: String,
	user: {type: String, ref: 'User'}

}, { timestamps: { createdAt: 'created_at'}})

const Post = mongoose.model('Post', postSchema)

module.exports = Post