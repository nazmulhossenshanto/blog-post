import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'

const loginUser = catchAsync(async(req: Request, res: Response)=>{
    const {accessToken, refreshToken} = await authService.loginUserIntoDB(req.body);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 1000 // 1 day
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 1000 * 7 // 1 day
    })


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully!",
        data: {accessToken, refreshToken}
    })

});

const refreshToken = catchAsync(async(req: Request, res: Response)=>{
    const refreshToken = req.cookies.refreshToken;  
    const {accessToken} = await authService.refreshToken(refreshToken);

     res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 1000 // 1 day
    })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Token refreshed successfully!",
        data: {accessToken}
    })
})

export const authController = {
     loginUser,
     refreshToken
}