var express = require('express');
var router = express.Router();
var VendorHandler = require('../controllers/vendor.controller');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })

const upload = multer({ storage: storage ,
    // limits : {fileSize : 1000000}
})

router.post('/upload', upload.any(), async (req, res, next) => {
    let UploadSession = await VendorHandler.uploadSession(req)
    if(!UploadSession) return res.status(400).json(UploadSession);
    res.status(200).json(UploadSession)
})
router.post('/uploadhistory', async (req, res, next) => {
    let UploadSessionHistory = await VendorHandler.getUploadSession(req.body)
    if(!UploadSessionHistory) return res.status(400).json(UploadSessionHistory);
    res.status(200).json(UploadSessionHistory)
})


router.post('/vendorregister', async (req, res, next) => {
    let VendorAdd = await VendorHandler.registerVendor(req.body);

    if (!VendorAdd.status) return res.status(400).json(VendorAdd);

    res.status(200).json(VendorAdd)
});
router.post('/vendorlogin', async (req, res, next) => {
    let isLogin = await VendorHandler.Vendorlogin(req.body.email, req.body.password);

    if (!isLogin.status) return res.status(400).json(isLogin);

    res.status(200).json(isLogin)
});

router.get('/vendorslist', async (req, res, next) => {
    let Vendorslist= await VendorHandler.getAllVendors();

    if (!Vendorslist.status) return res.status(400).json(Vendorslist);

    res.status(200).json(Vendorslist)
});
router.post('/history', async (req, res, next) => {
    let Historysession= await VendorHandler.getBookedSession(req.body);

    if (!Historysession.status) return res.status(400).json(Historysession);

    res.status(200).json(Historysession)
});

router.post('/vendor', async (req, res, next) => {
    let getVendors = await VendorHandler.getVendorsbyid(req.body)
    if(!getVendors) return res.status(400).json(getVendors);
    res.status(200).json(getVendors)
})

router.post('/update-profile', async (req, res, next) => {
    let updateAccount = await VendorHandler.updateVendorAccount(req.body)
    if(!updateAccount) return res.status(400).json(updateAccount);
    res.status(200).json(updateAccount)
})
router.post('/approve', async (req, res, next) => {
    let Approved = await VendorHandler.ApproveRequest(req.body)
    if(!Approved) return res.status(400).json(Approved);
    res.status(200).json(Approved)
})
router.post('/decline', async (req, res, next) => {
    let Declined = await VendorHandler.DeclineRequest(req.body)
    if(!Declined) return res.status(400).json(Declined);
    res.status(200).json(Declined)
})

//forgot password reset link
router.post('/reset-link', async (req, res, next) => {
    let resetLink = await VendorHandler.forgotPasswordResetLink(req.body)
    if(!resetLink) return res.status(400).json(resetLink);
    res.status(200).json(resetLink)
})

//save forgot new password
router.post('/set-password', async (req, res, next) => {
    let newPassword = await VendorHandler.setResetPassword(req.body)
    if(!newPassword) return res.status(400).json(newPassword);
    res.status(200).json(newPassword)
})
       module.exports = router;