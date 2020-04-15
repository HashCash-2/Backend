const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const utility = require("../services/utility");

const Email = require("../models/Email");
const User = require("../models/User");

router.get("/check", (req,res)=>{
    return res.status(200).json({message:'email service is running'});
})


router.post("/send",passport.authenticate('jwt',{session:false}), (req,res) => {
    // res.send("email sent");
    const mssg = {
        to: req.body.receiver_email,
        from: req.user.email,
        subject: req.body.subject,
        html: req.body.text + " " + req.body.amount + " " + req.body.expiryDate + " " + req.body.tokenName + " " + req.body.tokens,
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
        tokenName:req.body.tokenName
    }

    // console.log(mssg);
    new Email(emssg).save().then(email => {
        utility.mail(mssg);
        // return res.status(200).json({message:'message is sent'});
        res.json({message:'message is sent'});

    })
})


//see emails that user sent
router.get("/read",passport.authenticate('jwt',{session:false}), (req,res) => {
    Email.find({user:req.user.id}).then(emails => {
        res.json({message:'success',emails:emails})
    }).catch(error => {
        res.status(400).json({message:'error',error:error})
    })
})

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


//see inbox emails(emails received)
router.get("/inbox",passport.authenticate('jwt',{session:false}), (req,res)=>{
    var myDate = new Date();

    let check={
        to:req.user.email,
        expiryDate: { $lt: myDate}
    }

    // 2020-04-15T20:45:17.695Z
    Email.find(check).then(emails => {
        // var myDate = new Date().getTime()/1000;
        res.status(200).json({message:'success',emails:emails,date:myDate})
    }).catch(error => {
        res.status(400).json({message:"error",error:error})
    })
})

router.get("/inbox/:id",passport.authenticate('jwt',{session:false}), (req,res) => {
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
// 5e93bce1e18fec22870e71c5
// 5e93bebca3821324e8c0c570
module.exports = router;