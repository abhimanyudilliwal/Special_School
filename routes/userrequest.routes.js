var express = require('express');
var router = express.Router();
var UserRequestHandler = require('../controllers/userrequest.controller');




router.post('/book', async (req, res, next) => {
    let Userrequest = await UserRequestHandler.bookSession(req.body);
    if (!Userrequest.status) return res.status(400).json(Userrequest);
    res.status(200).json(Userrequest)
});

//login
router.post('/purchase', async (req, res, next) => {
    let isPurchase = await UserRequestHandler.AddtoCart(req.body);

    if (!isPurchase.status) return res.status(400).json(isPurchase);

    res.status(200).json(isPurchase)
});




module.exports = router;