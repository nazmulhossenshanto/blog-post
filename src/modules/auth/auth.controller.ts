import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'

const loginUser = catchAsync(async(req: Request, res: Response)=>{
    const {accessToken, refreshToken} = await authService.loginUserIntoDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully!",
        data: {accessToken, refreshToken}
    })

});

export const authController = {
     loginUser
}