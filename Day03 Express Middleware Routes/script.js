const express = require("express");

const app = express();

// This function run always first when any request is come into this file
// This is a middleware 
app.use((req, res, next) => {
    console.log("Hello guys");
    next();
})

// this is another middleware
// both are executed one by one
app.use((req, res, next) => {
    console.log("This is another middleware");
    next();
})

app.get("/", (req, res) => {
    res.send("This is my first backend script");
})

app.get("/xyz", (req, res) => {
    res.send("how to create routes...");
})


// Error showing
app.get("/abc", (req, res, next) => {
    return next(new Error("Not implemented!!"));
})


// how to handle error
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong !!')
})


app.listen(3000);