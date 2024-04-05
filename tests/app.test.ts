import request from "supertest";
import mongoose from "mongoose";
import server from "../src/app";
import BlogPost from "../src/models/blogPost";
import UserAc from "../src/models/userAc";
import Comment from "../src/models/comment";
import bcrypt from "bcrypt";
import userAc from "../src/models/userAc";
import comment from "../src/models/comment";

const blogId = new mongoose.Types.ObjectId();
const userId = new mongoose.Types.ObjectId();
const commentId = new mongoose.Types.ObjectId();


describe("blogsController", () => {
  beforeAll(async () => {
    await BlogPost.create({
      _id: blogId,
      title: "test blog title",
      category: "test cat",
      image: "img",
      description: "learn more",
    });
    await userAc.create({
      _id: userId,
      username: "username1",
      email: "useremail@gmail.com",
      password: "userpassword",
    });
 
  });
  afterAll(async () => {
    await BlogPost.deleteMany();
    await userAc.deleteMany();
  });
  //allblog test
  describe("GET /api/blogs/allblog", () => {
    it("should return all blogs", async () => {
      const res = await request(server).get("/api/blog/posts/allblog");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  //creation test
  describe("POST /api/blogs/posts/create", () => {
    it("should create a new blog post", async () => {
      const newBlog = {
        title: "New Blog",
        category: "New Category",
        image: "new-img.jpg",
        description: "New description",
      };
      const res = await request(server).post("/api/posts/create").send(newBlog);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.title).toBe(newBlog.title);
      expect(res.body.category).toBe(newBlog.category);
      expect(res.body.image).toBe(newBlog.image);
      expect(res.body.description).toBe(newBlog.description);
    });

    it("should handle invalid inputs", async () => {
      const invalidBlog = {
        // Missing required fields
        category: "New Category",
        image: "new-img.jpg",
        description: "New description",
      };

      const res = await request(server)
        .post("/api/posts/create")
        .send(invalidBlog);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Invalid inputs" });
    });

    it("should handle duplicate blog titles", async () => {
      const existingBlog = {
        title: "test blog title",
        category: "Existing Category",
        image: "existing-img.jpg",
        description: "Existing description",
      };
      const res = await request(server)
        .post("/api/posts/create")
        .send(existingBlog);
      expect(res.statusCode).toBe(409);
      expect(res.body).toEqual({
        message: "The blog with this title already exist",
      });
    });
  });

  //updation test
  describe("Put /api/blog/posts/updateblog/:id", () => {
    it("should update a specific blog post", async () => {
      const updatedData = {
        title: "Updated Title",
        category: "Updated Category",
        image: "updated-img.jpg",
        description: "Updated description",
      };
      const res = await request(server)
        .put(`/api/blog/posts/updateblog/${blogId}`)
        .send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(updatedData);
    });

    it("should return 404 if blog post not found", async () => {
      const nonExistingId = new mongoose.Types.ObjectId();
      const updatedblog = {
        title: "blog1",
        category: "firstblog",
        image: "img1",
        description: "briefblog",
      };
      const res = await request(server)
        .put(`/api/blog/posts/updateblog/${nonExistingId}`)
        .send(updatedblog);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "blog not found");
    });
  });

  //delete test
  describe("DELETE /api/blog/posts/removeblog/:id", () => {
    it("should delete the specified blog post", async () => {
      const newBlog = await BlogPost.create({
        title: "Test Blog",
        category: "Test Category",
        image: "test.jpg",
        description: "This is a test blog post",
      });
      const res = await request(server).delete(
        `/api/blog/posts/removeblog/${newBlog._id}`
      );
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: "Blog Post is successfully Deleted",
      });
      const deletedBlog = await BlogPost.findById(newBlog._id);
      expect(deletedBlog).toBeNull();
    });
    it("should return 404 if blog post is not found", async () => {
      const nonExistingId = new mongoose.Types.ObjectId();
      const res = await request(server).delete(
        `/api/blog/posts/removeblog/${nonExistingId}`
      );
      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchObject({ error: "Blog post not foundd" });
    });
  });
});

describe("POST /api/user/register", () => {
  it("should create a new user account", async () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "testpassword",
    };

    const res = await request(server).post("/api/user/register").send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("username", newUser.username);
    expect(res.body).toHaveProperty("email", newUser.email);
  });

  it("should handle invalid inputs", async () => {
    const invalidUser = {
      email: "test@example.com",
      password: "testpassword",
    };

    const res = await request(server)
      .post("/api/user/register")
      .send(invalidUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Valid input is required" });
  });

  it("should handle existing user accounts", async () => {
    // Create a user first
    await UserAc.create({
      username: "existinguser",
      email: "existing@example.com",
      password: await bcrypt.hash("existingpassword", 10),
    });

    const existingUser = {
      username: "existinguser",
      email: "existing@example.com",
      password: "existingpassword",
    };

    const res = await request(server)
      .post("/api/user/register")
      .send(existingUser);

    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({
      message: "This user account already exists",
    });
  });

  //retrieve
  describe("GET /api/user/allAc", () => {
    it("should retrieve all user accounts successfully", async () => {
      const res = await request(server).get("/api/user/allAc");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it("should return 500 if an error occurs while retrieving users", async () => {
      jest.spyOn(UserAc, "find").mockImplementationOnce(() => {
        throw new Error("Mock Error");
      });

      const res = await request(server).get("/api/user/allAc");

      expect(res.statusCode).toBe(500);

      expect(res.body).toEqual({ error: "Error retrieving users" });
    });
  });

  //describe 
  describe("PUT /api/user/updateAc/:id", () => {
    it("should update user account credentials", async () => {
      const updatedData = {
        username: "UpdatedUsername",
        email: "updatedemail@example.com",
        password: "updatedPassword",
      };
      const res = await request(server)
        .put(`/api/user/updateAc/${userId}`)
        .send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: "User account credentials updated successfully",
      });
    });

    it("should return 404 if user account not found", async () => {
      const nonExistingId = new mongoose.Types.ObjectId();
      const updatedData = {
        username: "UpdatedUsername",
        email: "updatedemail@example.com",
        password: "updatedPassword",
      };
      const res = await request(server)
        .put(`/api/user/updateAc/${nonExistingId}`)
        .send(updatedData);
      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchObject({ message: "User account not found" });
    });

    it("should return 400 if invalid inputs are provided", async () => {
      const invalidData = {
        username: "",
        email: "invalidemail",
        password: "",
      };
      const res = await request(server)
        .put(`/api/user/updateAc/${userId}`)
        .send(invalidData);
      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({ message: "Valid inputs are required" });
    });
  });

  //deleteAc
  describe("DELETE /api/user/delete/:id", () => {
    it("should delete user account", async () => {
      const newUser = await userAc.create({
        username: "testUser",
        email: "test@example.com",
        password: "testPassword",
      });
      const res = await request(server).delete(
        `/api/user/delete/${newUser._id}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: "User account deleted successfully",
      });
      const deletedUser = await userAc.findById(newUser._id);
      expect(deletedUser);
    });

    it("should handle user account not found", async () => {
      const nonExistingUserId = new mongoose.Types.ObjectId();

      const res = await request(server).delete(
        `/api/user/delete/${nonExistingUserId}`
      );

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "User account not found" });
    });
  });
});
