const User = require('../models/user.model');
const PasswordHandler = require('../utils/password.handler');
const JWTHandler = require('../utils/jwt.handler');
const EncryptPassword = require('../utils/password.handler');
const SendEmail = require('../utils/send-email')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secret = 'hdaiu$$^%67777siojvIIUfbvheiruejwrkekdmfvdnahsrfw8urewriwjUTYt$@#@R^ewuu'
let nodeGeocoder = require('node-geocoder');

let options = {
    provider: 'openstreetmap'
  };
   
  let geoCoder = nodeGeocoder(options);
module.exports = {

    //register new user
    register: async (userInfo) => {
        return new Promise(async (resolve) => {
            try {
                let encryptedPassword = await EncryptPassword.encryptPassword(userInfo.password)
                if (!encryptedPassword) {
                    resolve({
                        status: false,
                        message: 'Please try after some time'
                    })
                }
                User.findOne({
                    email: userInfo.email
                }, async (err, data) => {
                    if (err) resolve({
                        status: false,
                        message: 'Please try after some time'
                    })
                    if (data) resolve({
                        status: false,
                        message: 'Email is already used'
                    })
                    var newUser = new User({
                        userId: new mongoose.Types.ObjectId(),
                        fname: userInfo.fname,
                        lname: userInfo.lname,
                        phone: userInfo.phone,
                        email: userInfo.email,
                        password: encryptedPassword,
                        typeofDisability: userInfo.typeofDisability
                    });
                    newUser.save(async (error, user) => {
                        if (error) resolve({
                            status: false,
                            error:error,
                            message: 'Please try after some time'
                        })
                        let emailObj = {
                            email: userInfo.email,
                            person_name: `${userInfo.fname} ${userInfo.lname}`,
                            password: userInfo.password
                        }
                        let sendLoginCredentials = await SendEmail.sendMail(emailObj)
                        resolve({
                            status: true,
                            data: user,
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
    login: async (email, password) => {
        return new Promise(async (resolve) => {
            try {
                User.findOne({
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
    addProfile: async (input) => {
        console.log("#####",input)
        return new Promise(async (resolve) => {
            try {
                User.findOne({
                   userId:input.userId
                }, async (err, data) => {
                    console.log("$$$$",err)
                  console.log(data)
                    if (err) resolve({
                        status: false,
                        message: 'Please try after some time'
                    })
                  
               
                   data.Dob=input.Dob,
                   data.Gaurdian_name=input.Gaurdian_name,
                   data.Gaurdian_phoneno=input.Gaurdian_phoneno
                    data.save(async (error, user) => {
                        if (error) resolve({
                            status: false,
                            message: 'Please try after some time'
                        })
                        resolve({
                            status: true,
                            data: user,
                            message: 'Profile added',

                        })

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
  //Get particular user profile
  getProfile: async (input) => {
    return new Promise(async (resolve) => {
        try {
            User.findOne({
                userId:input.userId
            }, async (err, data) => {
                if (err) resolve({
                    status: false,
                    message: 'Please try after some time'
                });

                if (!data) resolve({
                    status: true,
                    message: 'You are not regestered!',
                    data: user
                })

                resolve({
                    status: true,
                    message: 'Success!',
                    data: data
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
updateUserAccount: async(input) => {
    console.log('[==== updateAccount ====]', input);
    return new Promise(async(resolve) => {
        try {
            User.findOne({
                userId: input.userId
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
                error:error,
                message: 'Internal Server Error'
            })
        }
    })
},
forgotPasswordResetLinkUser: async(input) => {
    console.log('request obj', input)
    return new Promise(async(resolve) => {
        try {
            User.findOne({
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
setResetPasswordUser: async(input) => {
    console.log('input', input)
    return new Promise(async(resolve) => {
        try {
            if (input.new_password !== input.confirm_password) {
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
                    User.findOne({
                        _id: authData.data
                    }, async(err, user) => {
                        if (err) {
                            resolve({
                                status: false,
                                message: 'Please try after some time'
                            })
                        } else {
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
},
Userlocation: async(input) => {
    console.log('[====  ====]', input);
    return new Promise(async(resolve) => {
        try {
            User.findOne({
                userId: input.userId
            }, async(err, user) => {
              
                geoCoder.geocode(user.address,(err,data)=>{
                    console.log(data)
                    user.latitude=data.latitude,
                    user.longitude=data.longitude
                user.save(async(error, loc) => {
                    if (error) {
                        resolve({
                            status: false,
                            message: 'Failed'
                        })
                    }
                    resolve({
                        status: true,
                        data: loc,
                        message: 'Sucess'
                    })
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

}
