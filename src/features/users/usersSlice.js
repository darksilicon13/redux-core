// userSlice
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const initialState = []

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await client.get('/fakeApi/users');
    console.log(response.data);
    return response.data;
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchUsers.fulfilled]: (state, action) => {
            return action.payload;
        }
    }
});

export default usersSlice.reducer;