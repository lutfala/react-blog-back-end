const express = require('express')
const mongoose = require('mongoose')
//cross origin request:
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message))


//Schema = blueprint

const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    image: String,
    content: String
})

const Post = mongoose.model('Post', postSchema)

//talking with the database. Why async? We have to wait for the response. The response have to come first before this is executed.
//Below are all the controllers

//get all posts - when we load the homepage
app.get('/posts', async(req,res) => {
    const post = await Post.find()
    res.send(post)
})

//get one post - when we go to post individual page
app.get('/posts/:id', async(req,res) => {
    const post = await Post.findById(req.params.id)
    res.send(post)
})

//create new post
app.post('/posts', async(req,res) => {
    //taking data running through the blueprint
    const newPost = new Post(req.body)
    //below it will save to the database
    const savedPost = await newPost.save()
    //send that data back to the frontend
    res.send(savedPost)
}) 

//delete post
app.delete('/posts/:id', async(req,res) => {
    await Post.findByIdAndDelete(req.params.id)
    res.status(200).send('Post deleted')
})

app.listen(3000, () => console.log('Server started on port 3000'))
