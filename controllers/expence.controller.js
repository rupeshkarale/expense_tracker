const express = require("express");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const jwt = require("jsonwebtoken");
var moment = require('moment')
const expenceRouter = express.Router();

expenceRouter.post('/expense', verifyToken, (req, res) => {
    const { title, amount, date } = req.body;
    if (!dateIsValid(date)) {
        return res.send({
            success: false,
            message: "Date Format must be DD/MM/YYYY"
        }).status(401)
    }
    if (title.length < 3 || title.length > 10) {
        return res.send({
            success: false,
            message: "Title must be have characters between 3 to 10"
        })
    }
    if (amount <= 0 || amount > 1000) {
        return res.send({
            success: false,
            message: "Amount must be between 1 to 1000"
        })
    }
    jwt.verify(req.token, 'rupesh_secrete_key', async (err, authData) => {
        if (err) {
            return res.send({
                "success": false,
                "message": err.message,
            }).status(400)
        }
        if (authData) {
            const { username, password } = authData.user
            const exist = await User.exists({ username, password })
            // console.log(exist);
            if (exist === null) {
                return res.send({
                    success: false,
                    message: "invalid jwt token"
                }).status(400)

            }

            const user = await User.findOne({ username });
            const data = await User.findByIdAndUpdate(
                { _id: user._id },
                { $push: { expences: req.body } }
            )
            //  user.expences = [...user.expences, req.body]
            // user.expences(req.body)
            // const data = await user.expences.save();
            return res.send({
                "status": true,
                "message": `Expense with ${data._id} created successfully`
            }).status(201)
        }

    })
})


function dateIsValid(dateStr) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (dateStr.match(regex) === null) {
        return false;
    }

    const [day, month, year] = dateStr.split('/');

    // 👇️ format Date string as `yyyy-mm-dd`
    const isoFormattedStr = `${year}-${month}-${day}`;

    const date = new Date(isoFormattedStr);

    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        return false;
    }

    return date.toISOString().startsWith(isoFormattedStr);
}

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader != undefined) {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        req.token = token
        next();
    }
    else {
        return res.send({
            "success": false,
            "message": "Unauthorized"
        })
    }
}

expenceRouter.get('/expence/summery', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'rupesh_secrete_key', async (err, authData) => {
        if (err) {
            return res.send({
                "success": false,
                "message": err.message,
            }).status(400)
        }
        if (authData) {
            const { username, password } = authData.user
            const exist = await User.exists({ username, password })
            // console.log(exist);
            if (exist === null) {
                return res.send({
                    success: false,
                    message: "invalid jwt token"
                }).status(400)

            }

            const roleid = await User.findOne({ username }, { role_id: 1 })
            const role = await Role.find({ _id: roleid.role_id })

            if (role.name === 'user') {
                const data = await User.findOne({ username }, { expences: 1 })
                // console.log(data);
                const totalExpence = [0, 0, 0, 0, 0, 0, 0]
                data.expences.forEach((ele) => {
                    // console.log(typeof ele.date );
                    var dt = moment(ele.date, ["DD-MM-YYYY", "YYYY-MM-DD"])
                    const date = new Date(dt);
                    const day = date.getDay()
                    console.log(day)
                    totalExpence[day] += ele.amount;
                    // var dt = ele.date.getDay()
                    // console.log(dt)
                })
                res.send({
                    1: totalExpence[0],
                    2: totalExpence[1],
                    3: totalExpence[2],
                    4: totalExpence[3],
                    5: totalExpence[4],
                    6: totalExpence[5],
                    7: totalExpence[6],
                })
            }
            else {
                const data = await User.find()
                // console.log(data)
                const output = {}
                data.forEach((ele) => {
                    const totalExpence = [0, 0, 0, 0, 0, 0, 0]
                    ele.expences.forEach((ele) => {
                        var dt = moment(ele.date, ["DD-MM-YYYY", "YYYY-MM-DD"])
                        const date = new Date(dt);
                        const day = date.getDay()
                        // console.log(day)
                        totalExpence[day] += ele.amount;
                    })
                    var namenew = JSON.stringify(ele.username)

                    let obj =
                    {
                        1: totalExpence[0],
                        2: totalExpence[1],
                        3: totalExpence[2],
                        4: totalExpence[3],
                        5: totalExpence[4],
                        6: totalExpence[5],
                        7: totalExpence[6],
                    }
                    output[ele.username] = obj;
                    // output.push(namenew)
                })
                return res.send(
                    output
                ).status(200)

            }
        }

    })

})

module.exports = expenceRouter