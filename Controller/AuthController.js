require('dotenv').config();

/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 

    const User        = require('../Schema/User_Schema'),
          VerifyEmail = require('../Schema/Email_Verif_Schema'),
          bcrypt      = require('bcrypt'),
          jwt         = require('jsonwebtoken'),
          sgMail      = require('@sendgrid/mail'),   // for sending verification emails
          {v4: uuid}  = require('uuid');             // uuid for unique emailverification number
          maxAge      = 1*60*60*24;                  // 1 day (sec)


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

        
        // invalid password
        if(error.message.includes('INVLDPSWRD')){
            errorMessage.password = 'Password must not contain whitespace(s)';
            return errorMessage;
        }
        

        // incorrect password
        if(error.message.includes('INCRCTPSWRD')){
            errorMessage.password = 'Incorrect Password';
            return errorMessage;
        }

        // incorrect email
        if(error.message.includes('INCRCTEML')){
            errorMessage.password = 'Incorrect Email';
            return errorMessage;
        }

        // no such user exist
        if(error.message.includes('NOSCHUSR') || error.message.includes('Cast to ObjectId failed')){
            errorMessage.email = 'No such user exists';
            return errorMessage;
        }

        // duplicate user
        if(error.code == 11000){
            errorMessage.email = 'User already exists';
            return errorMessage
        }

        // user creation failed
        if(error.message.includes('USRCR8ERR')){
            errorMessage.email = 'User creation failed, try again later';
            return errorMessage
        }
        
        // Email Verification reference creation failed
        if(error.message.includes('EMLVRFYCR8ERR')){
            errorMessage.email = 'Email Verification reference creation failed';
            return errorMessage
        }


        // no such user exist
        if(error.message.includes('EMVRIFFAIL')){
            errorMessage.email = 'Email Verification failed';
            return errorMessage;
        }

        
        // email not verified yet
        if(error.message.includes('NOTVERIFIED')){
            errorMessage.email = 'Please verify your email';
            return errorMessage;
        }

        // mongoose User schema error
        if(error.message.includes('Users validation failed')){
            Object.values(error.errors).forEach(({properties})=>{
                errorMessage[properties.path] = properties.message;
            });
        }

        return errorMessage;
    }



    // V E R I F Y    A C C O U N T

    exports.verifyAccount = async (req,res,next)=>{

        const {email} = req.body;

        try {
            // check if account verified
            const user = await User.findOne({email});

            if(!user){
                throw Error('NOSCHUSR');
            }

            if(!user.isValidated){
                throw Error('NOTVERIFIED');
            }

            // if a verified user, go ahead
            next();

        } catch (error) {
            const parsedError = handleError(error);
            //console.log(parsedError);
            res.status(409).json(parsedError);           
        }        
    }




    // L O G I N (POST)

    module.exports.login_post = async (req,res)=>{
        const {email, password} = req.body;
        try {

            if(password.includes(' ')){
                throw Error('INVLDPSWRD');
            }
            
            const user = await User.login(email,password);

            // give a JWT token
            const token = createToken(user._id);
            res.cookie('srty_jwt', token, {httpOnly: true, maxAge: maxAge*1000});

            // another cookie to be accessed by react framework to persist the session
            res.cookie('srty_user', true, {maxAge: maxAge*1000});
            res.status(200).json({uid:user._id});
        } catch (error) {
            //res.status(404).json({errMsg: error.message});
            const parsedError = handleError(error);
            //console.log(parsedError);
            res.status(404).json(parsedError);  
        }
    }




    // S I G N   U P (POST)

    module.exports.signup_post = async (req,res)=>{
        const {email, password} = req.body;

        try {

            if(password.includes(' ')){
                throw Error('INVLDPSWRD');
            }

            const newUser = {
                email,
                password,
                isValidated:false,
                myURL:[]
            }
            const user = await User.create(newUser);

            if(!user){
                throw Error('USRCR8ERR');
            }
            // if no error, send a verification as the user has been created successfully

            sgMail.setApiKey(process.env.SEND_GRID_API); // API  received from send grid
            const verificationSerialKey = uuid();

            // create entry in EmailVerif Collection
            const email_obj = {
                uuid: verificationSerialKey,
                email: email
            }
            const newEmailVerif = await VerifyEmail.create(email_obj);

            if(!newEmailVerif){
                throw Error('EMLVRFYCR8ERR');
            }

            // if we reach here, means everything is good

            let verification_URL = `https://urlsrty.herokuapp.com/g/emverif/${email}/${verificationSerialKey}`;

            const msg = {
                to: email.toString(), // Change to your recipient
                from: 'urlsrty@gmail.com', // Change to your verified sender
                subject: 'Email Verification from SrtyApp',
                text: `Click the link to verify your email: ${verification_URL}`,
                html: `<p>Click the button to verify your email</p><br><button><a href="${verification_URL}">Verify</a></button>`,
              }

              // send the mail
              sgMail.send(msg)
                .catch((error)=>{
                    verification_URL = 'Unable to send email confirmation:  '+error.message;
                })

            res.status(201).json({msg:'Successfully Signed Up',email, confirmationEmail:verification_URL});
        } catch (error) {
            const parsedError = handleError(error);
            //console.log(parsedError);
            res.status(409).json(parsedError);
        }
    }


    

    // L O G O U T (GET)

    module.exports.logout_get = (req,res)=>{
        res.cookie('srty_jwt','',{httpOnly: true, maxAge: 1}); // 1 sec max age, and then destroy it
        res.cookie('srty_user','',{maxAge: 1});               // 1 sec max age, and then destroy it
        res.status(200).json({"message":"logout successful"});
    }




    // E M A I L    V E R I F Y (GET)

    module.exports.emailVerify_get = async (req,res)=>{
        const {email,id} = req.params;

        try {
            const emailVerif = await VerifyEmail.findOne({email});

            if(!emailVerif){
                throw Error('NOSCHUSR');
            }

            if(id.toString()!==emailVerif.uuid.toString()){
                throw Error('EMVRIFFAIL');
            }

            // if we reach here, id matches as well as email exists, so finally update the USER DB

            const user = await User.findOneAndUpdate({email}, {"isValidated":true});

            if(!user){
                throw Error('NOSCHUSR');
            }

            res.status(200).send(`<h4>Email has been verified</h4><p>Login to srty app and use its features</p>`);

        } catch (error) {
            const parsedError = handleError(error);
            //console.log(parsedError);
            res.status(409).json({parsedError});            
        }
    };