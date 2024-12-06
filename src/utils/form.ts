export const getNestedError = (errors: any, path: string) => {
  return (
    path.split(".").reduce((obj, key) => obj?.[key], errors)?.message || ""
  );
};
