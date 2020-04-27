var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var database   = require("./config/keys").mongoURI;
var cors       = require('cors')
const passport = require('passport');


var app        = express();
app.use(cors())


//api routes
const user     = require('./routes/user');
const email    = require('./routes/email');
const token    = require('./routes/tokens');


// middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// Database connectivity
mongoose.connect(database,{ useNewUrlParser: true },(err)=>
    {
    if(err){
        console.log(err)
    }else{
        console.log("connected to db");
    }
    });

app.use(passport.initialize());
require('./config/passport')(passport);




// routes
app.get('/',(req,res)=>{
res.send("check !!");
});
app.use("/api/email", email);
app.use("/user", user);
app.use("/api/token",token)



// server starting
const port = process.env.PORT||5000;
app.listen(port , (err) =>{
    if(err){
        console.log(err);
    }else{
        console.log(`server is running on PORT ${port} `);
    }
})