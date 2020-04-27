const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const utility = require("../services/utility");

const Email = require("../models/Email");
const User = require("../models/User");
const Token = require("../models/Token");
const Ptoken = require("../models/ProfileTokens")



//@route api/token/check  GET
//access public
//desc check token
router.get("/check", (req,res)=>{
    return res.status(200).json({message:'token service is running'});
})



//@route api/token/add  POST
//access private
//desc add token(token)
router.post("/add",passport.authenticate('jwt',{session:false}),(req,res) => {
    Token.findOne({email:req.user.email}).then(data =>{
        if(data == null){
            const obj ={
                email:req.user.email,
                user:req.user.id,
                tokenName:req.body.tokenName,
                tokenAddress:req.body.tokenAddress    
            }
            new Token(obj).save().then(token => {
                res.status(200).json({message:"token created",data:token});
            }).catch(err => res.status(400).json({message:"error"}))
        }else{
            return res.status(200).json({message:"token already present",data:data})
        }
    }).catch(err => res.json({message:"erro2"}))
})



//@route api/token/get  GET
//access private
//desc get token(token)
router.get("/get",passport.authenticate('jwt',{session:false}),(req,res)=>{
    Token.findOne({email:req.user.email}).then(data => {
        if(data == null)
        {
            return res.status(200).json({message:"no token for this user"});
        }else{
            return res.status(200).json({message:"success",data:data})
        }
    }).catch(err => res.status(400).json({message:"error"}))
})



//@route api/token/user/:id (id=emailid) GET
//access private
//desc get tokens of a user by emailid(Profile token)
router.get("/user/:id",passport.authenticate('jwt',{session:false}), (req,res) => {
    Ptoken.findOne({email:req.params.id}).then(data => {
        if(data == null)
        {
            return res.status(200).json({message:"no tokens accepted by this user"});
        }else{
            return res.status(200).json({message:"success",data:data});
        }
    }).catch(err => res.status(400).json({message:"error"}))
})



//@route api/token/user  GET
//access private
//desc get tokens for logged in user(Profile token)
router.get("/user",passport.authenticate('jwt',{session:false}), (req,res) => {
    Ptoken.findOne({email:req.user.email}).then(data => {
        if(data == null)
        {
            return res.status(200).json({message:"Not accepting any tokens currently"});
        }else{
            return res.status(200).json({message:"success",data:data});
        }
    }).catch(err => res.status(400).json({message:"error"}))
})



//@route api/token/user POST  
//access private
//desc add tokens(Profile token)  
//NOT USED
router.post("/user",passport.authenticate('jwt',{session:false}),(req,res) => {
    Ptoken.findOne({email:req.user.email}).then(data => {
        if(data == null)
        {
            const obj={
                email:req.user.email,
                // tokens:req.body.tokens
            }
            req.body.email = req.user.email
            new Ptoken().save(obj).then(data => {
                 res.status(200).json({message:"Created",data:data})
            })
        }else{
            return res.status(200).json({message:"success",data:data})

        }
    })
})



//@route api/token/add/user POST
//access private
//desc add tokens(Profile token)
router.post("/add/user",passport.authenticate('jwt',{session:false}),(req,res) => {
    Ptoken.findOne({email:req.user.email}).then(data =>{
        if(data == null){
            const obj ={
                email:req.user.email,
                tokens:req.body.tokens    
            }
            console.log(obj)
            new Ptoken(obj).save().then(token => {
                res.status(200).json({message:"token created",data:token});
            }).catch(err => res.status(400).json({message:"error"}))
        }else{
            const obj ={
                email:req.user.email,
                tokens:req.body.tokens    
            }
            let update = {
                $set: obj
            }
            Ptoken.updateOne({email:req.user.email},update).then(data =>{
                res.status(200).json({message:"tokens updated"})
            }).catch(err =>{
                res.status(400).json({message:"error"})
            })
            // return res.status(200).json({message:"token already present",data:data})
        }
    }).catch(err => res.status(400).json({message:"erro2"}))
})


module.exports = router