const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileTokenSchema = new Schema({
    email:{
        type:String,
    },
    tokens:[
        {
            name:String,
            address:String
        },
    ]
})

module.exports = Ptoken = mongoose.model('ptoken',ProfileTokenSchema)