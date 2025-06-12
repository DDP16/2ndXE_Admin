import { createAsyncThunk } from "@reduxjs/toolkit";
import { LOCAL_EMAIL, LOCAL_USER_ID, LOCAL_PASSWORD_HASH } from "../../../../settings/localVar";
import supabase from "../../../modules/supabase";
import { encryptPassword } from "../../../utils/passwordUtils";

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
      
      // Store the email and user ID
      localStorage.setItem(LOCAL_EMAIL, email);
      localStorage.setItem(LOCAL_USER_ID, data?.user?.id);
      
      // Encrypt and store the password hash
      try {
        const passwordHash = await encryptPassword(password);
        localStorage.setItem(LOCAL_PASSWORD_HASH, passwordHash);
        console.log("Password encrypted and stored successfully");
      } catch (encryptError) {
        console.error("Failed to encrypt password:", encryptError);
        // Continue with login even if password encryption fails
      }
      
      return data;
    } catch (error) {
      console.error("Error in signInWithEmail:", error);
      return rejectWithValue(error.message);
    }
  }
);