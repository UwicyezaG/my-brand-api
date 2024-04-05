import express from 'express';
import CommentController from '../controller/commentCtrl';
import { authenticatedUser } from '../utils/token';


const router = express.Router();
const commentController = new CommentController()

router.post("/create", commentController.createComment);
router.get("/allComments", commentController.retrieveComment);
router.get("/singleComment/:id", commentController.singleComment);
router.put("/updateComment/:id", authenticatedUser, commentController.updateComment);
router.delete("/removeComment/:id", authenticatedUser, commentController.deleteComment);

export default router;


