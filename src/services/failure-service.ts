import {User} from "discord.js";
import {supabase} from "@utils/supabase";
import {Failure, Function} from "@internalTypes/database";

export class FailureService {

    public static add = async (user: User, goalTitle: string): Promise<Failure> => {
        const {id} = user;

        const {data, error} = await supabase
            .rpc(
                Function.AddFailure, {
                    _discord_id: id,
                    _goal_title: goalTitle
                }
            )

        if (error)
            throw error;

        return data;
    }

}