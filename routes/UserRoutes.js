
/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 

    const router   = require('express').Router(),
          userFunc = require('../Controller/UserController'); 



/*-------------------- R O U T E S ----------------------*/


    // C R E A T E (POST)

    router.post("/add", userFunc.verifyUser ,userFunc.create_post);



    // R E A D (GET)

    router.get("/read", userFunc.verifyUser, userFunc.read_get);
    


    // D E L E T E (DELETE)

    router.delete('/del/:id',userFunc.verifyUser, userFunc.deleteURL_delete);

    

    // R E D I R E C T (GET)

    router.get("/g/:id", userFunc.redirectURL_get);


/*-------------------- E X P O R T S ----------------------*/ 

    module.exports = router;