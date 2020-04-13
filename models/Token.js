const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    email:{
        type:String,
    },
    tokenName:{
        type:String,
        // required:true
    },
    tokenAddress:{
        type:String,
    }

})
module.exports = Token = mongoose.model('token',TokenSchema)