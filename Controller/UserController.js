
/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 

    const URL  = require('../Schema/URL_Schema'),
          User = require('../Schema/User_Schema');

/*-------------------- F U N C T I O N S    A N D   C O N T R O L L E R S ----------------------*/ 


    // Error Handler

    function handleError(error){

        //console.log(error);

        const errorMessage = {
            name:"",
            oriURL:"",
            createdBy:""
        }


        // no such user exist
        if(error.message.includes('user_entry')){
            errorMessage.createdBy = error.message;
            return errorMessage;
        }

        if(error.code == 11000){
            errorMessage.oriURL = 'Url already exists in your collection';
            return errorMessage
        }

        // unable to add shortened url to DB
        if(error.message.includes('shortening')){
            errorMessage.oriURL = error.message;
            return errorMessage;
        }
    
        // mongoose validation failed
        if(error.message.includes('URL validation failed')){
            Object.values(error.errors).forEach(({properties})=>{
                errorMessage[properties.path] = properties.message;
                console.log(properties.path,properties.message);
            });

            return errorMessage;
        }

        return errorMessage;
    }




    // C R E A T E    U R L(POST)

    exports.create_post = async (req,res)=>{
        const {url,uid} = req.body;
        
        try{
            var original = {
                name: req.body.name,
                oriURL: req.body.url,
                newURL:'unknown',
                createdBy:req.body.uid
            }

            // check if such user exist
            const oldUser = await User.findById(uid); 

            if(!oldUser){
                throw Error('No such user_entry in the data base');
            }

            // control will come here only if the  above func. won't throw error or if it returns true
            const new_url_created = await URL.create(original);

            const tempURL = `http://localhost:8085/${new_url_created._id}`;

            URL.findByIdAndUpdate(new_url_created._id,{"newURL":tempURL},(err,db)=>{
                if(err)
                    throw Error('Error shortening URL');

                // add this db._id to User's array
                const list_of_URLs = oldUser.myURL;
                list_of_URLs.push(db._id); 

                // finally update user
                User.findByIdAndUpdate(oldUser._id, {"myURL":list_of_URLs}, (err,db_res)=>{
                    if(err)
                        throw Error('Error shortening URL');

                    res.status(201).json({db,db_res});
                });
            });
        }
        catch(error){
            const errorMessage = handleError(error)
            res.status(409).json({errorMessage});
        }
    }


