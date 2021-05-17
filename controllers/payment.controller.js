
const dotenv=require("dotenv");
const PaymentDetails = require('../models/payment.model');
const crypto=require("crypto")
const Razorpay=require('razorpay')
dotenv.config()
module.exports = {

    
  CreatePayment: async (params) => {
        console.log('[====Request ====]', params)
        return new Promise(async (resolve) => {
            try {

                const instance=new Razorpay({
                    key_id:process.env.key_id,
                    key_secret:process.env.key_Secret
                })           
                instance.orders
                  .create(params, (err,fdata)=>{
                      console.log("",fdata)
                    if (err) resolve({
                        status: false,
                        message:'failed'

                    })
                     if(fdata)
                         resolve({
                             status: true,
                             data:fdata,
                             message: 'sucess',

                         })
                     })               

            } catch (error) {
               
                resolve({
                    status: false,
                    message: 'Please try after some time'
                });
            }
        })
    },
    PaymentSucess: async (input) => {
        console.log('[====  Request ====]', input)
        return new Promise(async (resolve) => {
            try {

                body = input.razorpay_order_id + "|" + input.razorpay_payment_id;

                var expectedSignature = crypto
                  .createHmac("sha256", process.env.key_Secret)
                  .update(body.toString())
                  .digest("hex");
                console.log("sig" + input.razorpay_signature);
                console.log("sig" + expectedSignature);
                var response = { status: "failure" };
                if (expectedSignature === input.razorpay_signature)
                  response = { status: "success" };
               console.log(response)


            //    jwt.verify(input.token, secret, (err, authData) => {
            //     console.log(err)
            //     console.log(authData)
            //     if (!authData) resolve({
            //         status: false,

            //     })  

                const newPayment = PaymentDetails({
                    razorpayDetails: {
                      orderId: input.razorpay_order_id,
                      paymentId:input.razorpay_payment_id,
                      signature: input.razorpay_signature
                    //   usename:authData.data.fname+authData.lname,
                    //   useremail:authData.data.email
                    },
                    success: true,
                  });
              console.log(newPayment)
                   newPayment.save(async (error, data) => {
                    console.log(error)
                    if (error) resolve({
                        status: false,
                        message: 'failed'
                    })
                    resolve({
                        status: true,
                        data: data,
                        message: 'payment sucess',

                    })
                });
                //  });
              
                
            } catch (error) {
               
                resolve({
                    status: false,
                    message: 'Please try after some time'
                });
            }
        })
    },

  
}
