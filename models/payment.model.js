var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PaymentDetailsSchemaSchema = new Schema({
    razorpayDetails: {
        orderId: String,
        paymentId: String,
        signature: String,
        usename:String,
        useremail:String
      },
      amount:{
           type:String
      },
     
      success: Boolean,
    
}, {
    timestamps: true
}),

PaymentDetails = mongoose.model('Payments_master', PaymentDetailsSchemaSchema);

module.exports = PaymentDetails;
