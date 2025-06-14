import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../supabase";
import { encryptPassword } from "../../utils/passwordUtils";
import { LOCAL_PASSWORD_HASH } from "../../../settings/localVar";

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
            console.error("Error fetching account by ID:", error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAccountByAuthId = createAsyncThunk(
    "account/fetchAccountByAuthId", async (id, { rejectWithValue }) => {
        try {
            // First try to get the user with the exact ID
            let { data, error } = await supabase
                .from("User")
                .select("*")
                .eq("auth_id", id);

            if (error) throw error;
            
            // If no data or multiple rows, handle accordingly
            if (!data || data.length === 0) {
                return rejectWithValue("User not found");
            }
            
            // If multiple users found, return the first one
            if (data.length > 1) {
                console.warn(`Multiple users found with ID ${id}, using the first one`);
            }
            
            return data[0]; // Return the first (or only) user found
        } catch (error) {
            console.error("Error fetching account by ID:", error);
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

export const changeAccountPassword = createAsyncThunk(
    "account/changeAccountPassword", async ({ id, newPassword }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            try {
                const passwordHash = await encryptPassword(newPassword);
                localStorage.setItem(LOCAL_PASSWORD_HASH, passwordHash);
                console.log("Password encrypted and stored successfully");
            } catch (encryptError) {
                console.error("Failed to encrypt password:", encryptError);
            }
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
                state.loading = false;
                state.account = action.payload;
            })
            .addCase(fetchAccountById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAccountByAuthId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccountByAuthId.fulfilled, (state, action) => {
                state.account = action.payload;
            })
            .addCase(fetchAccountByAuthId.rejected, (state, action) => {
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
            })
            .addCase(changeAccountPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeAccountPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.account = action.payload;
            })
            .addCase(changeAccountPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default accountSlice.reducer;