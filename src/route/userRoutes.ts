import express from 'express';
import  UserController from '../controller/userCtrl';


const router = express.Router();
const userController = new UserController()


router.post('/register' , userController.createUser);
router.post('/login' , userController.logInUser);
router.get('/allAc',userController.getAllAccounts);
router.put('/updateAc/:id', userController.updateAccount);
router.delete('/delete/:id', userController.deleteAccount);

export  default router 

