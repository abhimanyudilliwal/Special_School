var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const supplierSchema = new Schema({
 
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
   
    address:{
        type:String
    }


}, {
    timestamps: true
}),

    Supplier= mongoose.model('suppliers', supplierSchema);

module.exports = Supplier;
