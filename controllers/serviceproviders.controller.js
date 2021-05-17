
const ServiceProvider = require('../models/serviceproviders.model');
const Inventories = require('../models/addinventories.model');
const PurchaseInventories = require('../models/purchase_inventories.model');
const PasswordHandler = require('../utils/password.handler');
const JWTHandler = require('../utils/jwt.handler');
const EncryptPassword = require('../utils/password.handler');
const mongoose = require('mongoose');
const SendEmail = require('../utils/send-email')
const jwt = require('jsonwebtoken');
const secret = 'hdaiu$$^%67777siojvIIUfbvheiruejwrkekdmfvdnahsrfw8urewriwjUTYt$@#@R^ewuu'

module.exports = {

    //register new user
    serviceProviderRegister: async (providerInfo) => {
        console.log('[==== register Request ====]', providerInfo)
        return new Promise(async (resolve) => {
            try {
                //encrypt the  password
                let encryptedPassword = await EncryptPassword.encryptPassword(providerInfo.password)
                if (!encryptedPassword) {
                    resolve({
                        status: false,
                        message: 'Please try after some time'
                    })
                }
                ServiceProvider.findOne({
                    email: providerInfo.email
                }, async (err, data) => {
                    console.log(err)
                    if (err) resolve({
                        status: false,
                        message: 'Please try after some time'
                    })

                    if (data) resolve({
                        status: false,
                        message: 'Email is already used'
                    })
                    var newServiceProvider = new ServiceProvider({
                        providers_id: new mongoose.Types.ObjectId(),
                        fname: providerInfo.fname,
                        lname: providerInfo.lname,
                        phone: providerInfo.phone,
                        address: providerInfo.address,
                        shop_name: providerInfo.shop_name,
                        typeofBussiness: providerInfo.typeofBussiness,
                        email: providerInfo.email,
                        password: encryptedPassword,
                    });
                    newServiceProvider.save(async (error, provider) => {
                        console.log(error)
                        if (error) resolve({
                            status: false,
                            message: 'Please try after some time'
                        })
                 
                        let emailObj = {
                            email: providerInfo.email,
                            person_name: `${providerInfo.fname} ${providerInfo.lname}`,
                            password: providerInfo.password
                        }
                        let sendLoginCredentials = await SendEmail.sendMail(emailObj)

                        resolve({
                            status: true,
                            data: provider,
                            message: 'You are registered',

                        })
                    });
                });

            } catch (error) {
               
                resolve({
                    status: false,
                    message: 'Please try after some time'
                });
            }
        })
    },

    //login
    Serviceproviderlogin: async (email, password) => {
        return new Promise(async (resolve) => {
            try {
                ServiceProvider.findOne({
                    email: email
                }, async (err, data) => {
                    console.log(err)
                    console.log(data)
                    if (err) resolve({
                        status: false,
                        message: 'Please try after some time'
                    });
                    if (!data) resolve({
                        status: false,
                        message: 'You are not registered!',
                    })
                    let isValidPassword = await PasswordHandler.checkPassword(password, data.password);
                    if (!isValidPassword) resolve({
                        status: false,
                        message: 'Wrong password!'
                    })
                    let token = await JWTHandler.signToken(data);
                    resolve({
                        status: true,
                        message: 'Success!',
                        data: data,
                        token: token
                    })
                });
            } catch (error) {
                resolve({
                    status: false,
                    message: 'Please try after some time'
                });
            }
        })
    },
    getAllServiceprovider: async () => {
        return new Promise(async (resolve) => {
            try {
                ServiceProvider.find(async (err, providerData) => {
                    if (err) resolve({
                        status: false,
                        message: 'Please try again'
                    })
                    resolve({
                        status: true,
                        message: 'Service Provider fetched successfully',
                        data: providerData
                    })
                }).sort('-createdAt')
            } catch (error) {
                resolve({
                    status: false,
                    message: 'Please try after some time'
                });
            }
        })
    },
    getServiceproviderbyid: async (input) => {
        return new Promise(async (resolve) => {
            try {
                ServiceProvider.find({ _id: input._id }, async (err, providerData) => {
                    if (err) resolve({
                        status: false,
                        message: 'Please try again'
                    })
                    resolve({
                        status: true,
                        message: 'Service provider fetched successfully',
                        data: providerData
                    })
                }).sort('-createdAt')
            } catch (error) {
                resolve({
                    status: false,
                    message: 'Please try after some time'
                });
            }
        })
    },
    updateServiceProviderAccount: async (input) => {
        console.log('[==== updateAccount ====]', input);
        return new Promise(async (resolve) => {
            try {
                ServiceProvider.findOne({
                    _id: input._id
                }, async (err, data) => {
                    data.fname = input.fname
                    data.lname = input.lname
                    data.phone = input.phone
                    data.address = input.address
                    data.save(async (error, provider) => {
                        if (error) {
                            resolve({
                                status: false,
                                message: 'Failed to update profile'
                            })
                        }
                        resolve({
                            status: true,
                            data: provider,
                            message: 'Profile updated'
                        })
                    })
                })
            } catch (error) {
                resolve({
                    status: false,
                    message: 'Internal Server Error'
                })
            }
        })
    },
    AddInventories: async (input) => {
        console.log('[==== Request ====]', input)
        return new Promise(async (resolve) => {
            try {

                jwt.verify(input.token, secret, (err, authData) => {
                    console.log(err)
                    console.log(authData)
                    if (!authData) resolve({
                        status: false,

                    })
                        var newInventories = new Inventories({
                           providers_id:authData.data.providers_id,
                           shop_name:authData.data.shop_name,
                           product_name:input.product_name,
                           price:input.price,
                           image:input.image,
                           brand:input.brand,
                           countInStock:input.countInStock
                        });
                        newInventories.save(async (error, provider) => {
                            console.log(error)
                            if (error) resolve({
                                status: false,
                                message: 'Please try after some time'
                            })
                            resolve({
                                status: true,
                                data: provider,
                                message: 'added sucessfully',

                            })
                        })
                });

            } catch (error) {
                resolve({
                    status: false,
                    message: 'Please try after some time'
                });
            }
        })
    },

    ApproveRequest: async (input) => {
        console.log('[==== ====]', input);
        return new Promise(async (resolve) => {
            try {
                PurchaseInventories.findOne({
                    userId: input.userId
                }, async (err, data) => {
                    data.status = "Y"
                    data.save(async (error, data) => {
                        if (error) {

                            resolve({
                                status: false,
                                message: 'Failed to approve'
                            })
                        }
                        resolve({
                            status: true,
                            data: data,
                            message: 'Approved'
                        })
                    })
                })
            } catch (error) {
                resolve({
                    status: false,
                    message: 'Internal Server Error'
                })
            }
        })
    },
    DeclineRequest: async (input) => {
        console.log('[==== ====]', input);
        return new Promise(async (resolve) => {
            try {
                PurchaseInventories.findOne({
                    userId: input.userId
                }, async (err, data) => {
                    data.status = "N"
                    data.save(async (error, data) => {
                        if (error) {
                            resolve({
                                status: false,
                                message: 'Failed to decline'
                            })
                        }
                        resolve({
                            status: true,
                            data: data,
                            message: 'Declined'
                        })
                    })
                })
            } catch (error) {
                console.log('[======]', error)
                resolve({
                    status: false,
                    message: 'Internal Server Error'
                })
            }
        })
    },
    forgotPasswordResetLinkServiceProvider: async (input) => {
        console.log('request obj', input)
        return new Promise(async (resolve) => {
            try {
                ServiceProvider.findOne({
                    email: input.email
                }, async (err, data) => {
                    if (err) {
                        resolve({
                            status: false,
                            message: 'failed'
                        })
                    } else if (!data) {
                        resolve({
                            status: false,
                            message: 'Invalid email'
                        })
                    } else {
                        console.log('check data availbale', data)
                        data.reset_token = await JWTHandler.resetPasswordToken(data._id)
                        data.username = `${data.fname} ${data.lname}`;
                        let sendResetLink = await SendEmail.sendresetMail(data.username, data.email, data.reset_token)
                        resolve({
                            status: true,
                            message: 'success',
                            data: sendResetLink
                        })
                    }
                })
            } catch (error) {
                console.log(error)
                resolve({
                    status: false,
                    message: 'Internal Server Error'
                })
            }
        })
    },

    //set change password for reset link
    setResetPasswordProvider: async (input) => {
        console.log('input', input)
        return new Promise(async (resolve) => {
            try {
                if (input.new_password != input.confirm_password) {
                    resolve({
                        status: false,
                        message: 'Password Mismatch'
                    })
                } else {

                    jwt.verify(input.token, secret, (err, authData) => {
                        console.log(authData)
                        if (!authData) {
                            resolve({
                                status: false,

                            })

                        } else {
                            ServiceProvider.findOne({
                                _id: authData.data
                            }, async (err, provider) => {
                                if (err) {
                                    resolve({
                                        status: false,
                                        message: 'Please try after some time'
                                    })
                                } else {
                                    
                                    provider.password = await EncryptPassword.encryptPassword(input.confirm_password)
                                    provider.save(async (error, provider) => {
                                        if (error) {
                                            resolve({
                                                status: false,
                                                message: 'Failed'
                                            })
                                        }

                                        resolve({
                                            status: true,
                                            message: 'success',
                                            data: provider
                                        })
                                    })


                                }
                            })

                        }
                    })
                }
            } catch (error) {
                console.log(error)
                resolve({
                    status: false,
                    message: 'Internal Server Error'
                })
            }
        })
    }
}
