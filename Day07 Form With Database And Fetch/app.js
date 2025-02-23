const express = require('express')
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

const userModel = require('./model/user')

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/read', async (req, res) => {
    const userAll = await userModel.find();
    res.render('read', {users: userAll});
})

app.post('/create', async (req, res) => {
    const {name, image, email} = req.body;
    
    await userModel.create({
        name, email, image
    })
    res.redirect('/read');
})

app.get('/delete/:id', async (req, res) => {
    const userAll = await userModel.findOneAndDelete({_id: req.params.id});
    res.redirect('/read');
})

app.get('/edit/:userId', async (req, res) => {
    const user = await userModel.findOne({_id: req.params.userId});
    res.render('edit', {user});
})

app.post('/update/:id', async (req, res) => {
    const {name, email, image} = req.body;
    const userAll = await userModel.findOneAndUpdate({_id: req.params.id}, {name, email, image});
    res.redirect('/read');
})

app.listen(3000);