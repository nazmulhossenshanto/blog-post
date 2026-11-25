

import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { commentService } from './comment.service';
import { sendResponse } from '../../utils/sendResponse';

const createComment = catchAsync(async(req: Request, res: Response)=>{

    const result = await commentService.createComment(req.body, req.user!.id);
     sendResponse(res, {
       success: true,
       statusCode: httpStatus.CREATED,
       message: "Comment created successfully",
       data: result,
     });

});

const getCommentById = catchAsync(async (req: Request, res: Response) => { 
    const commentId = req.params.commentId;
    if(!commentId){
        throw new Error("CommentId require in params")
    }
    const result = await commentService.getCommentById(commentId as string)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment Retrived by CommentId successfully!",
    data: result,
  });
});


export const commentController = {
  createComment,
  getCommentById,
};