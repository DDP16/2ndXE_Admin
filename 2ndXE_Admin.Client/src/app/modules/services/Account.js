import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../supabase";

export const fetchAllAccount = createAsyncThunk(
    "account/fetchAllAccount", async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("User")
                .select("*");

            if (error) throw error;

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAccountById = createAsyncThunk(
    "account/fetchAccountById", async (id, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("User")
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

export const createAccount = createAsyncThunk(
    "account/createAccount", async (newAccount, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("User")
                .insert(newAccount)
                .select("*")
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateAccount = createAsyncThunk(
    "account/updateAccount", async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("User")
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

export const deleteAccount = createAsyncThunk(
    "account/deleteAccount", async (id, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("User")
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

const accountSlice = createSlice({
    name: "account",
    initialState: {
        accounts: [],
        account: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload;
            })
            .addCase(fetchAllAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAccountById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccountById.fulfilled, (state, action) => {
                state.account = action.payload;
            })
            .addCase(fetchAccountById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.accounts.push(action.payload);
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
                if (index !== -1) {
                    state.accounts[index] = action.payload;
                }
            })
            .addCase(updateAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.accounts = state.accounts.filter(acc => acc.id !== action.payload.id);
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default accountSlice.reducer;