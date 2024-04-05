import express, { Application, Request, Response } from "express";
import { Server } from "http";
import connectDb from "./database/db";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middlewares/midwerror";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./api-docs/swagger";


import blogRoutes from "./route/blogRoutes";
import userRoutes from "./route/userRoutes";
import commentRoutes from "./route/commentRoutes";

import router from "./route/blogRoutes";
import connectDB from "./database/db";


dotenv.config();

connectDb();
const app: Application = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/blog", blogRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comment", commentRoutes);
app.use(errorHandler);
app.use("/api", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server: Server = app.listen(port, () => {
  connectDB(), console.log(`server is running on port ${port}`);
});
export default server;
