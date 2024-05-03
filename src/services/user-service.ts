import {supabase} from "@utils/supabase";
import {Table} from "@internalTypes/database";
import {User} from "discord.js";

export class UserService {
    public static addUser = async (user: User) => {
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

        return data;
    }
}