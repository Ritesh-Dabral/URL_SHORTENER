
/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 

    const mongoose  = require('mongoose'),
        Schema      = mongoose.Schema,
        {isEmail}   = require('validator'),
        bcrypt      = require('bcrypt');



/*-------------------- S C H E M A ----------------------*/ 

    const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required:[true, 'An email is required'],
            unique:true,
            lowercase: true,
            validate : [isEmail, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: [true, 'A password is required'],
            minlength: [6, 'Minimum 6 characters required'],
        },
        isValidated:{
            type:Boolean,
            default:false
        },
        myURL:[{
            type: Schema.Types.ObjectId, ref: 'URL'
        }]
    });



/*-------------------- M O N G O O S E     H O O K S ----------------------*/ 

    // hash password before saving the document

    userSchema.pre('save', async function(next){

        const saltrounds = await bcrypt.genSalt();

        this.password = await bcrypt.hash(this.password, saltrounds);

        next();
    });


    // custom login function
     
    userSchema.statics.login = async function(email, password){
        
        const user = await this.findOne({email});

        if(user){
            const check = await bcrypt.compare(password, user.password);

            if(check)
                return user;
                
            throw Error('Incorrect Password');
        }
        
        throw Error('Incorrect Email');
    }
/*-------------------- M O D E L     A N D     E X P O R T S ----------------------*/ 

    const User = mongoose.model('Users', userSchema);

    module.exports = User;