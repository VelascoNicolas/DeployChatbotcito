import { supabase } from "../configSupabaseClient";
import { CustomError } from "../types";

export class SessionRepository {

    public async getSession() {
        try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            throw new CustomError("Error getting session", 500);
        }
        return { "token": data?.session?.access_token, "refresh_token": data?.session?.refresh_token };
        } catch (error: unknown) {
        if (error instanceof CustomError) {
            throw error;
        } else {
            throw new CustomError("Unknown error: " + error, 500);
        }
        }
    }

    public async refreshSession(refreshToken: string) {
        try {
        const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
        if (error) {
            throw new CustomError("Error refreshing token", 500);
        }
        return { "token": data?.session?.access_token, "refresh_token": data?.session?.refresh_token };
        } catch (error: unknown) {
        if (error instanceof CustomError) {
            throw error;
        } else {
            throw new CustomError("Unknown error: " + error, 500);
        }
        }
    }
}