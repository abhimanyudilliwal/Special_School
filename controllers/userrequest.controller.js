
const Session = require('../models/userrequest');
const PurchaseInventories = require('../models/purchase_inventories.model');
const Inventories = require('../models/addinventories.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const secret = 'hdaiu$$^%67777siojvIIUfbvheiruejwrkekdmfvdnahsrfw8urewriwjUTYt$@#@R^ewuu'

module.exports = {

    bookSession: async (input) => {
        return new Promise(async (resolve) => {
            try {
                jwt.verify(input.token, secret, (err, authData) => {
                    if (!authData) resolve({
                        status: false,

                    })
                    username = `${authData.data.fname}+${authData.data.lname}`
                    Session.findOne({
                        vendorId: input.vendorId
                    }, async (err, data) => {
                        console.log(err)
                        if (err) resolve({
                            status: false,
                            message: 'Please try after some time'
                        })

                        var newSession = new Session({
                            userId: authData.data.userId,
                            username,
                            vendorId: input.vendorId,
                            time: input.time,
                            Date: input.Date
                        });

                        newSession.save(async (error, data) => {

                            if (error) resolve({
                                status: false,
                                error:error,
                                message: 'Please try after some time'
                            })

                            resolve({
                                status: true,
                                data: data,
                                message: 'session booked sucessfully',

                            })
                        });
                    });

                })
            } catch (error) {

                resolve({
                    status: false,
                    message: 'Please try after some time'
                });
            }
        })
    },
    AddtoCart: async (input) => {
      console.log("=+++",input)
        return new Promise(async (resolve) => {
            try {

                jwt.verify(input.token, secret, (err, authData) => {
               console.log("@@",authData)
                    if (!authData) resolve({
                        status: false,

                    })
                    username = `${authData.data.fname} ${authData.data.lname}`

                    Inventories.findOne({
                        providers_id: input.providers_id
                    }, async (err, data) => {
                        console.log(err)
                        console.log(data)
                        if (err) resolve({
                            status: false,
                            message: 'Please try after some time'
                        })

                        var newPurchase = new PurchaseInventories({
                            userId: authData.data.userId,
                            username,
                            Orderitems:input.Orderitems,
                            shop_name:data.shop_name,
                            Shipping_address:input.Shipping_address,
                            providers_id: input.providers_id
                        });

                        newPurchase.save(async (error, data) => {
                            console.log(error)
                            if (error) resolve({
                                status: false,
                                message: 'Please try after some time'
                            })

                            resolve({
                                status: true,
                                data: data,
                                message: 'added in cart',

                            })
                        });
                    });
                })
            } catch (error) {

                resolve({
                    status: false,
                    message: 'Please try after some time'
                });
            }
        })
    },


}