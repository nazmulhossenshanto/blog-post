import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface"
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { JwtPayload, SignOptions } from "jsonwebtoken";


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

    const jwtPayLoad = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const accessToken =  jwtUtils.createToken(jwtPayLoad, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions)
    const refreshToken = jwtUtils.createToken(jwtPayLoad, config.jwt_refresh_secret, config.jwt_refresh_expires_in as SignOptions);
    return {
        accessToken, refreshToken
    }

};

const refreshToken = async(refreshToken: string)=>{
    const verifiedToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);
     

    if(!verifiedToken.success){
        throw new Error(verifiedToken.error)
    };
     
    const {id} = verifiedToken.data as JwtPayload; 
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });
    if(user.activeStatus === "BLOCKED"){
        throw new Error("User is blocked . Please contact to the support.")
    }

    const payload = {
         
        name: user.name,
        email: user.email,
        role: user.role
    }
    const accessToken =  jwtUtils.createToken(payload, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions);
    return {accessToken};
}



export const authService = {
    loginUserIntoDB,
    refreshToken
}