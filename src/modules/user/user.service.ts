import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./user.interface";
 import bcrypt from 'bcryptjs'

const registerUserIntoDB = async(payload:IRegisterUser)=>{
    const {name, email, password, profilePhoto, bio} = payload;
    // check the user is exist
    const isUserExists = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if(isUserExists){
        throw new Error("User already exists. Please login...")
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await prisma.user.create({
        data: {
            name, 
            email, 
            password: hashedPassword,
            profile: {
                create: {
                    profilePhoto,
                    bio
                }
            }
        }
    });

    const createdUsers = await prisma.user.findUnique({
        where: {
            id: user.id,
            email : user.email || email
        },
        omit: {
            password: true
        }
        
    })

    return createdUsers;
};

const getMyProfileDB = async(userId : string)=>{
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })
    return user;
}



export const userService = {
    registerUserIntoDB,
    getMyProfileDB
}