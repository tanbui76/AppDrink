import express from 'express';
import userController from '../controller/userController';

let router = express.Router();

const initAPIRoutes = (app) => {
    // router.get('/users', userController.getAllUsers);
    router.post('/create-user', userController.createUser);

    app.use('/api', router);
}

export default initAPIRoutes;