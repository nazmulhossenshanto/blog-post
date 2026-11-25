import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload } from "./comment.interface";

const createComment = async(payload: ICreateCommentPayload, userId: string)=>{

    const post = await prisma.post.findUnique({
        where: {
            id: payload.postId
        }
    });

    if(!post){
        throw new Error("Post not found!")
    }

    const comment = await prisma.comment.create({

        data: {
             content: payload.content,
             postId: payload.postId,
             authorId: userId
            
        },
        include: {
            post: {
                select:{
                    id: true,
                    title: true
                }
            },
            author: {
                select: {
                    id:true,
                    name: true,
                    email: true
                }
            }
        }
        
    });

    return comment;

};

const getCommentById = async(commentId: string)=>{
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id:true,
                    title: true,
                    thumbnail: true,
                    status: true
                }
            },
            author: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
    if(!comment){
        throw new Error("Comment not found!")
    }
    return comment
};

const getCommentByAuthorId = async (authorId: string)=>{
    const comments = await prisma.comment.findMany({
        where: {
            authorId: authorId
        },
        include:{
            post: {
                select: {
                    id: true,
                    title: true,
                    thumbnail: true,
                    status: true
                }
            },
            author: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return comments;
}



export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
};