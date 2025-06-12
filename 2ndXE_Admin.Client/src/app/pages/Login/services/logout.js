import { createAsyncThunk } from "@reduxjs/toolkit";
import { LOCAL_EMAIL, LOCAL_USER_ID, LOCAL_PASSWORD_HASH, LOCAL_PASSWORD_SALT } from "../../../../settings/localVar";
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
      // Clear all local storage items
      localStorage.removeItem(LOCAL_EMAIL);
      localStorage.removeItem(LOCAL_USER_ID);
      localStorage.removeItem(LOCAL_PASSWORD_HASH);
      localStorage.removeItem(LOCAL_PASSWORD_SALT);
      // localStorage.removeItem("user_data");
      
      return { success: true };
    } catch (error) {
      console.error("Error in logout:", error);
      return rejectWithValue(error.message);
    }
  }
);