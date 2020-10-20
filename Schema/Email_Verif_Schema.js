
/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 
    const mongoose  = require('mongoose');


/*-------------------- S C H E M A ----------------------*/ 

    const email_verifSchema = new mongoose.Schema({
        uuid: {
            type: String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        createdOn:{
            type:Date,
            default: Date.now()
        }
    });



/*-------------------- M O D E L     A N D     E X P O R T S ----------------------*/ 


    const VerifyEmail = mongoose.model('emailverif', email_verifSchema);

    module.exports = VerifyEmail;