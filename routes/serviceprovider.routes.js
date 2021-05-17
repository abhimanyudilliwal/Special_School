var express = require('express');
var router = express.Router();
var ServiceProviderHandler = require('../controllers/serviceproviders.controller');



router.post('/register', async (req, res, next) => {
    let Serviceproviderregister = await ServiceProviderHandler.serviceProviderRegister(req.body);

    if (!Serviceproviderregister.status) return res.status(400).json(Serviceproviderregister);

    res.status(200).json(Serviceproviderregister)
});

//login
router.post('/login', async (req, res, next) => {
    let isLogin = await ServiceProviderHandler.Serviceproviderlogin(req.body.email, req.body.password);

    if (!isLogin.status) return res.status(400).json(isLogin);

    res.status(200).json(isLogin)
});

router.get('/providerslist', async (req, res, next) => {
    let GetServiceProvider = await ServiceProviderHandler.getAllServiceprovider();

    if (!GetServiceProvider.status) return res.status(400).json(GetServiceProvider);

    res.status(200).json(GetServiceProvider)
});
router.post('/update', async (req, res, next) => {
    let ServiceproviderUpdate = await ServiceProviderHandler.updateServiceProviderAccount(req.body);

    if (!ServiceproviderUpdate.status) return res.status(400).json(ServiceproviderUpdate);

    res.status(200).json(ServiceproviderUpdate)
});
router.post('/addinventories', async (req, res, next) => {
    let AddinventoriesItem = await ServiceProviderHandler.AddInventories(req.body);

    if (!AddinventoriesItem.status) return res.status(400).json(AddinventoriesItem);

    res.status(200).json(AddinventoriesItem)
});
router.post('/approve', async (req, res, next) => {
    let ApprovePurchase = await ServiceProviderHandler.ApproveRequest(req.body);

    if (!ApprovePurchase.status) return res.status(400).json(ApprovePurchase);

    res.status(200).json(ApprovePurchase)
});
router.post('/decline', async (req, res, next) => {
    let DeclinePurchase = await ServiceProviderHandler.DeclineRequest(req.body);

    if (!DeclinePurchase.status) return res.status(400).json(DeclinePurchase);

    res.status(200).json(DeclinePurchase)
});
router.post('/reset-link', async (req, res, next) => {
    let resetLink = await ServiceProviderHandler.forgotPasswordResetLinkServiceProvider(req.body)
    if(!resetLink) return res.status(400).json(resetLink);
    res.status(200).json(resetLink)
})

//save forgot new password
router.post('/set-password', async (req, res, next) => {
    let newPassword = await ServiceProviderHandler.setResetPasswordProvider(req.body)
    if(!newPassword) return res.status(400).json(newPassword);
    res.status(200).json(newPassword)
})
       module.exports = router;