import mongoose from 'mongoose';
import Post from '../models/Post.js';
import moment from 'moment';


export const createReaction = async (req, res) => {
    try {
        // Assuming you have a middleware to authenticate users and attach user information to req.user
        const authenticatedUser = req.user;

        const postId = req.params.id;
        const type = req.body.type;
        var formattedTimeLeft = "";
        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.status !== 'Live') {
            return res.status(400).json({ success: false, message: 'Cannot interact with an expired post' });
        } else {
            const currentTime = new Date();

            formattedTimeLeft = moment.utc(moment.duration(post.expirationTime - currentTime).asMilliseconds()).format("HH:mm:ss", { trim: false });

            console.log("Time Left for Post: ", formattedTimeLeft);
        }
        // Check if the user has already reacted to the post
        const existingReactionIndex = post.reactions.findIndex(
            (reaction) => reaction.author.toString() === authenticatedUser.id
        );

        if (existingReactionIndex !== -1) {
            // If the user has a previous reaction
            const existingType = post.reactions[existingReactionIndex].type;

            // Check if the new reaction type is the same as the existing one
            if (existingType === type) {
                // Remove the existing reaction
                post.reactions.splice(existingReactionIndex, 1);

                // Decrement the count based on the removed reaction type
                if (type === 'like') {
                    post.likeCount -= 1;
                } else if (type === 'dislike') {
                    post.dislikeCount -= 1;
                }

                await post.save();

                res.status(200).json({
                    success: true,
                    message: 'Reaction removed successfully',
                });
            } else {
                // Update the existing reaction with the new type
                post.reactions[existingReactionIndex].type = type;

                await post.save();

                res.status(200).json({
                    success: true,
                    message: 'Reaction updated successfully',
                });
            }
        } else {
            // If the user has not reacted before, create a new reaction
            post.reactions.push({
                author: authenticatedUser.id,
                type: type,
                timeleft: formattedTimeLeft,
                timestamp: new Date(),
            });

            // Increment the count based on the new reaction type
            if (type === 'like') {
                post.likeCount += 1;
            } else if (type === 'dislike') {
                post.dislikeCount += 1;
            }

            await post.save();

            res.status(200).json({
                success: true,
                message: 'Reaction added successfully',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const listReactions = async (req, res) => {
    try {
        const postId = req.params.id;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Extract the reactions for the post
        const reactions = post.reactions.map((reaction) => ({
            author: reaction.author,
            type: reaction.type,
            timeleft: reaction.timeleft,
            timestamp: reaction.timestamp,
        }));

        res.status(200).json({ success: true, reactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};