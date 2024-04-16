// import mongoose from 'mongoose';
import mongoose, { Schema, Document} from 'mongoose'; 

export interface IBlogPost extends Document{
    title: string;
    category: string;
    image: String;
    description: string;
}
const blogPostSchema = new Schema({
    title: { type: String, required: true},
    category: { type: String, required: true},
    image: { type: String, required: true},
    description: { type: String, required: true},
});
const blogPost= mongoose.model<IBlogPost>('BlogPost', blogPostSchema);


export default blogPost;