import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPostIntoDB = async( userId: string, payload: ICreatePostPayload)=>{

    const post = await prisma.post.create({
      data: {
        ...payload,
        authorId: userId
      },
    });


    return post;

}


export const postService = {
    createPostIntoDB
}