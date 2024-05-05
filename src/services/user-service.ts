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
}