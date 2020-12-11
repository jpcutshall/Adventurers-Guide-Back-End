const express = require('express')
const posts = express.Router()
const Post = require('../models/posts.js')
const auth = require('../middleware/auth.js')

posts.get('/all', async (req, res) => {
    const posts = await Post.find({})
    res.json(posts)
})

posts.post('/', auth, async (req, res) => {

    try {
        let { name, about, gtk, camping, background, lat, long, tags, user} = req.body
        
        if (!name || !about) {
            return res.status(400).json({msg: "Please atleast fill out the name and about field"})
        }
        const existingPost = await Post.findOne({ name: name })
        if (existingPost) {
            return res.status(400).json({msg: "A post with this name already exists!"})
        }

        const newPost = new Post({ 
            name, about, gtk, camping, background, lat, long, tags,
            user
        })
        const savedPost = await newPost.save()
        res.json(savedPost)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

posts.delete('/:id', auth, async (req, res) => {
    const post = await Post.findOne({_id: req.params.id})
    if (!post) {
        return res.status(400).json({ msg: "No Post found with this ID"})
    }
    const deletedPost = await Post.FindByIdAndDelete(req.params.id)
    res.json(deletedPost)
})

posts.get('/:id', async (req, res) => {
    try {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404).json({ msg: "No Post found with this ID"})
    }
    res.json(post)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

})

module.exports = posts