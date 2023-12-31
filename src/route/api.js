import express from 'express';
import authenicationController from '../controller/authenicationController';
import userController from '../controller/userController';
import productController from '../controller/productController';
import passport from 'passport';


let router = express.Router();

const initAPIRoutes = (app) => {
    // router.get('/users', userController.getAllUsers);
    router.post('/create-user', userController.createUser);
    router.put('/update-user', userController.updateUser);
    router.post('/send-sms', authenicationController.sendSMS);
    router.post('/email-otp-sender', authenicationController.emailOTPSender);
    router.post('/get-user', userController.findUser);
    router.get('/get-product', productController.getAllProduct);
    router.get('/get-food-product', productController.getFoodProduct);
    router.get('/get-drink-product', productController.getDrinkProduct);
    router.get('/get-category', productController.getCategoryName);
    router.get('/get-product-page', productController.getAllProductPage);
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google'));

    app.use('/api', router);
}

export default initAPIRoutes;
