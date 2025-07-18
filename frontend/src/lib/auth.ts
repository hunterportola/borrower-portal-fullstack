import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3001/api/auth", // Backend auth URL
});

export const {
    useSession,
    signIn,
    signUp,
    signOut,
    getSession,
} = authClient;