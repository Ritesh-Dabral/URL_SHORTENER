
/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 

    const router   = require('express').Router(),
          userFunc = require('../Controller/UserController'); 



/*-------------------- R O U T E S ----------------------*/


    router.get("/h",(req,res)=>{
        console.log("yay");
        res.send("auth route");
    })



    // C R E A T E (POST)

    router.post("/add", userFunc.create_post);



    // R E A D (GET)

    router.get("/user/:uid",(req,res)=>{
        console.log("Get all links for: ",req.params.uid);
        const uid = req.params.uid;
        srtyIns.find({"createdBy":uid},function(err,db_res){
            if(err){
                res.status(500).send(err);
            }
            else{
                res.status(200).send(db_res);
            }
        });
    });
    



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

    router.delete('/user/del/:id',(req,res)=>{
        
        srtyIns.findByIdAndDelete(req.params.id,function(err,db_res){
            if(err){
                console.log(err);
                res.status(404).send(err)
            }
            else{
                console.log("deleted data with unique id: ",req.params.id);
                res.status(200).send("Deleted");
            }
        });
    });




/*-------------------- E X P O R T S ----------------------*/ 

    module.exports = router;