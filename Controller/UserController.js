
    require('dotenv').config();

/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 

    const URL  = require('../Schema/URL_Schema'),
          User = require('../Schema/User_Schema'),
          jwt  = require('jsonwebtoken');

/*-------------------- F U N C T I O N S    A N D   C O N T R O L L E R S ----------------------*/ 


    // Token Parsing (JWT) and user existence checking

    exports.verifyUser = async (req,res,next)=>{
        
        const jwt_token_string = req.cookies.srty_jwt;

        // verify the token

        try {
            const tokenVerified = await jwt.verify(jwt_token_string, process.env.JWT_SECRET);

            if(!tokenVerified){
                throw Error('Either login or signup to access the resources');
            }

            const uid = tokenVerified.id;
                
            // check if the user exists, if he/she, then next, else, status 404

            const oldUser = await User.findById(uid);

            if(!oldUser){
                // 401: unauthorised client
                throw Error('Unauthorized client access');
            }

            // if user exists, then forward it to other middlewares
            next();
        } catch (error) {
            res.status(401).json({message:error.message})
        }
    }





    // E R R O R     H A N D L I N G

    function handleError(error){

        console.log(error.message);

        const errorMessage = {
            name:"",
            oriURL:"",
            createdBy:""
        }


        // no such user exist
        if(error.message.includes('NOSCHUSR') || error.message.includes('Cast to ObjectId failed')){
            errorMessage.createdBy = 'No such user exists';
            return errorMessage;
        }

        // handle duplicate URL for same user
        if(error.message.includes('NOSCHURL')){
            errorMessage.oriURL = 'Url does not exist in your collection';
            return errorMessage
        }

        // handle duplicate URL for same user
        if(error.message.includes('DPLICTE_URL')){
            errorMessage.oriURL = 'Url already exists in your collection';
            return errorMessage
        }

        // unable to add shortened url to DB
        if(error.message.includes('ERR_SHRT_URL')){
            errorMessage.oriURL = 'Error shortening URL';
            return errorMessage;
        }
        
        // unable to delete url
        if(error.message.includes('DELERR')){
            errorMessage.oriURL = 'Error deleting the URL';
            return errorMessage;
        }

        // unable to update user DB after deletion
        if(error.message.includes('DELERR_UPDT')){
            errorMessage.oriURL = 'Error Updating User DB after deletion';
            return errorMessage;
        }
    
        // mongoose validation failed
        if(error.message.includes('URL validation failed')){
            Object.values(error.errors).forEach(({properties})=>{
                errorMessage[properties.path] = properties.message;
                //console.log(properties.path,properties.message);
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
                throw Error('NOSCHUSR');
            }

            const check_if_url_not_exists = await URL.check_url(url,uid);

            if(!check_if_url_not_exists){
                throw Error('DPLICTE_URL');
            }

            // control will come here only if the  above func. won't throw error or if it returns true
            const new_url_created = await URL.create(original);

            const tempURL = `http://localhost:8085/ul/g/${new_url_created._id}`;

            URL.findByIdAndUpdate(new_url_created._id,{"newURL":tempURL},(err,db)=>{
                if(err)
                    throw Error('ERR_SHRT_URL');

                // add this db._id to User's array
                const list_of_URLs = oldUser.myURL;
                list_of_URLs.push(db._id); 

                // finally update user
                User.findByIdAndUpdate(oldUser._id, {"myURL":list_of_URLs}, (err,db_res)=>{
                    if(err)
                        throw Error('ERR_SHRT_URL');

                    //console.log('User',db_res);
                    //console.log('URL',db);
                    res.status(201).json({"msg":"URL shortened successfully"});
                });
            });
        }
        catch(error){
            const errorMessage = handleError(error)
            res.status(409).json({errorMessage});
        }
    }




     // R E A D    U R L(GET)
    
     exports.read_get = async (req,res)=>{
        const jwt_token_string = req.cookies.srty_jwt;

        try {
            const tokenVerified = await jwt.verify(jwt_token_string, process.env.JWT_SECRET);

            if(!tokenVerified){
                throw Error('Either login or signup to access the resources');
            }

            const uid = tokenVerified.id;

            const user = await User.findById(uid);

            if(!user){
                throw Error('NOSCHUSR');
            }

            const url_obj = [];

            // for each loop doesn't work well with await, use for of loop
            for(const url_id of user.myURL){

                let info = {
                    name:'',
                    new_url:''
                };

                // now for each url_id , fetch info
                let temp_url = await URL.findById(url_id);
                
                if(!temp_url){
                    throw Error('NOSCHURL');
                }

                info.name = temp_url.name;
                info.new_url = temp_url.newURL;

                url_obj.push(info) // push data in the url_obj;
            }

            // after getting all the data

            res.status(200).json({url_obj});

        } catch (error) {
            const errorMessage = handleError(error)
            res.status(409).json({errorMessage});           
        }
        
     };




    // D E L E T E    U R L(DELETE)

    exports.deleteURL_delete = async(req,res)=>{
        const jwt_token_string = req.cookies.srty_jwt;
        const url_id_to_delete = req.params.id;

        try {
            const tokenVerified = await jwt.verify(jwt_token_string, process.env.JWT_SECRET);

            if(!tokenVerified){
                throw Error('Either login or signup to access the resources');
            }

            const uid = tokenVerified.id;

            const user = await User.findById(uid);

            if(!user){
                throw Error('NOSCHUSR');
            }

            // check if url_id_to_delete exists within the user's collection
            let url_exists = false;
            for(const i in user.myURL){

                let tempURL = user.myURL[i];

                if(tempURL.toString()===url_id_to_delete.toString()){
                    // delete it, break
                    url_exists = true;
                    break;
                }
            }

            if(!url_exists){
                throw Error('NOSCHURL');
            }

            // now delete it
            const deleted_URL = await URL.findByIdAndDelete(url_id_to_delete);

            if(!deleted_URL){
                throw Error('DELERR')
            }


            // push all URL_ID besides, deleted one
            const tempURL_list=[]; 

            for(let i in user.myURL){

                let tempURL = user.myURL[i];

                if(tempURL.toString()!==url_id_to_delete.toString()){
                    tempURL_list.push(tempURL); 
                }
            }

            // finally update USER's myURL array
            const updatedAfterDeletion = await User.findByIdAndUpdate(uid,{"myURL":tempURL_list});

            if(!updatedAfterDeletion){
                throw Error('DELERR_UPDT');
            }

            //console.log(`User ${user._id} deleted URL with id ${deleted_URL}`);
            // send good status
            res.status(200).json({"msg":"URL deleted successfully"});

        } catch (error) {
            const errorMessage = handleError(error)
            res.status(409).json({errorMessage});           
        }

    }




    // R E D I R E C T    O R I G I N A L   U R L(GET)

    exports.redirectURL_get = async(req,res)=>{
        const redirectURL_id = req.params.id;

        try {
            const url = await URL.findById(redirectURL_id);

            if(!url){
                throw Error('NOSCHURL');
            }

            res.redirect(url.oriURL.toString());

        } catch (error) {
            const errorMessage = handleError(error)
            res.status(409).json({errorMessage});       
        }
    };
