import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../supabase";

export const fetchAllPostPayment = createAsyncThunk(
    "postPayment/fetchAllPostPayment", async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("PostPayment")
                .select("*");

            if (error) throw error;

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPostPaymentById = createAsyncThunk(
    "postPayment/fetchPostPaymentById", async (id, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("PostPayment")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createPostPayment = createAsyncThunk(
    "postPayment/createPostPayment", async (newPostPayment, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("PostPayment")
                .insert(newPostPayment)
                .select("*")
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updatePostPayment = createAsyncThunk(
    "postPayment/updatePostPayment", async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("PostPayment")
                .update(updatedData)
                .eq("id", id)
                .select("*")
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deletePostPayment = createAsyncThunk(
    "postPayment/deletePostPayment", async (id, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("PostPayment")
                .delete()
                .eq("id", id)
                .select("*")
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const postPaymentSlice = createSlice({
    name: "postPayment",
    initialState: {
        postPayments: [],
        postPayment: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPostPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPostPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.postPayments = action.payload;
            })
            .addCase(fetchAllPostPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPostPaymentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPostPaymentById.fulfilled, (state, action) => {
                state.loading = false;
                state.postPayment = action.payload;
            })
            .addCase(fetchPostPaymentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createPostPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPostPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.postPayments.push(action.payload);
            })
            .addCase(createPostPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePostPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePostPayment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.postPayments.findIndex(payment => payment.id === action.payload.id);
                if (index !== -1) {
                    state.postPayments[index] = action.payload;
                }
            })
            .addCase(updatePostPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deletePostPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePostPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.postPayments = state.postPayments.filter(payment => payment.id !== action.payload.id);
            })
            .addCase(deletePostPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default postPaymentSlice.reducer;
