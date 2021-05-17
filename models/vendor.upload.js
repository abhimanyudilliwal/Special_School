var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const uploadSchema = new Schema({
    
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'vendor',
        required:true
    },
    vendorname:{
       type:String
    },
    paths: {
        type: [String],
        default: [],
        }
}, {
    timestamps: true
}),

    VendorUpload = mongoose.model('vendor_upload_master', uploadSchema);

module.exports = VendorUpload;
