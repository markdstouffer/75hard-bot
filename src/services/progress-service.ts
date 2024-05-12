import {supabase} from "@utils/supabase";
import {CompleteProgress, Function, Progress, Table} from "@internalTypes/database";
import {User} from "discord.js";
import {getThisSunday} from "@utils/time";

export class ProgressService {

    public static weeklyUpdate = async (): Promise<void> => {

        const {error} = await supabase
            .rpc(Function.UpdateProgress);

        if (error)
            throw error;
    }

    public static getForUserThisWeek = async (user: User): Promise<CompleteProgress[]> => {
        const {id} = user;

        const thisSunday = getThisSunday();

        const {data, error} = await supabase
            .from(Table.Progress)
            .select(`
                *,
                ${Table.Goals}!inner(title, frequency),
                ${Table.Users}!inner(discord_id)
            `)
            .eq("users.discord_id", id)
            .eq("week_start", thisSunday);

        if (error)
            throw error;

        return data;
    }

    public static increment = async (user: User, goalId: number, count: number): Promise<Progress> => {
        const {id} = user;

        const thisSunday = getThisSunday();

        const {data, error} = await supabase
            .rpc(Function.IncrementProgress, {
                _discord_id: id,
                _count: count,
                _goal_id: goalId,
                _week_start: thisSunday
            });

        if (error)
            throw error;

        return data;
    }

    public static incrementDailies = async (user: User): Promise<void> => {
        const {id} = user;

        const thisSunday = getThisSunday();

        const {error} = await supabase
            .rpc(Function.IncrementDailies, {
                _discord_id: id,
                _week_start: thisSunday
            });

        if (error)
            throw error;

        return;
    }

}