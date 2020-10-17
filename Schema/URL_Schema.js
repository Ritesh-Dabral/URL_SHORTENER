const mongoose  = require('mongoose');

const urlSchema = new mongoose.Schema({
    name: {
        type:String,
        minlength:3,
        required:true
    },
    oriURL : {type:String,minlength:10,required:true},
    newURL : {type: String,required:true},
    created: {type: Date, default:Date.now()},
});


const URL = mongoose.model('URL', urlSchema);

module.exports = URL;