import { CommentStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload, IModerateComment, IUpdateCommentPayload } from "./comment.interface";

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
                    name: true,
                    _count: {
                        select: {
                            comments: true
                        }
                    }
                },
                
            },
            
        
        },
        orderBy: {
            createdAt: "desc"
        },
        
        
    });
    return comments;
};

const updateComment = async(payload: IUpdateCommentPayload, commentId:string, authorId: string)=>{
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    });

    if(!comment){
        throw new Error("Comment not found")
    };
    if(comment.authorId !== authorId){
        throw new Error("You don't have permision to update this comment!")
    };
    const updatedComment = await prisma.comment.update({
        where: {
            id: comment.id
        },
        data: {
            content: payload.content
        },
        include: {
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
        }
    });

    return updatedComment;
};

const deleteComment = async(commentId: string, authorId:string)=>{
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    });
    if(!comment){
        throw new Error("Comment not found!")
    };
    if(comment.authorId !== authorId){
        throw new Error("You don't have permision to delete this post!")
    };
    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return deletedComment;
}

const moderateComment = async(commentId: string, payload: IModerateComment)=>{
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    });
    if(!comment){
        throw new Error("Comment not found!")
    };
    const updatedComment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            status: payload.status as CommentStatus
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
                    name: true
                }
            }
        }
    });

    return updatedComment;
}



export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  updateComment,
  deleteComment,
  moderateComment
};