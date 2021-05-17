var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
   
   
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    username:{
        type:String
    },
    Orderitems:[
        {
        product_name:{
            type:String,
            reqired:true
        },
        
        price:{
            type:String
        },
        qty:{
            type:Number,
            required:true
        }
    }
    ],

    shop_name:{
         type:String

    },
    Shipping_address:{
        type:String,
        required:true
    },
    paymentMode:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["Done","Pending"],
        default:"Pending"
    }
    },



{
    timestamps: true
}),

    PurchaseInventories = mongoose.model('purchase_inventories_master', PurchaseSchema);

module.exports =PurchaseInventories;
