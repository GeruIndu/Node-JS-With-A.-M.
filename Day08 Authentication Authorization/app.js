const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bcrypt = require('bcrypt')

var jwt = require('jsonwebtoken');

app.get('/', (req, res) => {

    // How to decrypt the data
    // bcrypt.genSalt(10, (err, salt) => {
    //     bcrypt.hash("indrajit", salt, function (err, hash) {
    //         console.log(hash);
    //         // res.cookie('token', hash);
    //         res.send("Hello");
    //     });
    // });



    // How to decrypt the password
    // bcrypt.compare("indraji", "$2b$10$ilmza7w3LMqwxWRDGLQcJumWVkEmSww26R3/R.dkJIDNXhmOAM6oW", (err, res) => {
    //     console.log(res); 
    //   });

    const token = jwt.sign({email: "indrajitmondal284@gmail.com"}, "secrate"); // secrate is the key
    res.cookie("token", token);
    res.send("Hello");

})

app.get('/read', (req, res) => {

    var decoded = jwt.verify(req.cookies.token, 'secrate');
    console.log(decoded); // to print the cookies , we need to import a package called "cookie-parser"
    res.send("read successfully");
})

app.listen(3000);