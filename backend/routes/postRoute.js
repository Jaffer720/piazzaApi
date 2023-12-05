import express from "express";
import verifyUser from '../utils/verifyUser.js';
import {
    createPost,
    updatePost,
    deletePost,
    getPostById,
    getAllPosts
} from "../controller/post.js";
import {
    createReaction,
    listReactions
} from "../controller/reaction.js";
import {
    createComment,
    deleteComment,
    listAllComments,
    updateComment
} from "../controller/comment.js";
import { createPostValidation } from "../utils/validator.js";

const router = express.Router();

router.post('/', createPostValidation, verifyUser, createPost);
router.put('/:id', verifyUser, updatePost);
router.delete('/:id', verifyUser, deletePost);
router.get('/:id', verifyUser, getPostById);
router.get('/', verifyUser, getAllPosts);

// Interactions
// Reaction
router.post('/:id', verifyUser, createReaction);
router.get('/list/:id', verifyUser, listReactions);

//Comment
router.post('/comment/:id', verifyUser, createComment);
router.put('/comment/:id/:commentId', verifyUser, updateComment);
router.delete('/comment/:id/:commentId', verifyUser, deleteComment);
router.get('/comment/:id', verifyUser, listAllComments);




export default router