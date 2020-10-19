
/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 

    const router   = require('express').Router(),
          userFunc = require('../Controller/UserController'); 



/*-------------------- R O U T E S ----------------------*/


    // C R E A T E (POST)

    router.post("/add", userFunc.verifyUser ,userFunc.create_post);



    // R E A D (GET)

    router.get("/read", userFunc.verifyUser, userFunc.read_get);
    



    // R E D I R E C T (GET)

    router.get("/:id",(req,res)=>{
        const id = req.params.id;
        if(id === 'favicon.ico') {
            res.writeHead(404);
            res.end();
        } else {
            console.log(id);
            srtyIns.findById(id,function(err,db_res){
                if(err)
                {
                    res.status(500).send(err);
                }
                else{
                    const ori_url = db_res.oriURL;
                    console.log("Redirect req from: ",db_res.createdBy," -->for: ",req.params.id);
                    res.redirect(ori_url);
                }
            });
        }
    });
    
    


    // D E L E T E (DELETE)

    router.delete('/del/:id',userFunc.verifyUser, userFunc.deleteURL_delete);




/*-------------------- E X P O R T S ----------------------*/ 

    module.exports = router;