const User = require('../Schema/User_Schema');

function handleError(error){
    //console.log(error.message);
    const errorMessage = {
        email:"",
        password:""
    }

    if(error.code == 11000){
        errorMessage.email = 'Email already exists';
        return errorMessage
    }

    if(error.message.includes('Users validation failed')){
        Object.values(error.errors).forEach(({properties})=>{
            errorMessage[properties.path] = properties.message;
        });
    }

    return errorMessage;
}


// L O G I N

module.exports.login_post = async (req,res)=>{
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        // if no error
        if(user)
            res.status(201).send('Successfully logged In');
        else
            res.status(409).send('Login Failed, check email or password');

    } catch (error) {
        console.log('Error: ',error);
        res.status(409).send('Login Failed');
    }
}

// S I G N   U P
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

        // if no error
        res.status(201).send('Successfully Signed Up');
    } catch (error) {
        const parsedError = handleError(error);
        console.log(parsedError);
        res.status(409).send('Signup Failed');
    }
}