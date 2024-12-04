import { useContext } from "react";
import { AuthContext, AuthProviderType } from "./auth-context";

export const useAuthContext = (): AuthProviderType => useContext(AuthContext);
