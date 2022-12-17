const express = require("express");
const User = require("../models/user.model");

const userRouter = express.Router();

userRouter.post('/', async (req, res,next) => {
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
                    message: `Password:${password} must be atleast one Uppercase and lowercase letter, one number and between 8 to 15 characters` ,
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

userRouter.post('/', async (req, res) => {
    const user = User(req.body);
    await user.save()
    res.send({
        sucess: true,
        
    }).statusCode(201);
})

module.exports = userRouter