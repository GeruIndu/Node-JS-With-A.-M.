const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            res.render("home");
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
            return res.status(200).send("You can logged in");
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
    res.send(req.cookies);
}

app.get('/profile', isLoggedin, (req, res) => {
    res.send("hello")
})



app.listen(3000, () => {
    console.log("server is running at http://localhost:3000");
});