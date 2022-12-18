const mongoose = require('mongoose');

//userSchema

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role_id: { type: mongoose.Types.ObjectId, ref:'roles' },
    expences: [{
        title:{type:String,required:true},
        amount: { type: Number, required: true },
        date:{type:String, required:true}
    }]
})


module.exports = mongoose.model("users", userSchema);