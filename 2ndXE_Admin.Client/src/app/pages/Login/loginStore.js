import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
    error: null,
    state: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
};

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase('login/signInWithEmail/pending', (state) => {
                state.state = 'loading';
                state.error = null;
            })
            .addCase('login/signInWithEmail/fulfilled', (state, action) => {
                state.state = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase('login/signInWithEmail/rejected', (state, action) => {
                state.state = 'failed';
                state.error = action.payload;
            })
            .addCase('login/logout/pending', (state) => {
                state.state = 'loading';
                state.error = null;
            })
            .addCase('login/logout/fulfilled', (state) => {
                state.state = 'succeeded';
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase('login/logout/rejected', (state, action) => {
                state.state = 'failed';
                state.error = action.payload;
            });
    }
});

export default loginSlice.reducer;