/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 

    const router = require('express').Router();
    const authFunctions = require('../Controller/AuthController');


/*-------------------- R O U T E S ----------------------*/ 

    // L O G I N (POST)

    router.post("/l", authFunctions.verifyAccount ,authFunctions.login_post);


    
    // S I G N   U P (POST)

    router.post('/s',authFunctions.signup_post);



    // L O G O U T (GET)

    router.get('/lo',authFunctions.logout_get);



    // E M A I L    V E R I F Y (GET)

    router.get('/emverif/:email/:id',authFunctions.emailVerify_get);



/*-------------------- E X P O R T S ----------------------*/ 

    module.exports =router;