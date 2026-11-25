import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../generated/prisma/enums";
import { commentController } from "./comment.controller";


const router = Router();

// public api 
router.get('/author/:authorId', commentController.getCommentByAuthorId)
router.get("/:commentId", commentController.getCommentById);


// protected api
router.post('/', auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.createComment);
router.patch('/:commentId', auth(Role.USER), commentController.updateComment)




export const commentRoutes = router;