import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { client } from "../../api/client";

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState }) => {
        const allNotifications = selectAllNotifications(getState());
        // saves the first elemnt in allNotifications to latestNotification
        // this is because state is already sorted by time
        const [latestNotification] = allNotifications;
        const latestTimestamp = latestNotification ? latestNotification.date : '';
        const response = await client.get(
            `fakeApi/notifications?since=${latestTimestamp}`
        );
        return response.data;
    }
)

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: [],
    reducers: {
        allNotificationsRead: (state, action) => {
            state.forEach(notification => {
                notification.read = true
            })
        }
    },
    extraReducers: builder => {
        builder
        .addCase(fetchNotifications.fulfilled, (state, action) => {
            state.forEach(notification => {
                // Any notification read are no longer new
                notification.isNew = !notification.read;
            })
            state.push(...action.payload);
            // sort with newest first
            state.sort((a, b) => b.date.localeCompare(a.date));
        })
    }
})

export const { allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const selectAllNotifications = state => state.notifications;