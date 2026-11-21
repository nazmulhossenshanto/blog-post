import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { prisma } from "./lib/prisma";
import { userRoutes } from "./modules/user/user.routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: config.backend_url,
  credentials: true
}));

//  basic route

app.get("/", (req: Request, res: Response) => {
  res.send("Shanto vai your blog post application is running...!");
});
 
app.use('/api/users', userRoutes)

export default app;
