import blogPost, {IBlogPost}  from "models/blogPost";

// create new blog
export async function createblogPost (data: IBlogPost): Promise<IBlogPost>{
    try{
        const newPost = new blogPost(data);
        return await newPost.save();
    }catch (error){
        throw new Error('Error in creating blog post');
    }
};
