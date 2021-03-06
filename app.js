require("dotenv").config();

/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 

    const express    = require('express'),
        app          = express(),
        bodyParser   = require('body-parser'),
        cors         = require('cors'),
        mongoose     = require('mongoose'),
        cookieParser = require('cookie-parser');

        // ... other imports 
    const path = require("path")
    const PORT = process.env.PORT || 8085;

    const userRoutes = require('./routes/UserRoutes');    
    const authRoutes = require('./routes/AuthRoutes');


/*-------------------- M I D D L E W A R E S ----------------------*/ 

    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cors({
        origin: 'https://urlsrty.herokuapp.com/',
        methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
        credentials: true
      }));
        
      // ... other app.use middleware 
    app.use(express.static(path.join(__dirname, "client", "build")));



/*-------------------- R O U T E S ----------------------*/ 
    app.use('/g',authRoutes);
    app.use('/ul',userRoutes);

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });



/*-------------------- S E R V E R   A N D    D B ----------------------*/ 
    if(process.env.NODE_ENV === 'production'){
        app.use(express.static("client/build"));
    }

    // connect to db, if successful, then connect to server, otherwise don't

    try {
        const nonDeprecation = {
            useCreateIndex: true,
            useUnifiedTopology: true, 
            useNewUrlParser: true,
            useFindAndModify: false
        }
        mongoose.connect(process.env.URI, nonDeprecation , function(err,db_res){
            if(err)
                throw err;
            
            console.log("DB connection successful");
                // no error? connect to the server
            app.listen(PORT,()=>{
                console.log("S E R V E R at port:",PORT);
            })
        });
    } catch (error) {
        console.log("Error generated: ", error.message);
    }