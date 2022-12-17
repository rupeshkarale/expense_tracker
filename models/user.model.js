const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    expences: [{
        title:{type:String,required:true},
        amount: { type: Number, required: true },
        date:{type:Date, required:true}
    }]
})

module.exports = mongoose.model("users", userSchema);