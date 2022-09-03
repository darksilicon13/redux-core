// postsSlice.js
import { createAsyncThunk, createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
});

const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: null,
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts');
    // console.log(response.data);
    return response.data;
})

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async initialPost => {
        // Send the initial data to the fake API server
        const response = await client.post('/fakeApi/posts', {post: initialPost});
        // The response includes the complete post object, including unique ID
        return response.data;
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                const post = action.payload;
                state.entities[post.id] = post;
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        user: userId,
                        reactions: {
                            thumbsUp: 0,
                            hooray: 0,
                            heart: 0,
                            rocket: 0,
                            eyes: 0
                        },
                    }
                }
            }
        },
        reactionAdded: (state, action) => {
            const { postId, reaction } = action.payload;
            const existingPost = state.entities[postId];
            if (existingPost) {
                existingPost.reactions[reaction]++;
            }
        },
        postUpdated: (state, action) => {
            const { id, title, content, user } = action.payload;
            const existingPost = state.entities[id];
            if (existingPost) {
                existingPost.title = title;
                existingPost.content = content;
                existingPost.user = user;
            }
        },
    },
    extraReducers: builder => {
        builder
        .addCase(fetchPosts.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Use the 'upsertMany' reducer as a mutating update utility
            postsAdapter.upsertMany(state, action.payload);
        })
        .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        // Use the 'addOne' reducer for the fulfilled case
        .addCase(addNewPost.fulfilled, postsAdapter.addOne)
    }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer;

// Export the customized selectors for this adapter using 'getSelectors'
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state=>state.posts);