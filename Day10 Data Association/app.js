const express = require('express');
const app = express();

const userModel = require('./models/user');
const postModel = require('./models/post');
const user = require('./models/user');

app.get("/", (req, res) => {
    res.send("hello");
})

app.get('/create', async (req, res) => {
    const user = await userModel.create({
        username: 'Indra',
        email: 'indrajitmondal@4t.com',
        age: 21,
    })
    res.send(user);
})

app.get('/post/create', async (req, res) => {
    const post = await postModel.create({
        postTitle: "Hello 1st post",
        user: "67bdb667527ed7c7e66354be",
    })

    const user = await userModel.findOne({_id: "67bdb667527ed7c7e66354be"});
    user.posts.push(post._id);
    await user.save();
    res.send({post, user});
})

app.listen(3000);