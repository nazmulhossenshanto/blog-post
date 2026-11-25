import { CommentStatus, PostStatus, Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPostIntoDB = async (
  userId: string,
  payload: ICreatePostPayload,
) => {
  const post = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return post;
};

const getAllPosts = async () => {
  const allPosts = await prisma.post.findMany({
    include: {
      author: {
        omit: { password: true },
      },
      comments: true,
    },
  });
  return allPosts;
};

const getMyPosts = async (userId: string) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        omit: { password: true },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return posts;
};

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  userId: string,
  isAdmin: boolean,
) => {
   await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: { password: true },
      },
      comments: true,
    },
  });

  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    },
    include: {
      author: {
        omit: { 
          password: true
        }
      },
      comments: {
        where : {
          status: CommentStatus.APPROVED
        },
        orderBy: {
          createdAt: "desc"
        }, 
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
  })

  return post;
};

const getPostByPostId = async (postId: string) => {
  
 const transactionResult = await prisma.$transaction(
  async (tx)=>{
    await tx.post.update({
      where: {
        id: postId
      },
      data: {
        views: {
          increment: 1
        }
      }
    });

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      }, 
      include: {
        author: {
          omit: { password: true },
          
        },
        
         comments: {
          where: {
            status: CommentStatus.APPROVED
          },
          orderBy: {
            createdAt: "desc"
          }
          
         },
         _count: {
          select: {
            comments: true
          }
         }
      },
    });

    return post;
  }
 );

 return transactionResult;

};


const deletePost = async (postId:string, userId:string, isAdmin : boolean)=>{

  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    }
  });

  if (!isAdmin && post.authorId !== userId) {
    throw new Error("Only Admin or Post Woner can update a post!");
  }

  const deletedPost = await prisma.post.delete({
    where: {
      id: postId
    }
  });

  return deletedPost;

};

const getPostStats = async()=>{
  const transactionResult = await prisma.$transaction(
    async (tx)=>{
  
    const [
      totalPost,
      totalPublishedPosts,
      totalDraftPosts,
      totalComments,
      approvedComments,
      totalUsers,
      totalAdmin,
      totalPostViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.user.count(),
      await tx.user.count({
        where: {
          role: Role.ADMIN,
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]); 
return {
  totalPost,
  totalPublishedPosts,
  totalDraftPosts,
  totalComments,
  approvedComments,
  totalUsers,
  totalAdmin,
  totalPostViews : totalPostViews._sum.views,
};

    }, {
      maxWait: 10000, 
      timeout: 20000
    }
  );

  return transactionResult;
}

export const postService = {
  createPostIntoDB,
  getMyPosts,
  updatePost,
  getPostByPostId,
  getAllPosts,
  deletePost,
  getPostStats
};
