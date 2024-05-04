import {User} from "discord.js";
import {supabase} from "@utils/supabase";
import {Function, Goal, Table} from "@internalTypes/database";

export class GoalService {

    public static addGoal = async (user: User, title: string, description: string | null, isDaily: boolean | null): Promise<Goal> => {
        const {id, username} = user;

        const {data, error} = await supabase
            .rpc(
                Function.AddGoal, {
                    _discord_id: id,
                    _username: username,
                    _title: title,
                    _description: description ?? undefined,
                    _is_daily: isDaily ?? undefined
                }
            )

        if (error)
            throw error;

        return data;
    }

    public static getUserGoals = async (user: User): Promise<Goal[]> => {
        const {id, username} = user;

        const {data, error} = await supabase
            .from(Table.Users)
            .select(`
                discord_id,
                ${Table.Goals} (*)
            `)
            .eq("discord_id", id);

        if (error)
            throw error;

        return data.length > 0 ? data[0].goals : [];
    }

}