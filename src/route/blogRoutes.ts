import express, {Request, Response} from 'express';
import BlogController from '../controller/blogCtrl';

const router = express.Router();
const blogController = new BlogController() 

//crud blogpost
router.post('/posts', blogController.createBlog);
router.get('/posts/', blogController.retrieveBlog);
router.put('/posts/', blogController.updateBlog);
router.delete('/posts/', blogController.deleteBlog);

  
export default router;