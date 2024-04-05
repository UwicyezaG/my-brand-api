import express, { Request, Response } from "express";
import BlogPost from "../models/blogPost";
import blogPost from "../models/blogPost";
import { clear } from "console";

class BlogController {
  //createblog

  /**
 * @swagger
 * /api/posts/create:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     description: Creates a new blog post.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog post successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 category:
 *                   type: string
 *                 image:
 *                   type: string
 *                 description:
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
 *       409:
 *         description: Blog with this title already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The blog with this title already exists
 *       500:
 *         description: Error in creating blog post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error creating blog post

 */

  async createBlog(req: Request, res: Response) {
    try {
      const { title, category, image, description } = req.body;
      if (!title || !category || !image || !description) {
        return res.status(400).json({
          message: "Invalid inputs",
        });
      }
      //existed blog
      const existingPost = await BlogPost.findOne({ title });
      if (existingPost) {
        return res.status(409).json({
          message: "The blog with this title already exist",
        });
      }
      const newPost = new BlogPost({ title, category, image, description });
      await newPost.save();
      res.status(201).json({
        ok: true,
        message: "Blog successfully created",
        blogPost: newPost,
      });
    } catch (error) {
      res.status(500).json({ error: "Error creating blog post" });
    }
  }
  //Retrieve

  /**
   * @swagger
   * /api/posts/allblog:
   *   get:
   *     summary: Retrieve all blog posts
   *     tags: [Blogs]
   *     description: Retrieves all blog posts.
   *     responses:
   *       200:
   *         description: List of all blog posts
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   title:
   *                     type: string
   *                   category:
   *                     type: string
   *                   image:
   *                     type: string
   *                   description:
   *                     type: string
   *       500:
   *         description: Error in fetching blog posts
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Error fetching blog posts
   */

  async retrieveBlog(req: Request, res: Response) {
    try {
      const blogs = await BlogPost.find();
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ error: "Error fetching blog" });
    }
  }

  //get single blog

  /**
   * @swagger
   * /api/posts/singleblog/{id}:
   *   get:
   *     summary: Retrieve a single blog post
   *     tags: [Blogs]
   *     description: Retrieves a single blog post by its ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the blog post to retrieve
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Blog post retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                 title:
   *                   type: string
   *                 category:
   *                   type: string
   *                 image:
   *                   type: string
   *                 description:
   *                   type: string
   *       404:
   *         description: Blog post not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Blog post not found
   *       500:
   *         description: Error in retrieving blog post
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Error retrieving blog post
   */
  async singleBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const blog = await BlogPost.findById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving blog post" });
    }
  }

  //updateblog
  /**
   * @swagger
   * /api/blog/posts/updateblog/{id}:
   *   put:
   *     summary: Update the blog post by ID
   *     tags: [Blogs]
   *     description: Update blog post using its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the blog post to update
   *         schema:
   *           type: string
   *       - in: body
   *         name: body
   *         required: true
   *         description: Updated blog post data
   *         schema:
   *           type: object
   *           properties:
   *             title:
   *               type: string
   *             category:
   *               type: string
   *             image:
   *               type: string
   *             description:
   *               type: string
   *     responses:
   *       200:
   *         description: Blog post successfully updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                 title:
   *                   type: string
   *                 category:
   *                   type: string
   *                 image:
   *                   type: string
   *                 description:
   *                   type: string
   *       404:
   *         description: Blog post not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Blog not found
   *       500:
   *         description: Error in updating the blog post
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Error in updating the blog post
   */
  async updateBlog(req: Request, res: Response) {
    const blogId = req.params.id;
    const { title, category, image, description } = req.body;
    try {
      const blog = await blogPost.findById(blogId);
      if (!blog) {
        return res.status(404).json({
          message: "blog not found",
        });
      }
      if (title) {
        blog.title = title;
      }
      if (category) {
        blog.category = category;
      }
      if (image) {
        blog.image = image;
      }
      if (description) {
        blog.description = description;
      }

      await blog.save();
      res.status(200).json(blog);
    } catch (error: any) {
      res.status(500).json(error.message);
    }
  }

  //deleteblog
  /**
   * @swagger
   * /api/blog/posts/removeblog/{id}:
   *   delete:
   *     summary: Delete the blog post by ID
   *     tags: [Blogs]
   *     description: Delete blog post using its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the blog post to delete
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Blog post successfully deleted
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Blog Post is successfully deleted
   *       404:
   *         description: Blog post not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Blog post not found
   *       500:
   *         description: Error in deleting the blog post
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Error in deleting the blog post
   */
  async deleteBlog(req: Request, res: Response) {
    try {
      const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
      if (!deletedPost) {
        return res.status(404).json({ error: "Blog post not foundd" });
      }
      res.json({ message: "Blog Post is successfully Deleted" });
    } catch (error) {
      res.status(500).json({ error: "Error in deleting the this blog post" });
    }
  }
}
export default BlogController;
