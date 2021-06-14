import { FETCH_ALL, FETCH_POST, CREATE, UPDATE, DELETE, LIKE, FETCH_BY_SEARCH, START_LOADING, END_LOADING } from '../constants/actionTypes';
import * as api from '../api/index.js';


//action creators 
//action to get all posts 
export const getPosts = (page) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPosts(page);
        console.log(data);
        dispatch({ type: FETCH_ALL, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error.message);
    }
}


//action to get a single post 
export const getPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPost(id);
        console.log(data);
        dispatch({ type: FETCH_POST, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error.message);
    }
}

//to search post by tags

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const res = await api.fetchPostsBySearch(searchQuery);
        console.log(res.data.data);
        dispatch({ type: FETCH_BY_SEARCH, payload: res.data.data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error.message);
    }

}
//action to create a post
export const createPost = (post, history) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.createPost(post);
        history.push(`/posts/${data._id}`);
        dispatch({ type: CREATE, payload: data });
    } catch (error) {
        console.log(error.message);
    }
}


//action to update a post 

export const updatePost = (id, post) => async (dispatch) => {
    try {
        const { data } = await api.updatePost(id, post);
        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        console.log(error.message);
    }
}

//action to delete a post 

export const deletePost = (id) => async (dispatch) => {
    try {
        await api.deletePost(id);
        console.log('deletion in client');
        dispatch({ type: DELETE, payload: id });
    } catch (error) {
        console.log(error.message);
    }
}

//to like a post 

export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id);
        console.log('LIKING BY CLIENT');
        dispatch({ type: LIKE, payload: data });

    } catch (error) {
        console.log(error.message);
    }
}

