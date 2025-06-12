import { LOCAL_EMAIL, LOCAL_PASSWORD_HASH } from "../../settings/localVar";
import { comparePassword } from "./passwordUtils";

/**
 * Verifies if the provided password matches the stored hash
 * @param {string} password - The password to verify
 * @returns {Promise<boolean>} - True if the password is correct
 */
export const verifyUserPassword = async (password) => {
  try {
    const storedHash = localStorage.getItem(LOCAL_PASSWORD_HASH);
    
    if (!storedHash) {
      console.error("No password hash found in localStorage");
      return false;
    }
    
    console.log("Comparing password with stored hash");
    const isMatch = await comparePassword(password, storedHash);
    console.log("Password match result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
};

/**
 * Checks if the user is authenticated
 * @returns {boolean} - True if the user is authenticated
 */
export const isAuthenticated = () => {
  const email = localStorage.getItem(LOCAL_EMAIL);
  const passwordHash = localStorage.getItem(LOCAL_PASSWORD_HASH);
  return !!email && !!passwordHash;
};
