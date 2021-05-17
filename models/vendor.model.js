var mongoose=require('mongoose');
var Schema=mongoose.Schema;

const vendorSchema = new Schema({
    vendorId:{
            type:mongoose.Schema.Types.ObjectId
    },
    fname: {
        type: String,
        trim: true,
        required:true
    },
    lname: {
        type: String,
        trim: true,
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
  
    phone: {
        type: Number,
        trim: true
    },
    address: {
        type: String,
        trim: true,
        required:true
    },
   
    gender: {
        type: String,
        trim: true
    },
   
   
},
{
    timestamps: true
}
),

Vendor = mongoose.model('vendor', vendorSchema);

module.exports = Vendor;
