const jwt = require('jsonwebtoken');
const secret = 'hdaiu$$^%67777siojvIIUfbvheiruejwrkekdmfvdnahsrfw8urewriwjUTYt$@#@R^ewuu'

module.exports = {

    //Helper for login
    signToken: async (input) => {
        const token = await jwt.sign({
            data: input
        }, secret);
        return token;
    },

    //  verifyToken:async(input) => {
    //     //console.log('token',token.headers)
    //     try {
    //         var _headerToken = input.headers.authorization.split(' ')[1]
    //         //console.log(_header)
    //         // var _token = _headerToken.split(' ')[1]
    //         //console.log(_token)
    //         var decoded = await jwt.verify(_headerToken, secret);
    //         input.ctx = decoded
    //         if (decoded) {
    //             return decoded;
    //         } else {
    //             return null;
    //         }
    //     } catch (err) {
    //         console.log(err)
    //         return null;
    //     }
    // },

    validateToken: async (req, res, next) => {
        return new Promise(async (resolve) => {
            const authorizationHeaader = req.headers.authorization;
            let result;
            if (authorizationHeaader) {
                const token = req.headers.authorization.split(' ')[1]; // Bearer <token>

                const options = {
                    expiresIn: '2d',
                    //issuer: 'http://ocr.powerguru.co.in'
                };

                try {
                    // verify makes sure that the token hasn't expired and has been issued by us
                    result = jwt.verify(token, secret, options);

                    // Let's pass back the decoded token to the request object
                    req.decoded = result;
                    resolve({
                        status: true,
                        data: result,
                        message: 'vaild token'
                    })
                    // We call next to pass execution to the subsequent middleware
                    next();
                } catch (err) {
                    // Throw an error just in case anything goes wrong with verification
                    resolve({
                        status: false,
                        message: 'Invalid token'
                    })

                }
            } else {
                // result = { 
                //     error: `Authentication error. Token required.`,
                //     status: 401
                // };
                resolve({
                    status: false,
                    message: 'Authentication error. Token required'
                })
            }
        })
    },

    resetPasswordToken: async (user_id) => {
        const token = await jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: user_id
        }, secret);
        return token;
    },
}


