const express = require('express');
const router = express.Router();
const utility = require("../services/utility");
// var Imap = require('imap')
inspect = require('util').inspect
var fs = require('fs'), fileStream;

var imaps = require('imap-simple');
 
var config = {
    imap: {
        user: 'vanshkapoor3118@gmail.com',
        password: 'A1a2a3a4',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 10000
    }
};

// var imap = new Imap({
//     user: 'vanshkapoorvk7@gmail.com',
//     password: 'A1a2a3a4',
//     host: 'imap.gmail.com',
//     port: 993,
//     tls: false
//   });

// const Nylas = require('nylas');
// const keys = require("../config/keys")


// Nylas.config({
//     clientId:keys.client_id,
//     clientSecret:keys.client_secret
// })



router.get("/check", (req,res)=>{
    return res.status(200).json({message:'email service is running'});
})


router.post("/send", (req,res) => {
    // res.send("email sent");
    const mssg = {
        to: req.body.receiver_email,
        from: req.body.sender_email,
        subject: req.body.subject,
        text: req.body.text,
        html: req.body.html + req.body.hashKey 
    }

    utility.mail(mssg);
    return res.status(200).json({message:'message is sent'});
})

router.get("/imap",(req,res) => {
  
  imaps.connect(config).then(function (connection) {
    
    connection.openBox('INBOX').then(function () {
        var searchCriteria = [
            'UNSEEN'
        ];
 
        var fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };
 
        connection.search(searchCriteria, fetchOptions).then(function (results) {
            var subjects = results.map(function (res) {
                return res.parts.filter(function (part) {
                    return part.which === 'HEADER';
                })[0].body.subject[0];
            });
 

            console.log(subjects);
            return res.status(200).json({subjects:subjects});
            // =>
            //   [ 'Hey Chad, long time no see!',
            //     'Your amazon.com monthly statement',
            //     'Hacker Newsletter Issue #445' ]
        }).catch(error =>{
          return res.status(400).json({error:error,message:'error2'})
        });
    }).catch(error =>{
      return res.status(400).json({error:error,message:'error1'})
    });
}).catch(error =>{
  return res.status(400).json({error:error,message:'error0'})
});
})


// function openInbox(cb) {
//     imap.openBox('INBOX', true, cb);
// } 

// router.get("/list", (req,res) => {

//     function openInbox(cb) {
//         imap.openBox('INBOX', true, cb);
//           }
//         imap.once('ready', function() {
//         openInbox(function(err, box) {
//         if (err) throw err;
//         imap.search([ 'UNSEEN', ['SINCE', 'June 15, 2018'] ], function(err, results) {
//         if (err) throw err;
//         var f = imap.fetch(results, { bodies: '' });
//         f.on('message', function(msg, seqno) {
//         console.log('Message #%d', seqno);
//         var prefix = '(#' + seqno + ') ';
//         msg.on('body', function(stream, info) {
//         console.log(prefix + 'Body');
//         stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
//         });
//         msg.once('attributes', function(attrs) {
//         console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
//         });
//         msg.once('end', function() {
//         console.log(prefix + 'Finished');
//         });
//         });
//         f.once('error', function(err) {
//         console.log('Fetch error: ' + err);
//         });
//         f.once('end', function() {
//         console.log('Done fetching all messages!');
//         imap.end();});
//             });
//           });
//         });
//         imap.once('error', function(err) {
//         console.log("error" + err);
//         });
//         imap.once('end', function() {
//         console.log('Connection ended');
//         });
//         imap.connect();
// })



module.exports = router;