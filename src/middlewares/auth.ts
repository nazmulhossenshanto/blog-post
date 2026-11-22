import { NextFunction, Request, Response } from "express";
import { Role } from "../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";


declare global {
    namespace Express {
        interface Request {
            user? : {
                id: string;
                email: string; 
                role: Role;
            }
        }
    }
}


export const auth = (...requiredRoles : Role[])=>{
    return catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
       
        const token = req.cookies.accessToken || (req.headers.authorization?.startsWith("Bearer")? req.headers.authorization.split("")[1] : req.headers.authorization);

        if(!token){
            throw new Error("You are not logged in. Please login to access this resource.")
        };
        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
        if(verifiedToken.success === false){
            throw new Error(verifiedToken.error)
        }
        const {id, email, role} = verifiedToken.data as JwtPayload;
        if(requiredRoles.length && !requiredRoles.includes(role)){
            throw new Error("Forbidden! You do not have permision to access this resource.")
        };

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id,
                email
            },
            omit: {password: true}
        });

        if(user.activeStatus === "BLOCKED"){
            throw new Error("User is blocked! Please contact to the support.")
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        next()
    })
}