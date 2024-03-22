import express, {Request, Response} from 'express';
import BlogPost from '../models/blogPost';

class BlogController{    
    //createblog
    async createBlog (req: Request, res: Response){
        try{
            const {title, category, image, description} = req.body;
            if(!title|| !category || !image || !description){
                return res.status(400).json({
                    message:"Invalid inputs"
                })
            }
             //existed blog
             const existingPost = await BlogPost.findOne({title});
              if(existingPost){
                return res.status(409).json({
                    message: "The blog with this title already exist"
                });
              }
            const newPost = new BlogPost({ title, category, image, description});
            await newPost.save();
            res.status(201).json(newPost);
        }catch(error){
            res.status(500).json({   error: 'Error creating blog post'   });
        }
    };
    //Retrieve
    async retrieveBlog (req: Request, res: Response) {
        try{
           const blogs = await BlogPost.find()
           res.status(200).json(blogs);
        }
        catch (error){  res.status(500).json({error: 'Error fetching blog'}) }
    }
    //updateblog
     async updateBlog(req: Request, res: Response){
        try{
        const {title, category, image, description} = req.body;
        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            {title, category, image, description},
            {new: true} );
         if(!updatedPost){
            return res.status(404).json({error : 'Blog not found'})
         } res.json(updatedPost);
        } catch(error){ res.status(500).json({error : 'Error in Updating Blog'}); }
    };
    //deleteblog
    async deleteBlog (req: Request, res: Response) {
        try{
            const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
            if(!deletedPost){
                return res.status(404).json({error: 'Blog post not foundd'});
            }
            res.json({message: 'Blog Post is successfully Deleted'});
        }
        catch (error){ res.status(500).json({error: 'Error in deleting the this blog post'});    }
    };
};
export default BlogController