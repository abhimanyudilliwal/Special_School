var express = require('express');
var router = express.Router();
var UserHandler = require('../controllers/user.controller');

router.post('/register', async (req, res, next) => {
    let Userregister = await UserHandler.register(req.body);

    if (!Userregister.status) return res.status(400).json(Userregister);

    res.status(200).json(Userregister)
});

//login
router.post('/login', async (req, res, next) => {
    let isLogin = await UserHandler.login(req.body.email, req.body.password);

    if (!isLogin.status) return res.status(400).json(isLogin);

    res.status(200).json(isLogin)
});
router.post('/addprofile', async (req, res, next) => {
    let UserProfile = await UserHandler.addProfile(req.body);

    if (!UserProfile.status) return res.status(400).json(UserProfile);

    res.status(200).json(UserProfile)
});
//view selected user profile
router.post('/profile', async (req, res, next) => {
	let myProfile = await UserHandler.getProfile(req.body);

	if (!myProfile.status) return res.status(400).json(myProfile);

	res.status(200).json(myProfile)
});

router.post('/update-profile', async (req, res, next) => {
    let updateAccount = await UserHandler.updateUserAccount(req.body)
    if(!updateAccount) return res.status(400).json(updateAccount);
    res.status(200).json(updateAccount)
})

router.post('/reset-link', async (req, res, next) => {
    let resetLink = await UserHandler.forgotPasswordResetLinkUser(req.body)
    if(!resetLink) return res.status(400).json(resetLink);
    res.status(200).json(resetLink)
})

//save forgot new password
router.post('/set-password', async (req, res, next) => {
    let newPassword = await UserHandler.setResetPasswordUser(req.body)
    if(!newPassword) return res.status(400).json(newPassword);
    res.status(200).json(newPassword)
})
router.post('/user-loc', async (req, res, next) => {
    let userloc = await UserHandler.Userlocation(req.body)
    if(! userloc) return res.status(400).json( userloc);
    res.status(200).json( userloc)
})

       module.exports = router;