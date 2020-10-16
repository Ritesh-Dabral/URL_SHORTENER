const router  = require('express').Router();


//R O U T E

    router.get("/h",(req,res)=>{
        console.log("yay");
        res.send("auth route");
    })
    //Show all data depending upon uid
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
    
        // Redirect
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
    
        //Create new document with uid
    router.post("/user/add",(req,res)=>{
        console.log("New url req from: ",req.body.uid);
        var original = {
            name: req.body.name,
            oriURL: req.body.url,
            newURL:'',
            createdBy:req.body.uid
        }
        srtyIns.create(original,function(err,db_res){
            if(err){
                console.log(err,"\nfor uid: ",req.body.uid);
                res.status(500).send(err)
            }
            else{
                const temp = `https://srtyrouter.herokurouter.com/`+db_res._id;
                srtyIns.findByIdAndUpdate(db_res._id,{"newURL":temp},function(err,db_res){
                    if(err){
                        console.log(err);
                        res.status(500).send(err)
                    }
                    else{
                        console.log(db_res);
                        res.status(200).send(db_res._id);
                    }
                })
    
            }
                
        })
    });
    
        //destroy
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




module.exports = router;