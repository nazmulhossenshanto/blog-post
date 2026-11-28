import { PostStatus } from "../../generated/prisma/enums"; 
import { PostWhereInput } from "../../generated/prisma/models";

 export interface ICreatePostPayload {
    title: string;
    content: string;
    thumbnail?: string | null;
    isFeatured?: boolean;
    status?: PostStatus;
    authorId: string;
    tags: string[];
}
 export interface IUpdatePostPayload {
    title?: string;
    content?: string;
    thumbnail?: string | null;
    isFeatured?: boolean;
    status?: PostStatus;
    tags?: string[];
}

export interface IPostQuery extends PostWhereInput {
  // title?: string;
  // content?: string;
  // thumbnail?: string | null;
  // isFeatured?: boolean;
  // status?: PostStatus;
  // tags?: string[];
  // authorId?: string;

  searchTerm?:string;
  page?: string;
  limit?:string;
  sortOrder?:string;
  sortBy?:string;
}