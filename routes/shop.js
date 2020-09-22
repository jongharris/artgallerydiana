const path = require('path');
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/paintings');
const shopController = require('../controllers/shop');
const authUser = require('../middleware/auth');

router.get('/', shopController.getProducts);

//dynamic route, we add a variable :, signals not to look for a route with the ID except that its part ofi t
router.get('/inquire/:paintingID', authUser.loginAuth,shopController.getInquiry);

router.post('/bag', authUser.loginAuth, shopController.deleteFromBag);

router.get('/bag', authUser.loginAuth, shopController.getBag);

router.post('/', authUser.loginAuth, shopController.postBag);



module.exports = router;