const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authenticate = require("../middleware/authenticate");

const cookieParser = require("cookie-parser");
router.use(cookieParser());




require('../db/conn');
const User = require("../model/userSchema");




//register route

router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword)
    {
        return res.status(422).json({ error: "Please fill all the fields properly" });
    } 

    try {
        //if email is already register before
        const userExist = await User.findOne({ email: email })
        if(userExist) {
            return res.status(422).json({ error: "Email already exists. Kindly Login." });
        }else if(password != cpassword) {
            return res.status(422).json({ error: "Passwords do not match. Please try again." });
        }

        const user = new User({name, email, phone, work, password, cpassword });

        //hashing

        await user.save();

        res.status(201).json({ message:"User Successfully Registered!" })

    } catch(err) {
        console.log(err);
    }

});



//login route 
router.post('/login', async (req, res) => {
    try {
        let token;
        const {email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({error: "Invalid Credentials"})
        }

        const userLogin = await User.findOne({ email:email });

        // console.log(userLogin);

        if(userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

        if(!isMatch){
            res.status(400).json({ error: "Invalid Credentials - Error 16"});
        } else {
            res.json({message: "User Signed in Successfully!"});
        }
        } else {
            res.status(400).json({ error: "Invalid Credentials - Error 5"});
        }

    } catch (err){
        console.log(err); 
    }
});

// profile page
router.get('/profile', authenticate, (req, res) => {
    res.send(req.rootUser);
});


router.get('/logout', (req, res) => {
    console.log(`Hello Logout Page`);
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).send('User Logged Out');
});


module.exports = router;