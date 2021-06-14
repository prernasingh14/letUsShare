import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';
import router from '../routes/posts.js';


//get all posts 
export const getPosts = async (req, res) => {
    const { page } = req.query; //console.log(page);
    try {
        const LIMIT = 4;
        const startIndex = (Number(page) - 1) * LIMIT;//get the starting index of posts at every page
        const total = await PostMessage.countDocuments({});//to know how many posts in total we have 
        const posts = await PostMessage.find().sort({ _id: - 1 }).limit(LIMIT).skip(startIndex);//give us the newest posts first and then limit them 
        //console.log(postMessages);
        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: "No posts to show" });

    }
}

//get a single post 

export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: "No post to show" });
    }
}
//to get posts by search 

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, "i");
        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
        res.json({ data: posts });

    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

//create post 
export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

//to upadate post by id 

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

//delete posts by ID

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send('No post with that id');

    await PostMessage.findByIdAndRemove(id);
    console.log("DELETE!!!!");
    res.json({ message: 'Post deleted successfully' });

}

//like post by id 
export const likePost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId)
        return res.json({ message: 'Unauthorized action' });
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send('No post with that id');
    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {//user hasn't liked the post yet
        //he can like
        post.likes.push(req.userId);
    } else {//liked already thus now can only dislike
        post.likes = post.likes.filter((id) => id !== String(req.userId));

    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    console.log('LIKING')
    res.json(updatedPost);

}

