/*-------------------- C O N S T S     A N D    V A R S ----------------------*/ 

    const mongoose  = require('mongoose'),
          { isURL } = require('validator');
          options   = { 
                protocols: ['http','https','ftp'], 
                require_tld: true, 
                require_protocol: true, 
                require_host: true, 
                require_valid_protocol: true, 
                allow_underscores: false, 
                host_whitelist: false, 
                host_blacklist: false, 
                allow_trailing_dot: false, 
                allow_protocol_relative_urls: false, 
                disallow_auth: false 
            }


          
/*-------------------- S C H E M A ----------------------*/ 


    const urlSchema = new mongoose.Schema({
        name: {
            type:String,
            minlength:[3, 'Name should be more than 2 characters'],
            maxlength:[50,'Name should not exceed 50 characters'],
            required:true
        },
        oriURL : {
            type:String,
            required:true,
            validate:{validator:function(props){
                //console.log('props',props);
                return isURL(props, options);
            }, message:'Invalid URL'},
        },
        newURL : {type: String,required:true},
        createdBy: {
            type:String,
            required:true
        },
        created: {type: Date, default:Date.now()},
    });


/*-------------------- M O N G O O S E     H O O K S ----------------------*/ 

    urlSchema.statics.check_url = async function(oriURL,createdBy){
        const found_URL = await this.findOne({oriURL,createdBy});

        if(found_URL){
            return false;
        }

        return true;
    }


/*-------------------- M O D E L     A N D     E X P O R T S ----------------------*/ 


    const URL = mongoose.model('URL', urlSchema);

    module.exports = URL;