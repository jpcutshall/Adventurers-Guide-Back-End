const express = require('express')
const users = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/users.js')


// GET ALL USERS !!! FOR THE ADMIN
users.get('/', (req, res) => {
	User.find({}, (err, foundUsers) => {
		if (err) {
			res.status(400).json({ error: err.message })
		}
		res.status(200).json(foundUsers)
	})
})

users.post('/', async (req, res) => {
	req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))

	User.create(req.body, (err, createdUser) => {
		if (err) {
			res.status(400).json({ error: err.message })
		}
		console.log('User Created : ', createdUser)
		res.status(201).json(createdUser)
	})
})

users.get('/:id', (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if (err) {
			res.status(400).json({ error: err.message })
		}
		console.log('Found User : ', foundUser)
		res.status(200).json(foundUser)
	})
})

users.delete('/:id', (req, res) => {
	User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
		if (err) {
			res.status(400).json({ error: err.message })
		}
		console.log(`User Deleted : ${deletedUser}`)
		res.status(200).json(deletedUser)
	})
})

users.put('/:id', (req, res) => {
	req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
	User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedUser) => {
		if (err) {
			res.status(400).json({ error: err.message })
		}
		console.log(`Updated User : ${updatedUser}`)
		res.status(200).json(updatedUser)
	})
})

module.exports = users
