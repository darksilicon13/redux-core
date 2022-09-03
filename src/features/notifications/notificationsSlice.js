import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

import { client } from "../../api/client";

const notificationAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

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
    initialState: notificationAdapter.getInitialState(),
    reducers: {
        allNotificationsRead: (state, action) => {
            Object.values(state.entities).forEach(notification => {
                notification.read = true
            })
        }
    },
    extraReducers: builder => {
        builder
        .addCase(fetchNotifications.fulfilled, (state, action) => {
            Object.values(state.entities).forEach(notification => {
                // Any notification read are no longer new
                notification.isNew = !notification.read;
            })
            notificationAdapter.upsertMany(state, action.payload);
        })
    }
})

export const { allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const {
    selectAll: selectAllNotifications,
} = notificationAdapter.getSelectors(state=>state.notifications);