const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const path = require('path');

const upload = require('./config/multerConfig')

app.use(express.json());
app.use(express.urlencoded({urlencoded: true}));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

const userModel = require('./models/user');
const postModel = require('./models/post');

app.get("/", (req, res) => {
    res.render('index');
})

app.post('/create', async (req, res) => {
    const {name, email, username, password, age} = req.body;

    const user = await userModel.findOne({email});
    if(user) return res.status(500).send("Email already exist");

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const createdUser = await userModel.create({
                name,
                username,
                password : hash, 
                age,
                email
            })
            const token = jwt.sign({email: createdUser.email, userId: createdUser._id}, 'abcd');
            res.cookie('token', token);
            res.redirect("/profile");
        })
    })

})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if(!user) return res.status(500).send("Something is wrong");

    bcrypt.compare(password, user.password, (err, result) => {
        if(result)
        {
            const token = jwt.sign({email: user.email, userId: user._id}, 'abcd');
            res.cookie('token', token);
            res.status(200).redirect("/profile");
        }
        else
            return res.status(500).send("Something is wrong");
    })
})

app.get('/logout', (req, res) => {
    res.cookie('token', "");
    res.redirect('/login');
})

// Middleware
const isLoggedin = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(500).redirect('/login');
    else
    {
        const access = jwt.verify(token, 'abcd');
        req.user = access;
        next();
    }
}

app.get('/profile', isLoggedin, async (req, res) => {
    const user = await userModel.findOne({email: req.user.email}).populate('posts');
    res.render('profile', {user});
})


app.post('/post', isLoggedin, async (req, res) => {
    const user = await userModel.findOne({email: req.user.email});
    const {content} = req.body;
    const post = await postModel.create({
        user: user._id,
        content
    })
    
    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile')
})

app.get('/like/:id', isLoggedin, async (req, res) => {
    const post = await postModel.findOne({_id: req.params.id});

    const index = post.likes.indexOf(req.user.userId);
    if(index == -1)
    {
        post.likes.push(req.user.userId);
    }
    else
    {
        post.likes.splice(index, 1);
    }
    await post.save();

    res.redirect('/profile');
})

app.get('/edit/:id', isLoggedin, async (req, res) => {
    const post = await postModel.findOne({_id: req.params.id});
    res.render('edit', {post});
})

app.post('/edit/:id', async (req, res) => {
    await postModel.findOneAndUpdate({_id: req.params.id}, {content: req.body.content});
    res.redirect('/profile');
})

app.get('/profile/upload', (req, res) => {
    res.render('file');
})

app.post('/upload', isLoggedin, upload.single('image') , async (req, res) => {
    
    const user = await userModel.findOne({email: req.user.email});
    user.profilepic = req.file.filename;
    await user.save();
    res.redirect('/profile')
})


app.listen(3000);