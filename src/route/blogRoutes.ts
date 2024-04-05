import express, { Request, Response } from "express";
import BlogController from "../controller/blogCtrl";

const router = express.Router();
const blogController = new BlogController();

router.post("/posts/create", blogController.createBlog);
router.get("/posts/allblog", blogController.retrieveBlog);
router.get("/posts/singleblog/:id", blogController.singleBlog);
router.put("/posts/updateblog/:id", blogController.updateBlog);
router.delete("/posts/removeblog/:id", blogController.deleteBlog);

export default router;
