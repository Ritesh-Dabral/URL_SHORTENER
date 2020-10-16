const router = require('express').Router();


// Login

router.get("/l",(req,res)=>{
    console.log('called me');
    res.send("login called");
});

router.get('/s',(req,res)=>{
    console.log('called me');
    res.send("signup called");
});


module.exports =router;