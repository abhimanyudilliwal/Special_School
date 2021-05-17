var mongoose=require('mongoose');
var Schema=mongoose.Schema;

const serviceproviderSchema = new Schema({
    providers_id:{
        type:mongoose.Schema.Types.ObjectId,
      
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
        trim: true,
        required:true
    },
    address: {
        type: String,
        trim: true,
        required:true
    },
   shop_name:{
       type:String,
       required:true
   },
   typeofBussiness:{
       type:String,
       required:true
   },
  
},
{
    timestamps: true
}
),

ServiceProvider = mongoose.model('service_providers_master', serviceproviderSchema);

module.exports = ServiceProvider;
