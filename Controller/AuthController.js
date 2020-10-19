require('dotenv').config();

/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 

    const User   = require('../Schema/User_Schema'),
          bcrypt = require('bcrypt'),
          jwt    = require('jsonwebtoken'),
          maxAge = 1*60*60*24;                  // 1 day (sec)


/*-------------------- F U N C T I O N S    A N D   C O N T R O L L E R S ----------------------*/ 


    // Create JWT token

    function createToken(id){
        return jwt.sign({id},process.env.JWT_SECRET, {
            expiresIn: maxAge
        });
    }





    // E R R O R     H A N D L I N G

    function handleError(error){
        //console.log(error.message);
        const errorMessage = {
            email:"",
            password:""
        }

        if(error.code == 11000){
            errorMessage.email = 'User already exists';
            return errorMessage
        }

        if(error.message.includes('Users validation failed')){
            Object.values(error.errors).forEach(({properties})=>{
                errorMessage[properties.path] = properties.message;
            });
        }

        return errorMessage;
    }




    // L O G I N (POST)

    module.exports.login_post = async (req,res)=>{
        const {email, password} = req.body;

        try {
            const user = await User.login(email,password);

            // give a JWT token
            const token = createToken(user._id);
            res.cookie('srty_jwt', token, {httpOnly: true, maxAge: maxAge*1000});
            res.status(200).json({uid:user._id});
        } catch (error) {
            res.status(404).json({errMsg: error.message});
        }
    }




    // S I G N   U P (POST)

    module.exports.signup_post = async (req,res)=>{
        const {email, password} = req.body;
        
        try {
            const newUser = {
                email,
                password,
                isValidated:false,
                myURL:[]
            }
            const user = await User.create(newUser);

            // if no error, send a verification

            res.status(201).json({msg:'Successfully Signed Up',email});
        } catch (error) {
            const parsedError = handleError(error);
            console.log(parsedError);
            res.status(409).json({parsedError});
        }
    }


    // L O G O U T (GET)

    module.exports.logout_get = (req,res)=>{
        res.cookie('srty_jwt','',{httpOnly: true, maxAge: 1}); // 1 sec max age, and then destroy it
        res.status(200).json({"message":"logout successful"});
    }