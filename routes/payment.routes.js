var express = require('express');
var router = express.Router();
var PaymentHandler = require('../controllers/payment.controller');




router.post('/api/payment/order',  async (req, res, next) => {
    let OrderPayment= await PaymentHandler.CreatePayment(req.body);
    if (! OrderPayment.status) return res.status(400).json( OrderPayment);
    res.status(200).json( OrderPayment)
});


router.post('/api/payment/verify', async (req, res, next) => {
    let isPurchase = await PaymentHandler.PaymentSucess(req.body);

    if (!isPurchase.status) return res.status(400).json(isPurchase);

    res.status(200).json(isPurchase)
});




       module.exports = router;