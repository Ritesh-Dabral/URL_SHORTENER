const router = require('express').Router();
const authFunctions = require('../Controller/AuthController');


// Login

router.post("/l", authFunctions.login_post);

router.post('/s',authFunctions.signup_post);


module.exports =router;