import { CommentStatus, PostStatus, Role } from "../../generated/prisma/enums";
import { PostWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./post.interface";

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

const getAllPosts = async (query: IPostQuery) => {
   

  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const tags = query.tags ? JSON.parse(query.tags as string) : null;
  const tagsArray = Array.isArray(tags) ? tags : [];
  
  const andConditions : PostWhereInput[] = [];
  


  if(query.searchTerm){
    andConditions.push({
      OR: [
         {
          title: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
         },
         {
          content: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
         }
      ]
    })
  };

  if(query.title){
    andConditions.push({
      title : query.title
    })
  }

  if(query.content){
    andConditions.push({
      content: query.content
    })
  };

  if(query.thumbnail){
    andConditions.push({
      thumbnail: query.thumbnail
    })
  }

  if(query.authorId){
    andConditions.push({
      authorId: query.authorId
    })
  }

  if(query.isFeatured){
    andConditions.push({
      isFeatured: Boolean(query.isFeatured)
    })
  };
  if(query.tags){
    andConditions.push({
      tags: {
        hasSome: tagsArray
      }
    })
  }

  if(query.status){
    andConditions.push({
      status: query.status
    })
  }
  




  
  const allPosts = await prisma.post.findMany({
    where: {
      AND: andConditions
    }
    ,
    take: limit,
    skip : skip,
    orderBy: {
      [sortBy] : sortOrder
    },
    include: {
      author: {
        omit: {
          password: true,
        },
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
