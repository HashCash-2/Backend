const mongoose = require('mongoose')
const Schema = mongoose.Schema


const EmailSchema = new Schema({
user:{
    type: Schema.Types.ObjectId,
    ref: 'users'
},
from:{
    type:String,
    required:true
},
to:{
    type: String,
    required: true,
},
subject:{
    type: String
},
text:{
    type: String
},
html:{
    type: String
},
hashKey:{
    type: String,
    required: true,
},
date:{
    type:Date,
    default:Date.now
}
});

module.exports = Email = mongoose.model('email',EmailSchema);