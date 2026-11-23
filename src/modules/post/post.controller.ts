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



export const postController = {
    createPost
}