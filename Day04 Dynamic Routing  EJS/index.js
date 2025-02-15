const express = require('express');
const app = express();
const path = require('path');

app.use(express.json()); // 
app.use(express.urlencoded({
    extended: true
})); // The above 5, 6, 7 nad 8 lines are used for form handling
app.use(express.static(path.join(__dirname, 'public'))); // Fetch all static file in public folder
app.set('view engine', 'ejs'); // to render ejs files

app.get("/", (req, res) => {
    res.render("index");
})

// This is used to create dynamic routes
app.get("/profile/:username", (req, res) => {
    res.send(req.params.username);
})

// This is another dynamic route
app.get("/author/:username/:age", (req, res) => {
    res.send(`Welcome, ${req.params.username} of age ${req.params.age}`);
})

app.listen(3000);