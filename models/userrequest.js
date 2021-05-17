var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const sessionSchema = new Schema({

   userId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'user',
       required:true
   },
   username:{
       type:String
   },
   vendorId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'vendor',
       required:true
   },
   status:{
       type:String,
       default:""
   },

   time:{
       type:String,
       required:true

   },
   Date:{
       type:String,
       required:true
   },
   
   

}, {
    timestamps: true
}),

    Session = mongoose.model('vendor_mapping', sessionSchema);

module.exports = Session;
