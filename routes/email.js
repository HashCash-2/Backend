const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const utility = require("../services/utility");

const Email = require("../models/Email");
const User = require("../models/User");



//@route api/email/check  
//access public
//desc check email
router.get("/check", (req,res)=>{
    return res.status(200).json({message:'email service is running'});
})



//@route api/email/send  POST
//access private
//desc send email
router.post("/send",passport.authenticate('jwt',{session:false}), (req,res) => {
    
    const mssg = {
        to: req.body.receiver_email,
        from: req.user.email,
        subject: req.body.subject,
        html: req.body.text + " " + req.body.amount + " " + req.body.expiryDate + " " + req.body.tokenname + " " + req.body.tokens,
        text: req.body.html + req.body.streamId + req.body.amount
    }

    const emssg = {
        user:req.user.id,
        to:req.body.receiver_email,
        from: req.user.email,
        subject: req.body.subject,
        text: req.body.text,
        html:req.body.html,
        streamId:req.body.streamId,
        expiryDate:req.body.expiryDate,
        amount:req.body.amount,
        tokens:req.body.tokens,
        tokenname:req.body.tokenname
    }

    
    new Email(emssg).save().then(email => {
        utility.mail(mssg);        
        res.status(200).json({message:'message is sent'});

    })
})



//@route api/email/read  GET
//access private
//desc read outbox mails
router.get("/read",passport.authenticate('jwt',{session:false}), (req,res) => {
    var myDate = new Date();

    Email.find({user:req.user.id,expiryDate:{$gt: myDate}}).then(emails => {
        // console.log(emails)
        if(emails.length == 0){
            return res.status(200).json({message:'success',emails:[]})
        }
        res.status(200).json({message:'success',emails:emails})
    }).catch(error => {
        res.status(400).json({message:'error',error:error})
    })
})



//@route api/email/read/:id  GET
//access private
//desc read email by id
router.get("/read/:id",passport.authenticate('jwt', {session:false}), (req,res) => {
    Email.findById(req.params.id).then(email => {
        if(email.user != req.user.id)
        {
            return res.status(400).json({message:'Not authorized for this email'})   
        }
        res.status(200).json({message:'success',email:email})
    }).catch(error =>{
        res.status(400).json({message:"error",error:error})
    })
})



//@route api/email/inbox  GET
//access private
//desc display inbox emails
router.get("/inbox",passport.authenticate('jwt',{session:false}), (req,res)=>{
    var myDate = new Date();
   
    Email.find({to:req.user.email,expiryDate:{$gt: myDate}}).then(emails => {
        if(emails.length == 0){
            return res.json({message:'success',emails:[]})
        }
        res.status(200).json({message:'success',emails:emails})
    }).catch(error => {
        res.status(400).json({message:"error",error:error})
    })
})



//@route api/email/inbox/:id  GET
//access private
//desc display particular inbox email by id
router.get("/inbox/:id", passport.authenticate('jwt',{session:false}), (req,res) => {
    Email.findById(req.params.id).then(email => {
        if(email.to != req.user.email)
        {
            return res.status(400).json({message:"Not authorized for this email"})
        }
        res.status(200).json({message:'success',email:email})
    }).catch(error =>{
        res.status(400).json({message:"error",error:error})
    })
})



router.post("/reply/:id", passport.authenticate('jwt',{session:false}), (req,res) => {
    Email.findById(req.params.id).then(email => {
        const replyObj={
            user:req.user.id,
            from:req.user.email,
            to:req.body.receiver_email,
            subject:req.body.subject,
            text: req.body.text,
            html:req.body.html,
            streamId:req.body.streamId,
            expiryDate:req.body.expiryDate,
            amount:req.body.amount,
            tokens:req.body.tokens,
            tokenname:req.body.tokenname
        }        
        // console.log(replyObj);
        email.reply.unshift(replyObj);
        email.save(email).then(emailObj => res.status(200).json({message:"success",email:emailObj}))

    }).catch(error => {
        res.status(400).json({message:"error",error:error})
    })
})


module.exports = router;