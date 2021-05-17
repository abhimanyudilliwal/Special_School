
const Supplier = require('../models/supplier.model');

const PasswordHandler = require('../utils/password.handler');
const JWTHandler = require('../utils/jwt.handler');
const EncryptPassword = require('../utils/password.handler');
const { Mongoose } = require('mongoose');
const SendEmail = require('../utils/send-email')
const jwt = require('jsonwebtoken');
const secret = 'hdaiu$$^%67777siojvIIUfbvheiruejwrkekdmfvdnahsrfw8urewriwjUTYt$@#@R^ewuu'

module.exports = {

    //register new user
    supplierRegister: async (supplierInfo) => {
        console.log('[==== register Request ====]', supplierInfo)
        return new Promise(async (resolve) => {
            try {
                //encrypt the  password
                let encryptedPassword = await EncryptPassword.encryptPassword(supplierInfo.password)
                if (!encryptedPassword) {
                    resolve({
                        status: false,
                        message: 'Please try after some time'
                    })
                }
                Supplier.findOne({
                    email: supplierInfo.email
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
                    var newSupplier = new Supplier({
                       
                        fname: supplierInfo.fname,
                        lname: supplierInfo.lname,
                        phone: supplierInfo.phone,
                        address: supplierInfo.address,
                        email: supplierInfo.email,
                        password: encryptedPassword,
                    });
                    newSupplier.save(async (error, supplier) => {
                        console.log(error)
                        if (error) resolve({
                            status: false,
                            message: 'Please try after some time'
                        })
                 
                        let emailObj = {
                            email: supplierInfo.email,
                            person_name: `${supplierInfo.fname} ${supplierInfo.lname}`,
                            password: supplierInfo.password
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
    Supplierlogin: async (email, password) => {
        return new Promise(async (resolve) => {
            try {
                Supplier.findOne({
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
    getAllSupplier: async () => {
        return new Promise(async (resolve) => {
            try {
                Supplier.find(async (err, supplierData) => {
                    if (err) resolve({
                        status: false,
                        message: 'Please try again'
                    })
                    resolve({
                        status: true,
                        message: 'Service Provider fetched successfully',
                        data: supplierData
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
    getSupplierbyid: async (input) => {
        return new Promise(async (resolve) => {
            try {
                Supplier.find({ _id: input._id }, async (err, supplierData) => {
                    if (err) resolve({
                        status: false,
                        message: 'Please try again'
                    })
                    resolve({
                        status: true,
                        message: 'Vendor fetched successfully',
                        data: vendorData
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
    updateSupplierAccount: async (input) => {
        console.log('[==== updateAccount ====]', input);
        return new Promise(async (resolve) => {
            try {
                Supplier.findOne({
                    _id: input._id
                }, async (err, data) => {
                    data.fname = input.fname
                    data.lname = input.lname
                    data.phone = input.phone
                    data.address = input.address
                    data.save(async (error, supplier) => {
                        if (error) {
                            resolve({
                                status: false,
                                message: 'Failed to update profile'
                            })
                        }
                        resolve({
                            status: true,
                            data: supplier,
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
   
    forgotPasswordResetLinkSupplier: async (input) => {
        console.log('request obj', input)
        return new Promise(async (resolve) => {
            try {
                Supplier.findOne({
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
    setResetPasswordSupplier: async (input) => {
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
                            Supplier.findOne({
                                _id: authData.data
                            }, async (err, supplier) => {
                                if (err) {
                                    resolve({
                                        status: false,
                                        message: 'Please try after some time'
                                    })
                                } else {
                                    
                                    supplier.password = await EncryptPassword.encryptPassword(input.confirm_password)
                                    supplier.save(async (error, supplier) => {
                                        if (error) {
                                            resolve({
                                                status: false,
                                                message: 'Failed'
                                            })
                                        }

                                        resolve({
                                            status: true,
                                            message: 'success',
                                            data: supplier
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
