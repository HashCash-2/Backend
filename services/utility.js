const sgMail = require('@sendgrid/mail')
const sendgrid_api_key = require('../config/keys').SENDGRID_API_KEY
sgMail.setApiKey(sendgrid_api_key);



module.exports.mail = (message)=>{
    sgMail.send(message);
}