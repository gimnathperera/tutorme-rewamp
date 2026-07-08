export const isDuplicateEmailError = (error: string) => {
  const normalizedError = error.toLowerCase();
  return (
    normalizedError.includes("email") &&
    (normalizedError.includes("already exists") ||
      normalizedError.includes("already in use") ||
      normalizedError.includes("already taken"))
  );
};

export const isPendingEmailError = (error: string) => {
  const normalizedError = error.toLowerCase();
  return (
    normalizedError.includes("email") && normalizedError.includes("pending")
  );
};
