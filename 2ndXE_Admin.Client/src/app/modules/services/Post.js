import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../supabase";

export const fetchAllPost = createAsyncThunk(
    "post/fetchAllPost", async (_, { rejectWithValue }) => {
        try {
            let { data: VehiclePost, error } = await supabase
                .from('VehiclePost')
                .select('id, title, description, brand, model, year, mileage, price, imageURL, location, expire_at, status')

            if (error) {
                throw error;
            }
            console.log("Fetched posts:", VehiclePost);
            return VehiclePost;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPostById = createAsyncThunk(
    "post/fetchPostById", async (id, { rejectWithValue }) => {
        try {
            let { data: VehiclePost, error } = await supabase
                .from('VehiclePost')
                .select('*')
                .eq('id', id)

            if (error) {
                throw error;
            }
            console.log("Fetched post:", VehiclePost);
            return VehiclePost;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const editPost = createAsyncThunk(
    "post/editPost", async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            let { data: VehiclePost, error } = await supabase
                .from('VehiclePost')
                .update(updatedData)
                .eq('id', id)

            if (error) {
                throw error;
            }
            console.log("Updated post:", VehiclePost);
            return VehiclePost;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deletePost = createAsyncThunk(
    "post/deletePost", async (id, { rejectWithValue }) => {
        try {
            let { data: VehiclePost, error } = await supabase
                .from('VehiclePost')
                .delete()
                .eq('id', id)

            if (error) {
                throw error;
            }
            console.log("Deleted post:", VehiclePost);
            return VehiclePost;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    postItems: [],
    state: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPost.pending, (state) => {
                state.state = "loading";
                state.error = null;
            })
            .addCase(fetchAllPost.fulfilled, (state, action) => {
                state.state = "succeeded";
                state.postItems = action.payload;
            })
            .addCase(fetchAllPost.rejected, (state, action) => {
                state.state = "failed";
                state.error = action.payload;
            })
            .addCase(fetchPostById.pending, (state) => {
                state.state = "loading";
                state.error = null;
            })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.state = "succeeded";
                state.postItems = action.payload;
            })
            .addCase(fetchPostById.rejected, (state, action) => {
                state.state = "failed";
                state.error = action.payload;
            })
            .addCase(editPost.pending, (state) => {
                state.state = "loading";
                state.error = null;
            })
            .addCase(editPost.fulfilled, (state, action) => {
                state.state = "succeeded";
                state.postItems = action.payload;
            })
            .addCase(editPost.rejected, (state, action) => {
                state.state = "failed";
                state.error = action.payload;
            })
            .addCase(deletePost.pending, (state) => {
                state.state = "loading";
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.state = "succeeded";
                state.postItems = action.payload;
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.state = "failed";
                state.error = action.payload;
            });
    },
});

export default postSlice.reducer;