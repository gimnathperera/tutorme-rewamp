export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 12;

// Must contain at least one letter and one number (no uppercase/special required).
// This regex matches any string that contains at least one letter and one digit.
export const PASSWORD_LETTER_NUMBER_REGEX = /(?=.*[A-Za-z])(?=.*\d).+/;

export const PASSWORD_TOO_SHORT = `Password must be at least ${PASSWORD_MIN} characters long`;
export const PASSWORD_TOO_LONG = `Password cannot exceed ${PASSWORD_MAX} characters`;
export const PASSWORD_LETTER_NUMBER_MSG =
  "Password must contain at least one letter and one number";

// Reusable message for current password required
export const CURRENT_PASSWORD_REQUIRED = "Password is required";
