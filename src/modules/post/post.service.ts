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

};

const getPostByPostId = async (postId: string)=>{
  const post = await prisma.post.findUnique({
    where: {
      id: postId
    }
  });
  return post;
};

const getAllPosts = async()=>{
   const allPosts = await prisma.post.findMany();
   return allPosts;
};

const getMyPosts = async(userId: string)=>{
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId
    }
  })
  return posts;
}


export const postService = {
    createPostIntoDB,
    getPostByPostId,
    getAllPosts,
    getMyPosts
}