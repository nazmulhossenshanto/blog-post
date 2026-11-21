import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { userService } from "./user.service"
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'

const registerUser = catchAsync(async(req: Request, res: Response)=>{
    const result = await userService.registerUserIntoDB(req.body);

    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully!",
        data: result
    })
})


export const userController = {
    registerUser
}


