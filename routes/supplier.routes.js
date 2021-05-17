var express = require('express');
var router = express.Router();
var SupplierHandler = require('../controllers/supplier.controller');



router.post('/register', async (req, res, next) => {
    let Supplierregister = await SupplierHandler.Supplierregister(req.body);

    if (!Supplierregister.status) return res.status(400).json(Supplierregister);

    res.status(200).json(Supplierregister)
});

//login
router.post('/login', async (req, res, next) => {
    let isLogin = await SupplierHandler.Supplierlogin(req.body.email, req.body.password);

    if (!isLogin.status) return res.status(400).json(isLogin);

    res.status(200).json(isLogin)
});

router.get('/supplierlist', async (req, res, next) => {
    let GetSupplier = await SupplierHandler.getAllSupplier();

    if (!GetSupplier.status) return res.status(400).json( GetSupplier);

    res.status(200).json( GetSupplier)
});
router.post('/update', async (req, res, next) => {
    let SupplierUpdate = await SupplierHandler.updateSupplierAccount(req.body);

    if (!SupplierUpdate.status) return res.status(400).json(SupplierUpdate);

    res.status(200).json(SupplierUpdate)
});

router.post('/reset-link', async (req, res, next) => {
    let resetLink = await SupplierHandler.forgotPasswordResetLinkSupplier(req.body)
    if(!resetLink) return res.status(400).json(resetLink);
    res.status(200).json(resetLink)
})

//save forgot new password
router.post('/set-password', async (req, res, next) => {
    let newPassword = await SupplierHandler.setResetPasswordSupplier(req.body)
    if(!newPassword) return res.status(400).json(newPassword);
    res.status(200).json(newPassword)
})
       module.exports = router;