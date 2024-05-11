import {supabase} from "@utils/supabase";
import {Group, Table} from "@internalTypes/database";
import {User} from "discord.js";

export class GroupService {

    public static add = async (serverId: string): Promise<Group[]> => {
        const {data, error} = await supabase
            .from(Table.Groups)
            .insert([
                { server_id: serverId }
            ])
            .select();

        if (error)
            throw error;

        return data;
    }

    public static getAll = async (): Promise<Group[]> => {
        const {data, error} = await supabase
            .from(Table.Groups)
            .select();

        if (error)
            throw error;

        return data;
    }

    public static getAllForServer = async (serverId: string): Promise<Group[]> => {
        const {data, error} = await supabase
            .from(Table.Groups)
            .select()
            .eq("server_id", serverId);

        if (error)
            throw error;

        return data;
    }

    public static getForUser = async (user: User): Promise<Group> => {
        const {id} = user;

        const {data, error} = await supabase
            .from(Table.Users)
            .select(`
                ${Table.Groups} (*)
            `)
            .eq("discord_id", id);

        if (error)
            throw error;

        if (!data || data.length === 0)
            throw new Error("There is no user with that id");

        if (data.length > 1)
            throw new Error("Multiple users match the given id");

        if (!data[0].groups)
            throw new Error("This user does not belong to a group");

        return data[0].groups;
    }

    public static start = async (groupId: number, startDate: string): Promise<Group[]> => {
        const {data, error} = await supabase
            .from(Table.Groups)
            .update({
                started_at: startDate
            })
            .eq("id", groupId)
            .select();

        if (error)
            throw error;

        return data;
    }

}