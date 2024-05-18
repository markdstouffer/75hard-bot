import {supabase} from "@utils/supabase";
import {CompleteProgress, Function, GoalProgress, Progress, Table} from "@internalTypes/database";
import {User} from "discord.js";

export class ProgressService {

    public static populateProgress = async (): Promise<void> => {
        const {error} = await supabase
            .rpc(Function.PopulateProgress);

        if (error)
            throw error;
    }

    public static resetProgress = async (): Promise<void> => {
        const {error} = await supabase
            .rpc(Function.ClearProgress);

        if (error)
            throw error;
    }


    public static getForUser = async (user: User): Promise<CompleteProgress[]> => {
        const {id} = user;

        const {data, error} = await supabase
            .from(Table.Progress)
            .select(`
                *,
                ${Table.Goals}!inner(title, frequency),
                ${Table.Users}!inner(discord_id)
            `)
            .eq("users.discord_id", id);

        if (error)
            throw error;

        return data;
    }

    public static increment = async (user: User, goalId: number, count: number): Promise<Progress> => {
        const {id} = user;

        const {data, error} = await supabase
            .rpc(Function.IncrementProgress, {
                _discord_id: id,
                _count: count,
                _goal_id: goalId
            });

        if (error)
            throw error;

        return data;
    }

    public static getAllUnfinished = async (): Promise<GoalProgress[]> => {
        const ids = await this.getUnfinishedIds();

        const {data, error} = await supabase
            .from(Table.Progress)
            .select(`
                completions,
                ${Table.Goals}!inner(*),
                ${Table.Users}!inner(discord_id)
            `)
            .in("goals.id", ids);

        if (error)
            throw error;

        return data?.map(d => ({
            ...d.goals,
            ...d.users,
            completions: d.completions
        })) ?? [];
    }

    private static getUnfinishedIds = async (): Promise<number[]> => {
        const {data, error} = await supabase
            .rpc(Function.CheckProgress);

        if (error)
            throw error;

        return data ?? [];
    }

}