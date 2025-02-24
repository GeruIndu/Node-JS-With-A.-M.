const express = require('express')
const app = express();
const path = require('path')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const userModel = require('./model/user')

app.get('/', (req, res) => {
    res.render("index");
})

app.post('/create',  (req, res) => {
    const {name, email, password, age} = req.body;
    
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const user = await userModel.create({
                name,
                email,
                password : hash,
                age
            });
            res.send(user);
        })
    })

    const token = jwt.sign({email}, 'mykey12');
    res.cookie('token', token);
    return res.redirect('/home');

})

app.get('/home', (req, res) => {
    res.render("home");    
})

app.get('/logout', (req, res) => {
    res.cookie('token', "");
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email: email});

    if(!user)
        res.render('default');
    else {
        bcrypt.compare(password, user.password, (err, result) => {
            if(result)
                {
                    const token = jwt.sign({email}, 'mykey12');
                    res.cookie('token', token);
                    res.redirect('/home');
                }
                else    
                res.render('default');
        })
    }
})

app.listen(3000);