const mongoose  = require('mongoose');

const urlSchema = new mongoose.Schema({
    name: {
        type:String,
        minlength:3
    },
    oriURL : {type:String,minlength:10},
    newURL : {type: String},
    created: {type: Date, default:Date.now()},
});


const URL = mongoose.model('URL', urlSchema);

module.exports = URL;