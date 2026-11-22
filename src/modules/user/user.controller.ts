import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

// const getMyProfile = catchAsync(async (req: Request, res: Response) => {});

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.registerUserIntoDB(req.body);

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    console.log('from user controller user id :: ', userId)
    const result = await userService.getMyProfileDB(userId as string);
     return sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "My profile retrived successfully!",
    data: result,
  });
});

 const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const userId = req.user?.id as string;
  const updatedProfile = await userService.updateUserProfileIntoDB(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully!",
    data: {updatedProfile}
  })
 });


export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile
};
