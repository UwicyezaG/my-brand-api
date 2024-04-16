
import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import { Response } from 'express';

dotenv.config();
          
cloudinary.config({ 
  cloud_name: 'dbg50vv1a', 
  api_key: '836656291751335', 
  api_secret: 'oJtfpilk3pmac3asoMk-35aB3dE' 
});
const uploadFile = async (file: Express.Multer.File, res: Response) => {
    try {
        const response = await cloudinary.uploader.upload(file.path);
        return response.secure_url;
    } catch (err) {
        throw new Error('Error uploading file to Cloudinary');
    }
}

export default uploadFile;