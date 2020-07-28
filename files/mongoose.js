var mongoose        = require('mongoose'),
    mongo_need_obj  = {
        useNewUrlParser: true,
        useFindAndModify: true,
        useCreateIndex: true,
        useUnifiedTopology:true,
    }

    const uri = process.env.URI || "mongodb://127.0.0.1:27017/srtyURL";

mongoose.connect(uri,mongo_need_obj,function(err,db_res){
    if(err){
        console.log(err);
    }
    else {
        console.log('connected to srtyURL');
    }
});

var srtySchema = new mongoose.Schema({
    name:String,
    oriURL:String,
    newURL:String,
    createdBy:String,
    created: {type: Date, default:Date.now},
});

module.exports = srtyIns = mongoose.model('shorty',srtySchema); //collection with name , plural of 'shorty' i.e shorties is made