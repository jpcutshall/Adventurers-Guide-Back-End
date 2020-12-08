const express = require('express')
const posts = express.Router()
const Post = require('../models/posts.js')


posts.get('/', async (req, res) => {
    try {
        const posts = await Post.find({})
        console.log(posts);
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

posts.post('/new', async (req, res) => {
    try {
        let { name, about, gtk, camping, history, lat, long, tags} = req.body
        console.log(req.body);
        if (!name || ! about) {
            return res.status(400).json({msg: "Please atleast fill out the name and about field"})
        }
        const existingPost = await Post.findOne({ name: name })
        if (existingPost) {
            return res.status(400).json({msg: "A post with this name already exists!"})
        }

        const newPost = new Post({ 
            name, about, gtk, camping, history, lat, long, tags
        })
        const savedPost = await newPost.save()
        res.json(savedPost)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// posts.get('/', async (req, res) => {
//     const post = await Post.findById(req.params.id)
// })

module.exports = posts