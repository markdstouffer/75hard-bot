import {User} from "discord.js";
import {supabase} from "@utils/supabase";
import {Function, Goal, Table} from "@internalTypes/database";

export class GoalService {

    public static add = async (user: User, title: string, description: string | null, isDaily: boolean | null, frequency: number | null): Promise<Goal> => {
        const {id, username} = user;

        const freq = isDaily
            ? 7
            : frequency;

        const {data, error} = await supabase
            .rpc(
                Function.AddGoal, {
                    _discord_id: id,
                    _username: username,
                    _title: title,
                    _description: description ?? undefined,
                    _is_daily: isDaily ?? undefined,
                    _frequency: freq ?? undefined
                }
            )

        if (error)
            throw error;

        return data;
    }

    public static getAllActiveForUser = async (user: User): Promise<Goal[]> => {
        const {id, username} = user;

        const {data, error} = await supabase
            .from(Table.Users)
            .select(`
                discord_id,
                ${Table.Goals}!inner(*)
            `)
            .eq("discord_id", id)
            .eq("goals.is_active", true);

        if (error)
            throw error;

        return data.length > 0 ? data[0].goals : [];
    }

    public static markInactive = async (goalId: number): Promise<Goal[]> => {
        const {data, error} = await supabase
            .from(Table.Goals)
            .update({"is_active": false})
            .eq("id", goalId)
            .select();

        if (error)
            throw error;

        await supabase.from(Table.Progress).delete().eq("goal_id", goalId);

        return data ?? [];
    }

}