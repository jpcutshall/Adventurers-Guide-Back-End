const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = Schema({
	name: { type: String, required: true, unique: true},
	about: String,
	history: String,
	camping: String,
	gtk: String,
	lat: String,
	long: String,
	tags: Array,

})
