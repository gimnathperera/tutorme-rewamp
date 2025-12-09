export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 12;

export const PASSWORD_LETTER_NUMBER_REGEX = /(?=.*[A-Za-z])(?=.*\d).+/;

export const PASSWORD_TOO_SHORT = `Password must be at least ${PASSWORD_MIN} characters long`;
export const PASSWORD_TOO_LONG = `Password cannot exceed ${PASSWORD_MAX} characters`;
export const PASSWORD_LETTER_NUMBER_MSG =
  "Password must contain at least one letter and one number";

export const CURRENT_PASSWORD_REQUIRED = "Password is required";
