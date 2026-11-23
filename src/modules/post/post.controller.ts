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

const getPostByPostId = catchAsync(async(req: Request, res: Response)=>{
    const id = req.params.postId;
    const result = await postService.getPostByPostId(id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Retrived post by postId", 
        data: result
    })

})



export const postController = {
    createPost,
    getPostByPostId
}