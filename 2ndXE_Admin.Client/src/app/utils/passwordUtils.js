import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Encrypts a password using bcrypt
 * @param {string} password - The password to encrypt
 * @returns {Promise<string>} - The encrypted password hash
 */
export const encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error encrypting password:', error);
    throw error;
  }
};

/**
 * Compares a password with a hash to see if they match
 * @param {string} password - The password to check
 * @param {string} hash - The stored hash to compare against
 * @returns {Promise<boolean>} - True if the password matches the hash
 */
export const comparePassword = async (password, hash) => {
  try {
    console.log("Compare password parameters:", { passwordLength: password?.length, hashLength: hash?.length });
    const result = await bcrypt.compare(password, hash);
    console.log("Bcrypt comparison result:", result);
    return result;
  } catch (error) {
    console.error('Error comparing password:', error);
    throw error;
  }
};
