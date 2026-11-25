export interface ICreateCommentPayload{
    content: string,
    postId: string, 
}
export interface IUpdateCommentPayload{
    content?: string,
}
export interface IModerateComment{
    status: "APPROVED" | "REJECTED"
}