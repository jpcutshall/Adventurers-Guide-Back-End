const express = require('express')
const users = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth.js')
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

// REGISTER USER
users.post('/register', async (req, res) => {
	try {
		let { email, password, passwordCheck, username } = req.body
		// ERROR CHECKING
		if( !email || !password || !passwordCheck) {
			return res.status(400).json({msg: "Not all fields have been entered."})
		}
		if(password.length < 5){
			return res.status(400).json({msg: "The password needs to be atleast 5 characters long."})
		}
		if (password !== passwordCheck) {
			return res.status(400).json({msg: "Passwords do not match!"})
		}
		const existingUser = await User.findOne({email: email })
		if (existingUser) {
			return res.status(400).json({msg: "An account with this email already exists"})
		}
		if (!username) {
			username = email
		}

		// Password HASHING
		const salt = await bcrypt.genSalt()
		const passwordHash = await bcrypt.hash(password, salt)

		const newUser = new User({
			email,
			password: passwordHash,
			username
		})
		const savedUser = await newUser.save()
		res.status(200).json(savedUser)

	} catch (err) {
		res.status(500).json({error: err.message})
	}

})

// LOGIN
users.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({ msg: "not all fields have been Entered."})
		}

		const user = await User.findOne({ email: email})
		if (!user) {
			return res.status(400).json({ msg: "No account with this email is registered"})
		}
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ msg: "Invalid email or Password"})
		}

		
		// JAV WEB TOKEN
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 60 * 60})
		console.log(`Logged in! ${token}`);
		res.json({
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email
			}
		})

	} catch (err) {
		res.status(500).json({ error: err.message })
	}
})

users.get('/', auth, async (req, res) => {
	const user = await User.findById(req.user)

	res.json({
		username: user.username,
		email: user.email,
		id: user._id
	})
})

users.delete('/delete', auth, async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.user)
		res.status(200).json(deletedUser)

	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

users.post("/tokenIsValid", async (req, res) => {
	try {
		const token = req.header("x-auth-token")
		if(!token){
			return res.json(false)
		}
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		if(!verified){
			return res.json(false)
		}
		const user = await User.findById(verified.id)
		if(!user){
			return res.json(false)
		}

		return res.json(true)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
})

module.exports = users
