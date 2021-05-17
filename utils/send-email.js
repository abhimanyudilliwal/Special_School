"use strict"


const apiKey = '36eb8cd5899c12d89adadd33437c0bfd-a09d6718-8b571a93';
const domain="sandbox351252042ae747bd9606658be6a74e35.mailgun.org"

const mailgun = require('mailgun-js')({ domain, apiKey });
module.exports = {


    //Helper for sending Email
    sendMail: async (input) => {
        console.log('[=== Send Email Request ===]', input);
        await mailgun.messages().send({
            from: `<shubham.t81096@gmail.com>`,
              to: input.email,
            subject: 'Login Details',
              text: `Here is Details`,
              html:`<h1>Hello  ${input.person_name}</h1>
                    <h3> This is your Login credentials</h3>
                    <p>email:${input.email}</p>
                    <p>password:${input.password}</p>`
            
            
          }).then((data) => {
            console.log(data)
            console.log('Message sent')
        }).catch((error) => {
            
            console.log(error)
            
        })
   
         
    },
  
    //Forgot Password reset Link
    sendresetMail: (username, email, reset_token) => {     
        console.log('reset token ===', username, email, reset_token)
        const resetLink = `http://localhost:3000/set-password/${reset_token}`
        console.log("***",resetLink)

          mailgun.messages().send({
            from: `Hello <shubham.tacatlanta@gmail.com>`,
              to: email,
            subject: 'Reset password',
              text: `Please click link to set password ${username} ${resetLink}`,
            
          }).then((data) => {
            console.log(data)
            console.log('Message sent')
        }).catch((error) => {
            
            console.log(error)
            
        })
   
         }
}