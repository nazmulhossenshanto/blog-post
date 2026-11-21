import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: config.backend_url,
  credentials: true
}));

app.get("/", (req: Request, res: Response) => {
  res.send("Shanto vai your blog post application is running...!");
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

export default app;
