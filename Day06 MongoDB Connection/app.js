const express = require("express")
const app = express();
const userModel = require('./userModel');


app.get('/', (req, res) => {
    res.send("Hello World!!");
})

app.get('/create', async (req, res) => {
    const user = await userModel.create({
        name: "Liza Rakshit",
        username: "liza172",
        email: "lizarakshit@gmail.com",
    });
    res.send(user);
})

app.get('/update', async (req, res) => {
                                                // which based on Search   // Which you want to modify
    const user = await userModel.findOneAndUpdate({username: "geruIndu"}, {name: "Indra Mondal"}, {new: true});
    res.send(user);
})

app.get('/read', async (req, res) => {
    const user = await userModel.find(); // read all data
    // const user = await userModel.find({username: "liza172"}); // Read only one component and gives always array
    // const user1 = await userModel.findOne({username: "liza172"});   // Read only one but gives result in objecy form
    res.send(user);
})

app.get('/delete', async (req, res) => {

    const user = await userModel.findOneAndDelete({username: "liza172"});
    res.send(user);

})

app.listen(3000);