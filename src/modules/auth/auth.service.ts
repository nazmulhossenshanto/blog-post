import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface"
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { SignOptions } from "jsonwebtoken";


const loginUserIntoDB = async(payload: ILoginUser)=>{
    const {email, password} = payload;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(!user){
        throw new Error("User not found!")
    }

    if(user.activeStatus === "BLOCKED"){
        throw new Error("User is blocked . Please contact to the support.")
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
        throw new Error("Invalid credentials!")
    }

    const payLoad = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const accessToken =  jwtUtils.createToken(payLoad, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions)
    const refreshToken = jwtUtils.createToken(payload, config.jwt_refresh_secret, config.jwt_refresh_expires_in as SignOptions);
    return {
        accessToken, refreshToken
    }

}

export const authService = {
    loginUserIntoDB
}