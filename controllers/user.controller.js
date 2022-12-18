const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

// validate signup credential
userRouter.post('/signup', async (req, res, next) => {
    try {
        const { username, password } = req.body

        if (username.length < 3 || username.length > 10) {
            res.send({
                sucess: false,
                message: 'username must be more than 3 and less than 10 character'
            }).statusCode(400);
        }
        if (password) {
            var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
            if (!password.match(passw)) {

                res.send({
                    sucess: false,
                    message: `Password:${password} must be atleast one Uppercase and lowercase letter, one number and between 8 to 15 characters`,
                }).statusCode(400);
            }

        }

        const userExist = await User.exists({ username: username })
        if (userExist) {
            res.send({
                sucess: false,
                message: `Username ${username} already present`,
            }).statusCode(400);
        }

        next()

    } catch (error) {

    }
})

//signup data insert
userRouter.post('/signup', async (req, res) => {
    const user = User(req.body);
    await user.save()
    res.send({
        sucess: true
    }).status(201);
})

let time = 1000000 * 10000000
const createToken = (id) => {
    return jwt.sign({ id }, "rupesh_secrete_key", {
        expiresIn: time,
    });
};

userRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }, { username: 1, password: 1 })

    //login credential validation
    if (user === null ||  username.length ===0) {
        return res.send({
            sucess: false,
            message: "Username is not valid"
        }).status(400);
    }
    
    if (password.length === 0) {
        return res.send({
            sucess: false,
            message: "Password is not valid"
        }).status(400);
    }
    
    

    if (user.username === username && user.password === password) {

        jwt.sign({ user }, 'rupesh_secrete_key', { expiresIn: '99years' }, (err, token) => {
            return res.json({
                sucess: true,
                token
            }).status(201)
        })


    } else {
        return res.send({
            sucess: false,
            message: "Password is not valid"
        }).status(400);
    }

})

module.exports = userRouter