var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const InventoriesSchema = new Schema({
    
    providers_id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'service_providers_master'
    },
    shop_name:{
        type:String
    },
    product_name:{
        type:String
    },
    price:{
        type:Number
    },
    image:{
        type:String
    },
    brand:{
        type:String
    },
    countInStock:{
        type:Number
    }

}, {
    timestamps: true
}),

    Inventories = mongoose.model('inventories_master', InventoriesSchema);

module.exports = Inventories;
