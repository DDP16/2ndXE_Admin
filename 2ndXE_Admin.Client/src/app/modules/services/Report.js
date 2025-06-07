import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../supabase";

export const fetchAllReport = createAsyncThunk(
    "report/fetchAllReport", async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("Report")
                .select("*");

            if (error) throw error;

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchReportById = createAsyncThunk(
    "report/fetchReportById", async (id, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("Report")
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

export const updateReport = createAsyncThunk(
    "report/updateReport", async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("Report")
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

export const deleteReport = createAsyncThunk(
    "report/deleteReport", async (id, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("Report")
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

const reportSlice = createSlice({
    name: "report",
    initialState: {
        reports: [],
        report: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllReport.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchAllReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReportById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReportById.fulfilled, (state, action) => {
                state.loading = false;
                state.report = action.payload;
            })
            .addCase(fetchReportById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReport.fulfilled, (state, action) => {
                state.loading = false;
                state.report = action.payload;
                state.reports = state.reports.map(report => 
                    report.id === action.payload.id ? action.payload : report
                );
            })
            .addCase(updateReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReport.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = state.reports.filter(
                    report => report.id !== action.payload.id
                );
            })
            .addCase(deleteReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default reportSlice.reducer;