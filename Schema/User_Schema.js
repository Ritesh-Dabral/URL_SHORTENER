const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required,
        unique:true
    },
    password: {
        type: String,
        required,
        maxlength: 8
    },
    myURL:[{
        type: Schema.Types.ObjectId, ref: 'URL'
    }]
});


const User = mongoose.model('Users', userSchema);

module.exports = User;