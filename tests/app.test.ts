import request from "supertest";
import mongoose from "mongoose";
import server from "../src/app";
import BlogPost from "../src/models/blogPost"

const blogId = new mongoose.Types.ObjectId();

describe("blogsController", () => {
    beforeAll(async() => {
        await BlogPost.create({ 
            _id: blogId, 
            title: "test blog title",
            category : "test cat",
            image: "img",
            description: "learn more"
        });
    })
    afterAll(async() =>{
        await BlogPost. deleteMany();
    });

    describe("GET /api/blogs", () => {
        it("should return all blogs", async () => {
          const res = await request(server).get("/api/blog/posts");
          expect(res.statusCode).toBe(200);
          expect(res.body).toBeInstanceOf(Array);
        });
      });
})