import express, {Request, Response} from 'express';
import UserAc from '../models/userAc';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

class UserController{
    //create user
    async createUser (req: Request, res: Response) {
        try{
            const {username, email, password} = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({
                     message: 'valid input are required' 
                    });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const existingAc = await UserAc.findOne({username});
              if (existingAc){
                return res.status(409).json({
                    message: "This User Account Already Exist"
                });
              }
            const newUser = new UserAc({ 
                username,
                email,
                password: hashedPassword});
            await newUser.save();

           // const token= jwt.sign({ userId: newUser_id}, 'secret-key', {expiresIn: '1h'});
           //res.status(201).json(newUser, to);
            res.status(201).json(newUser);
        } 
        catch(error){
            res.status(500).json({message: 'Error in creating user account'});
        }
    };
    //login user
    async logInUser (req: Request, res: Response){
         try{
            const { email,password} = req.body;

            if(!email || !password){
                return res.json(400).json({
                    message: "Required Credentials are required"
                });
            }
             const account = await UserAc.findOne({email});
            if(account){
              const passwordMatch = await bcrypt.compare(password, account.password);
              if(passwordMatch){
                return res.json({
                    message: "Welcome to your Account"
                });
              // const token =jwt.sign({ userId: account._id}, 'secret-key',{ expiresIn: 1h})
              }
            }
            else{
                return res.status(401).json({
                    message: "Wrong Credentials"
                });
            }
         }
         catch(error){
            res.status(500).json({error: 'Error in logging in'});
         }
    }
}
export default UserController