import express, { Request, Response } from "express";
import BlogController from "../controller/blogCtrl";
import upload from '../utils/multer';


const router = express.Router();
const blogController = new BlogController();

router.post("/posts/create", upload.single("image"), blogController.createBlog);
router.get("/posts/allblog", blogController.retrieveBlog);
router.get("/posts/singleblog/:id", blogController.singleBlog);
router.put("/posts/updateblog/:id", upload.single("image"), blogController.updateBlog);
router.delete("/posts/removeblog/:id", blogController.deleteBlog);

export default router;
