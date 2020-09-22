const path = require('path');
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/paintings')
const authUser = require('../middleware/auth');

//current object to hold paintings


router.get('/add-product', authUser.loginAuth, authUser.adminAuth, productsController.getAddProduct);

router.get('/paintings', authUser.loginAuth,productsController.getAdminPaintings)

// router.post('/paintings', productsController.postAdminPaintings);

router.post('/add-product', authUser.loginAuth, productsController.postAddProduct);

router.get('/add-product/:ID', authUser.loginAuth, productsController.getEditPainting);

router.post('/edit-product', authUser.loginAuth, productsController.postEditProduct);

router.post('/delete-product', authUser.loginAuth, productsController.postDeleteProduct);




module.exports = router;
