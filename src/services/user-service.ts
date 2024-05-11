import {supabase} from "@utils/supabase";
import {DatabaseUser, Table} from "@internalTypes/database";
import {User} from "discord.js";

export class UserService {
    public static add = async (user: User): Promise<DatabaseUser[]> => {
        const {id, username} = user;

        const {data, error} = await supabase
            .from(Table.Users)
            .insert([
                {
                    discord_id: id,
                    username: username
                }
            ])
            .select();

        if (error)
            throw error;

        return data as DatabaseUser[];
    }

    public static getAllForGroup = async (groupId: number): Promise<DatabaseUser[]> => {
        const {data, error} = await supabase
            .from(Table.Groups)
            .select(`
                id,
                ${Table.Users} (*)
            `)
            .eq("id", groupId);

        if (error)
            throw error;

        if (!data || data.length === 0)
            throw new Error("There is no group with that id.");

        if (data.length > 1)
            throw new Error("There are multiple groups with that id...?");

        return data[0].users as DatabaseUser[];
    }

    public static joinGroup = async (user: User, groupId: number): Promise<DatabaseUser[]> => {
        const {id} = user;

        const {data, error} = await supabase
            .from(Table.Users)
            .update({"group_id": groupId})
            .eq("discord_id", id)
            .select();

        if (error)
            throw error;

        return data as DatabaseUser[];
    }
}