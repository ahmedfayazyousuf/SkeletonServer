const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const authenticate = require("./middleware/authenticate");

dotenv.config({path: './config.env' });

require('./db/conn');
const User = require('./model/userSchema');

app.use(express.json()); 

//linking router files to make routing easy
app.use(require('./router/auth'));

const PORT = process.env.PORT || 5000;






app.get('/formbuilder', (req, res) => {
    //res.send(`Hello world from the FORMBUILDER server`);
});

app.get('/login', (req, res) => {
    res.send(`Hello world from the LOGIN server`);
});

app.get('/signup', (req, res) => {
    //res.send(`Hello world from the SIGNUP server`);
});
 

app.listen(PORT, () => {    
    console.log(`The Server is running on port ${PORT}`);
})
