const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({urlencoded: true}));
app.set('view engine', 'ejs');

const userModel = require('./models/user');
const postModel = require('./models/post');
const user = require('./models/user');

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
    res.redirect('/');
})

// Middleware
const isLoggedin = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(500).redirect('/login');
    else
    {
        const access = jwt.verify(token, 'abcd');
        res.user = access;
        next();
    }
}

app.get('/profile', isLoggedin, async (req, res) => {


    // const user = await userModel.findOne({email: req.user.email});

    console.log(req.user);
    // res.render('profile', {user});
})

app.listen(3000);