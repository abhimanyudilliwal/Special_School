var mongoose = require('mongoose');
const { MessageStreamsFilteringParameters } = require('postmark/dist/client/models');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId
    },
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required:true

    },
    typeofDisability:{
        type:String,
        enum:["Blind","Deaf","Dumb"]
    },
    Dob:{
        type:String
    },
    address:{
        type:String
    },
    Gaurdian_name:{
        type:String
    },
    Gaurdian_phoneno:{
        type:Number
    },
    loc:{
        latitude:{
            type: Number
        },
        longitude:{
            type: Number
        }

    }

}, {
    timestamps: true
}),

    User = mongoose.model('user', userSchema);

module.exports = User;
