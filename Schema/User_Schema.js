const mongoose  = require('mongoose'),
      Schema    = mongoose.Schema,
      {isEmail}  = require('validator');

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


const User = mongoose.model('Users', userSchema);

module.exports = User;