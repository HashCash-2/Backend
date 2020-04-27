const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
const nodemailer = require('nodemailer');
var Transport = require('nodemailer-sendgrid-transport');



//@route /user/
//desc check
router.get('/',(req,res)=>{
    res.send("user");
})



//@route /user/register  POST
//access public
//desc register user
router.post('/register', (req,res)=>{
    User.findOne({ email: req.body.email })
    .then(user =>{
        if(user){
            res.status(409).json({message:'error',error:"email already exists"});
        }else{

                const newuser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password    
                });
                bcrypt.genSalt(10,(err,salt) => {
                    bcrypt.hash(newuser.password, salt, (err,hash) => {
                        if(err) throw err;
                        newuser.password = hash;

                        newuser.save().
                        then(user => { 
                          

                            res.status(201).json({success:true,user:user});
                         })
                        .catch(err =>{
                            res.send(400).json({message:"error"})
                        })
                    
                    })
                })
        }
    }).catch(error => {
         res.status(400).json({message:'error',error:error})
    })
});



//@route /user/login POST
//access public
//desc login user
router.post('/login',(req,res) =>{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email : email })
    .then(user =>{
        if(!user){
            return res.status(404).json({email:"user not found"});
        }

        bcrypt.compare(password,user.password)
        .then(isMatch =>{
            if(isMatch){

                const payload = { id:user.id, name:user.name };
                jwt.sign(payload,'secret',{ expiresIn:"7 days" },(err,token) =>{
                    res.status(200).json({
                        success:true,
                        token:'Bearer ' + token
                    });
                });
            }else{
                res.status(400).json({password:'password incorrect'});
            }
        })
    })
})



//@route /user/current
//access private
//desc get current user
router.get('/current',passport.authenticate('jwt',{ session:false }),(req,res) => {
        res.json({usr : req.user});
});



//@route /user/all
//access public
//desc lists all users
// router.get('/all',(req,res)=>{
//     User.find()
//     .then(users => {
//         if(!users){
//             res.status(404).json({error:'no user'});
//         }
//         res.json(users);
//     })
//     .catch(err => res.status(400).json({error:'no users found'}));
// })


module.exports = router;