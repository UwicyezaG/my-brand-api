
import express, { Request, Response } from "express";
import UserAc from "../models/userAc";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userAc from "../models/userAc";

// Define the secret key for JWT tokens
const JWT_SECRET_KEY = "bakame";
class UserController {
  // Create user
  /**
   * @swagger
   * /api/user/register:
   *   post:
   *     summary: Create a new user account
   *     tags: [User]
   *     description: Create a new user account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: User account successfully created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                 username:
   *                   type: string
   *                 email:
   *                   type: string
   *       400:
   *         description: Bad request, valid inputs are required
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: valid inputs are required
   *       409:
   *         description: User account already exists
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: This User Account Already Exists
   *       500:
   *         description: Error in creating user account
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Error in creating user account
   */
  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Valid input is required" });
      }

      const existingUser = await UserAc.findOne({ username });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "This user account already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new UserAc({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error in creating user account" });
    }
  }

  // Login user
  /**
   * @swagger
   * /api/user/login:
   *   post:
   *     summary: User Log in
   *     tags: [User]
   *     description: Log in
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User successfully logged in
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Welcome to your Account
   *       400:
   *         description: Bad request, required credentials are missing
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Required Credentials are required
   *       401:
   *         description: Unauthorized, wrong credentials provided
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Wrong Credentials
   *       500:
   *         description: Error in logging in
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Error in logging in
   */
  async logInUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      if ((!username && !email) || !password) {
        return res
          .status(400)
          .json({ message: "Required credentials are missing" });
      }

      const user = username
        ? await UserAc.findOne({ username })
        : await UserAc.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid username or email" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "Welcome to your account", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error in logging in" });
    }
  }

  // Retrieve all user accounts

  /**
 * @swagger
 * /api/user/allAc:
 *   get:
 *     summary: Get all user accounts
 *     tags: [User]
 *     description: Retrieves all user accounts.
 *     responses:
 *       200:
 *         description: List of all user accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Error in retrieving user accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error retrieving users
 */
  async getAllAccounts(req: Request, res: Response) {
    try {
      const users = await UserAc.find();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error retrieving users" });
    }
  }

  // Update account credentials
  /**
   * @swagger
   * /api/user/updateAc/{id}:
   *   put:
   *     summary: Update account credentials
   *     tags: [User]
   *     description: Updates the credentials of a user account based on the provided ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the user account to be updated
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User account credentials updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User account credentials updated successfully
   *       400:
   *         description: Bad request, valid inputs are required
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Valid inputs are required
   *       404:
   *         description: User account not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User account not found
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Error updating user account credentials
   */
  async updateAccount(req: Request, res: Response) {
    const userId  = req.params;
      const { username, email, password } = req.body;
    try {
      const updatedUser = await userAc.findById(userId)
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Valid inputs are required" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      if (!updatedUser) {
        return res.status(404).json({ message: "User account not found" });
      }

      if(username){
        updatedUser.username = username
      }
      if(email){
        updatedUser.email
      }
      if(password){
        updatedUser.password = password
      }

      await updatedUser.save()
      res
        .status(200)
        .json({ message: "User account credentials updated successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error updating user account credentials" });
    }
  }

  // Delete an account
  /**
   * @swagger
   * /api/user/delete/{id}:
   *   delete:
   *     summary: Delete an account
   *     tags: [User]
   *     description: Deletes a user account based on the provided id.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the user account to be deleted
   *     responses:
   *       200:
   *         description: User account deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: This account is successfully deleted
   *       404:
   *         description: User account not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User account not found
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Error deleting user account
   */

  async deleteAccount(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await UserAc.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: "User account not found" });
      }
      res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting user account" });
    }
  }
}

export default UserController;
