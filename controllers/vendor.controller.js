const Vendor = require('../models/vendor.model');
const PasswordHandler = require('../utils/password.handler');
const JWTHandler = require('../utils/jwt.handler');
const Session=require('../models/userrequest');
const VendorUpload=require('../models/vendor.upload');
const EncryptPassword = require('../utils/password.handler')
const SendEmail = require('../utils/send-email')
const mongoose=require('mongoose')
const jwt = require('jsonwebtoken');
const secret = 'hdaiu$$^%67777siojvIIUfbvheiruejwrkekdmfvdnahsrfw8urewriwjUTYt$@#@R^ewuu'

module.exports = {    
    registerVendor: async (vendorInfo) => {
        console.log('[====Request ====]', vendorInfo)
        return new Promise(async (resolve) => {
            try {

                let encryptedPassword = await EncryptPassword.encryptPassword(vendorInfo.password)
                if (!encryptedPassword) {
                    resolve({
                        status: false,
                        message: 'Please try after some time'
                    })
                }

                Vendor.findOne({
                    email: vendorInfo.email
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
                    var newVendor = new Vendor({
                        vendorId:new mongoose.Types.ObjectId(),
                        fname:vendorInfo.fname,
                        lname:vendorInfo.lname,
                        email: vendorInfo.email,
                        password: encryptedPassword,
                        phone:vendorInfo.phone,
                        address:vendorInfo.address,
                        gender:vendorInfo.gender         
                    });

                    newVendor.save(async (error, user) => {
                        console.log(error)
                        if (error) resolve({
                            status: false,
                            error:errr,
                            message: 'Please try after some time'
                        })
                      
                        let emailObj = {
                            email: vendorInfo.email,
                            person_name: `${vendorInfo.fname} ${vendorInfo.lname}`,
                            password: vendorInfo.password
                        }
                        let sendLoginCredentials = await SendEmail.sendMail(emailObj)      
                        resolve({
                            status: true,
                            data: user,
                            message: 'You are added',
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
    Vendorlogin: async (email, password) => {
        return new Promise(async (resolve) => {
            try {
                Vendor.findOne({
                    email: email
                }, async (err, data) => {
                 console.log(err )
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
    getAllVendors: async () => {
        return new Promise(async (resolve) => {
            try {
                Vendor.find( async (err, vendorData) => {
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
    getVendorsbyid: async (input) => {
        return new Promise(async (resolve) => {
            try {
                Vendor.find({_id:input._id}, async (err, vendorData) => {
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
    updateVendorAccount: async(input) => {
        console.log('[==== updateAccount ====]', input);
        return new Promise(async(resolve) => {
            try {
                Vendor.findOne({
                    _id: input._id
                }, async(err, data) => {
                    data.fname = input.fname
                    data.lname = input.lname
                    data.phone = input.phone
                    data.address = input.address
                    data.save(async(error, vendor) => {
                        if (error) {
                           
                            resolve({
                                status: false,
                                message: 'Failed to update profile'
                            })
                        }
                        resolve({
                            status: true,
                            data: vendor,
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
    ApproveRequest: async(input) => {
        console.log('[==== ====]', input);
        return new Promise(async(resolve) => {
            try {
                Session.findOne({
                  userId: input.userId
                }, async(err, data) => {
                    data.status = "Y"
                    data.save(async(error, data) => {
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
    DeclineRequest: async(input) => {
        console.log('[==== ====]', input);
        return new Promise(async(resolve) => {
            try {
                Session.findOne({
                  userId: input.userId
                }, async(err, data) => {
                    data.status = "N"
                    data.save(async(error, data) => {
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
              
                resolve({
                    status: false,
                    message: 'Internal Server Error'
                })
            }
        })
    },
    uploadSession: async(input) => {
        console.log('input request', input.body);
        return new Promise(async(resolve) => {
            try {

                jwt.verify(input.body.token, secret, (err, authData) => {
                    if (!authData) resolve({
                        status: false,

                    })
                    vendorname = `${authData.data.fname} ${authData.data.lname}`
                    const files = input.files;
                    const paths = [];
                    files.forEach((file) => {
                        paths.push(file.path);
                    });
                    let newVendorUpload = new VendorUpload({
                        vendorId:authData.data.vendorId,
                        vendorname,
                        paths
                    })
                    newVendorUpload.save(async(error, newdata) => {
                        if (error) resolve({
                            status: false,

                        })
                     
                        resolve({
                            status: true,
                            data: newdata
                        })
                    })
                })               
            } catch (error) {
                resolve({
                    status: false,

                });
            }
        })
    },
    getUploadSession: async (input) => {
        return new Promise(async (resolve) => {
            try {
                VendorUpload.findOne({vendorId:input.vendorId}, async (err, Data) => {
                    if (!Data) resolve({
                        status: false,
                        message: 'No record found'
                    })
                    resolve({
                        status: true,
                        message: 'fetched successfully',
                        data: Data
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
    getBookedSession: async (input) => {
        return new Promise(async (resolve) => {
            try {

                Session.find({vendorId:input.vendorId,status:"Y"}, async (err, Data) => {
                    console.log(Data)
                    if (err) resolve({
                        status: false,
                        message: 'Please try again'
                    })
                    resolve({
                        status: true,
                        message: 'History fetched successfully',
                        data: Data
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
    //send forgot password reset link
    forgotPasswordResetLink: async(input) => {
        console.log('request obj', input)
        return new Promise(async(resolve) => {
            try {
                Vendor.findOne({
                    email: input.email
                }, async(err, data) => {
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
                    }else{
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
    setResetPassword: async(input) => {
        console.log('input', input)
        return new Promise(async(resolve) => {
            try {
                if (input.new_password != input.confirm_password) {
                    resolve({
                        status: false,
                        message: 'Password Mismatch'
                    })
                } else {
                   
                     jwt.verify(input.token, secret ,(err,authData)=>{
                         console.log(authData)
                        if(!authData) {resolve({
                            status:false,

                        })
                        
                    } else {
                        Vendor.findOne({
                            _id: authData.data
                        }, async(err, user) => {
                            if (err) {
                                resolve({
                                    status: false,
                                    message: 'Please try after some time'
                                })
                            } else {
                                console.log('------------', user)
                                user.password = await EncryptPassword.encryptPassword(input.confirm_password)
                                user.save(async(error, user) => {
                                    if (error) {
                                        resolve({
                                            status: false,
                                            message: 'Failed'
                                        })
                                    }

                                    resolve({
                                        status: true,
                                        message: 'success',
                                        data: user
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
 

