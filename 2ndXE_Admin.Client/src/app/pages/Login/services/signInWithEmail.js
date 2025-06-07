import { createAsyncThunk } from "@reduxjs/toolkit";
import { LOCAL_EMAIL, LOCAL_USER_ID } from "../../../../settings/localVar";
import supabase from "../../../modules/supabase";

export const signInWithEmail = createAsyncThunk(
  "login/signInWithEmail", async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) {
        console.error("Supabase auth error:", error);
        throw error;
      }
      
      console.log("Sign in successful:", data);
      localStorage.setItem(LOCAL_EMAIL, email);
      localStorage.setItem(LOCAL_USER_ID, data?.user?.id);
      
      return data;
    } catch (error) {
      console.error("Error in signInWithEmail:", error);
      return rejectWithValue(error.message);
    }
  }
);