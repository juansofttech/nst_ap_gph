import { randomBytes } from 'crypto';

/**
 * Generates a random JWT secret key.
 * @param {number} length - The length of the secret key in bytes.
 * @returns {string} - The generated secret key in hexadecimal format.
 * @author: @JuanMT
 */
export const generateJwtSecret = (length: number = 32): string => {
    return randomBytes(length).toString('hex');
};

// Example usage
if (require.main === module) {
    const secret = generateJwtSecret();
    console.log(`Generated JWT Secret Key: ${secret}`);
}