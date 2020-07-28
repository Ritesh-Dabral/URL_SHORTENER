require("dotenv").config();
// V A R I A B L E S
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    srtyIns     = require('./files/mongoose'),
    cors        = require('cors');

    // ... other imports 
const path = require("path")
    
const PORT = process.env.PORT || 8085;

// A P P    S E T T I N G
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
    // ... other app.use middleware 
app.use(express.static(path.join(__dirname, "client", "build")))



//R O U T E

    //Show all data depending upon uid
app.post("/",(req,res)=>{
    const uid = req.body.uid;
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
app.get("/:id",(req,res)=>{
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
                res.redirect(ori_url);
            }
        });
    }
});

    //Create new document with uid
app.post("/uS",(req,res)=>{
    var original = {
        name: req.body.name,
        oriURL: req.body.url,
        newURL:'',
        createdBy:req.body.uid
    }
    srtyIns.create(original,function(err,db_res){
        if(err){
            console.log(err);
            res.status(500).send(err)
        }
        else{
            const temp = 'http://localhost:8085/'+db_res._id;
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
app.delete('/del/:id',(req,res)=>{
    
    srtyIns.findByIdAndDelete(req.params.id,function(err,db_res){
        if(err){
            console.log(err);
            res.status(404).send(err)
        }
        else{
            res.status(200).send("Deleted");
        }
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


if(process.env.NODE_ENV === 'production'){
    app.use(express.static("client/build"));
}

// S E R V E R
app.listen(PORT,()=>{
    console.log("S E R V E R ");
})