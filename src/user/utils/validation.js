/**
 * @param {string} email - Email address to validate.
 * @returns {string} - Returns an empty string if the email is valid, otherwise an error message.
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? '' : 'Invalid email format';
}

/**
* Password must contain at least one uppercase letter, one lowercase letter, and one digit.
* @param {string} password - Password to validate.
* @returns {string} - Returns an empty string if the password is valid, otherwise an error message.
*/
export function validatePassword(password) {
  if (!password) return 'Password is required.';
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password) ? '' : 'Password must be at least 6 characters long and must contain letters in mixed case';
}

export const validateStringLength = (value, maxLength) => {
  return value.length > maxLength ? `Must be ${maxLength} characters or less.` : '';
};
