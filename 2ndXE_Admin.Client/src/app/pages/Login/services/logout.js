import { createAsyncThunk } from "@reduxjs/toolkit";
import { LOCAL_EMAIL, LOCAL_USER_ID } from "../../../../settings/localVar";
import supabase from "../../../modules/supabase";

export const logout = createAsyncThunk(
  "login/logout", async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Supabase auth error:", error);
        throw error;
      }
      
      console.log("Logout successful");
      localStorage.removeItem(LOCAL_EMAIL);
      localStorage.removeItem(LOCAL_USER_ID);
      
      return true;
    } catch (error) {
      console.error("Error in logout:", error);
      return rejectWithValue(error.message);
    }
  }
);