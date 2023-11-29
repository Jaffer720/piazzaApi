import mongoose from 'mongoose';
import Post from '../models/Post.js';
import moment from 'moment';

export const createComment = async (req, res) => {
    try {
        // Assuming you have a middleware to authenticate users and attach user information to req.user
        const authenticatedUser = req.user;
        const postId = req.params.id;
        const body = req.body.body;
        var formattedTimeLeft = "";

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if the post is live
        if (post.status !== 'Live') {
            return res.status(400).json({ success: false, message: 'Cannot comment on an expired post' });
        } else {
            const currentTime = new Date();

            formattedTimeLeft = moment.utc(moment.duration(post.expirationTime - currentTime).asMilliseconds()).format("HH:mm:ss", { trim: false });

            console.log("Time Left for Post: ", formattedTimeLeft);
        }

        // Check if the user is the owner of the post
        if (post.owner.toString() === authenticatedUser.id) {
            return res.status(400).json({ success: false, message: 'Cannot comment on your own post' });
        }


        // Create a new comment
        const newComment = {
            author: authenticatedUser.id,
            body,
            timeleft: formattedTimeLeft,
            timestamp: new Date(),
        };

        // Add the new comment to the post's comments array
        post.comments.push(newComment);

        post.commentCount += 1;

        // Save the updated post
        await post.save();

        res.status(201).json({ success: true, message: 'Comment added successfully', comment: post.comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const authenticatedUser = req.user;
        const postId = req.params.id;
        const commentId = req.params.commentId;
        console.log(commentId)
        const updatedBody = req.body.body;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if the post is live
        if (post.status !== 'Live') {
            return res.status(400).json({ success: false, message: 'Cannot update a comment on an expired post' });
        }

        // Check if the user is the owner of the post
        if (post.owner.toString() === authenticatedUser.id) {
            return res.status(400).json({ success: false, message: 'Cannot update a comment on your own post' });
        }

        // Find the comment in the post's comments array
        const commentToUpdate = post.comments.find(comment => comment._id.toString() === commentId);
        if (!commentToUpdate) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Check if the authenticated user is the author of the comment
        if (commentToUpdate.author.toString() !== authenticatedUser.id) {
            return res.status(400).json({ success: false, message: 'You are not the author of this comment' });
        }

        // Update the comment body
        commentToUpdate.body = updatedBody;

        // Save the updated post
        await post.save();

        res.status(200).json({ success: true, message: 'Comment updated successfully', updatedComment: commentToUpdate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        // Assuming you have a middleware to authenticate users and attach user information to req.user
        const authenticatedUser = req.user;
        const postId = req.params.id;
        const commentId = req.params.commentId;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if the comment exists in the post
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Check if the authenticated user is the author of the comment
        if (post.comments[commentIndex].author.toString() !== authenticatedUser.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
        }

        // Remove the comment from the post's comments array
        post.comments.splice(commentIndex, 1);

        post.commentCount -= 1;

        // Save the updated post
        await post.save();

        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const listAllComments = async (req, res) => {
    try {
        const postId = req.params.id;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Retrieve all comments for the post
        const comments = post.comments;

        res.status(200).json({ success: true, comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};