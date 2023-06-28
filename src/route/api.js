import express from 'express';
import userController from '../controller/userController';

let router = express.Router();

const initAPIRoutes = (app) => {
    // router.get('/users', userController.getAllUsers);
    router.post('/create-user', userController.createUser);
    router.put('/update-user', userController.updateUser);

    app.use('/api', router);
}

export default initAPIRoutes;