import {supabase} from "@utils/supabase";
import {Table} from "@internalTypes/database";
import {User} from "discord.js";

export class UserService {
    public static addUser = (user: User) => {
        const { id, username } = user;

        return supabase
            .from(Table.Users)
            .insert([
                {
                    discord_id: id,
                    username: username
                }
            ])
            .select();
    }
}