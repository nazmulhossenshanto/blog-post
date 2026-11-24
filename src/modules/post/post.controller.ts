import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';

const createPost = catchAsync(async(req: Request, res: Response)=>{

    const userId = req.user?.id as string;
    const payload = req.body;
    const result = await postService.createPostIntoDB(userId, payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Post created successfully!",
        data: result
    })

});



// const getAllPosts = catchAsync(async(req: Request, res: Response)=>{});
const getAllPosts = catchAsync(async (req: Request, res: Response) => {
    const result = await postService.getAllPosts();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrived all posts",
      data: result,
    });

});

const updatePost = catchAsync(async (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const authorId = req.user?.id as string;
    const payload = req.body;
    const isAdmin = req.user?.role === "ADMIN";
    const result = await postService.updatePost(postId, payload, authorId, isAdmin);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Post updated successfull!",
        data: result
    })
});


const getMyPosts = catchAsync(async(req: Request, res: Response)=>{
    const userId = req.user?.id as string;
    const result = await postService.getMyPosts(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrived My all posts",
      data: result,
    });
});

const getPostByPostId = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.postId;
  if (!id) {
    throw new Error("PostId Required!");
  }
  const result = await postService.getPostByPostId(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retrived post by postId",
    data: result,
  });
});


export const postController = {
    createPost,
    getAllPosts,
    updatePost,
    getMyPosts,
    getPostByPostId,
}