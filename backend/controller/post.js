import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Reaction from '../models/Reaction.js';
import Comment from '../models/Comment.js';


export const createPost = async (req, res) => {
    const authenticatedUser = req.user;

    try {
        // const { title, topics, body, expirationTime } = req.body;

        // Create a new post with status set to "Live"
        const newPost = new Post({
            title: req.body.title,
            topics: req.body.topics,
            body: req.body.body,
            expirationTime: req.body.expirationTime,
            owner: authenticatedUser.id,
            status: 'Live', // Set the status as "Live"
        });

        await newPost.save();


        if (newPost.expirationTime) {
            const currentTime = new Date();
            const timeUntilExpiration = newPost.expirationTime - currentTime;

            setTimeout(async () => {
                // Update the post status to "Expired" after the defined expirationTime
                await Post.findByIdAndUpdate(newPost._id, { status: 'Expired' });

                console.log(`The post (ID: ${newPost._id}) status changed to expired`);
            }, timeUntilExpiration);
        }

        res.status(201).json({ success: true, message: 'Post created successfully', newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};




export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id; // Assuming you are getting the post ID from the request parameters
        const authenticatedUser = req.user; // Assuming you have a middleware to attach user information to req.user

        // Check if the post exists
        const existingPost = await Post.findById(postId);

        if (!existingPost) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if the authenticated user is the owner of the post
        if (authenticatedUser.id !== existingPost.owner.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized - You are not the owner of this post' });
        }

        // Create an object to store the updated values
        const updatedValues = {};

        // Check if new values are provided in the request body, if yes, update the respective fields
        if (req.body.title !== null && req.body.title !== undefined) {
            updatedValues.title = req.body.title;
        }

        if (req.body.topics !== null && req.body.topics !== undefined) {
            updatedValues.topics = req.body.topics;
        }

        if (req.body.body !== null && req.body.body !== undefined) {
            updatedValues.body = req.body.body;
        }

        if (req.body.expirationTime !== null && req.body.expirationTime !== undefined) {
            updatedValues.expirationTime = req.body.expirationTime;
        }

        // Update the post with the new values
        existingPost.set(updatedValues);

        // Save the updated post
        await existingPost.save();

        // if (updatedValues.expirationTime) {
        //     const currentTime = Date.now();
        //     const timeUntilExpiration = updatedValues.expirationTime - currentTime;

        //     setTimeout(async () => {
        //         // Update the post status to "Expired" after the defined expirationTime
        //         await Post.findByIdAndUpdate(postId, { status: 'Expired' });
        //     }, timeUntilExpiration);
        // }

        res.status(200).json({ success: true, message: 'Post updated successfully', updatedValues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const deletePost = async (req, res) => {
    try {

        const authenticatedUser = req.user;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (authenticatedUser.id !== post.owner.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized - You do not have permission to delete this post' });
        }

        if (post.comments.length > 0) {
            await Comment.deleteMany({ _id: { $in: post.comments } });
        }

        if (post.likes.length > 0 || post.dislikes.length > 0) {
            await Reaction.deleteMany({ _id: { $in: post.likes.concat(post.dislikes) } });
        }

        await post.deleteOne();

        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log("postID", postId);
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    const allowedTopics = ['Politics', 'Health', 'Sport', 'Tech'];
    try {
        // Extract the selected topic from request query parameters
        const topic = req.query.topic;

        // Validate that the topic is provided
        if (!topic || !allowedTopics.includes(topic)) {
            return res.status(400).json({ success: false, message: 'Invalid or missing topic' });
        }

        // Find all posts related to the selected topic
        const posts = await Post.find({ topics: topic });

        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getAllPostsByTopic = async (req, res) => {
    try {
        const selectedTopic = req.params.topic; // Assuming you are getting the topic from the request parameters

        // Validate if the selected topic is one of the allowed topics
        const allowedTopics = ['Politics', 'Health', 'Sport', 'Tech'];
        if (!allowedTopics.includes(selectedTopic)) {
            return res.status(400).json({ success: false, message: 'Invalid topic' });
        }

        // Retrieve all posts with the selected topic
        const posts = await Post.find({ topics: selectedTopic, status: 'Live' })
            .populate('owner', 'username') // Populate the 'owner' field with the 'username' attribute from the User model
            .populate('likes dislikes comments'); // Populate other referenced fields as needed

        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

