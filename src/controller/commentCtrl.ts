import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Comment from "../models/comment";
import comment from "../models/comment";

class CommentController {
  // //comment

  /**
   * @swagger
   * /api/comment/create:
   *   post:
   *     summary: Create a new comment
   *     tags: [Comment]
   *     description: Creates a new comment.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               content:
   *                 type: string
   *     responses:
   *       201:
   *         description: Comment successfully created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 content:
   *                   type: string
   *       400:
   *         description: Bad request, invalid inputs
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid inputs
   *       500:
   *         description: Error in creating comment
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Error creating comment
   */

  async createComment(req: Request, res: Response) {
    try {
      const { name, content } = req.body;

      const newComment = await comment.create({ name, content });

      res.status(201).json({
        message: "You have successfully commented",
        comment: newComment,
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Comment failed" });
    }
  }

  //getAll
  /**
   * @swagger
   * /api/comment/allComments:
   *   get:
   *     summary: Retrieve all comments
   *     tags: [Comment]
   *     description: Retrieve all comments
   *     responses:
   *       200:
   *         description: Successfully retrieved comments
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   name:
   *                     type: string
   *                   content:
   *                     type: string
   *       500:
   *         description: Error fetching comments
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Error fetching comments
   */

  async retrieveComment(req: Request, res: Response) {
    try {
      const comments = await Comment.find();
      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching comments" });
    }
  }

  //single
  /**
   * @swagger
   * /api/comment/singleComment/{id}:
   *   get:
   *     summary: Retrieve a single comment
   *     tags: [Comment]
   *     description: Retrieve a single comment by its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the comment to retrieve
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successfully retrieved the comment
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 content:
   *                   type: string
   *       404:
   *         description: Comment not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Comment not found
   *       500:
   *         description: Error retrieving the comment
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Error, retrieving message failed!
   */
  async singleComment(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.status(200).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error, retrieving message failed!" });
    }
  }
  //update
  /**
   * @swagger
   * /api/comment/updateComment/{id}:
   *   put:
   *     summary: Update a comment
   *     tags: [Comment]
   *     description: Update a comment based on the provided ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the comment to be updated
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               content:
   *                 type: string
   *     responses:
   *       200:
   *         description: Comment updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Comment updated successfully
   *                 comment:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     content:
   *                       type: string
   *       404:
   *         description: Comment not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Comment not found
   *       500:
   *         description: Error in updating the comment
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Error in updating the comment
   */

  async updateComment(req: Request, res: Response) {
    const { id } = req.params;
    const { name, content } = req.body;

    try {
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (name) {
        comment.name = name;
      }

      if (content) {
        comment.content = content;
      }

      await comment.save();
      res
        .status(200)
        .json({ message: "Comment updated successfully", comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error in updating the comment" });
    }
  }
  //delte
  /**
   * @swagger
   * /api/comment/removeComment/{id}:
   *   delete:
   *     summary: Delete a comment
   *     tags: [Comment]
   *     description: Delete a comment based on the provided ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the comment to be deleted
   *     responses:
   *       200:
   *         description: Comment successfully deleted
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Comment successfully deleted
   *       404:
   *         description: Comment not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Comment not found
   *       500:
   *         description: Error in deleting the comment
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Error in deleting the comment
   */

  async deleteComment(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedComment = await Comment.findByIdAndDelete(id);
      if (!deletedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      res.status(200).json({ message: "Comment successfully deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error in deleting the comment" });
    }
  }
}

export default CommentController;
