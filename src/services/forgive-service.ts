import {User} from "discord.js";
import {supabase} from "@utils/supabase";
import {AddForgivePayload, Function, Table} from "@internalTypes/database";

export class ForgiveService {

    private static getCountForgivesForFailure = async (failureId: number): Promise<number> => {
        const {data, error} = await supabase
            .from(Table.Forgives)
            .select("count")
            .eq("failure_id", failureId)

        if (error)
            throw error;

        if (!data || data.length === 0)
            return 0;

        return data[0].count;
    }

    public static add = async (user: User, failureId: number): Promise<AddForgivePayload> => {
        const {id} = user;

        const {data, error} = await supabase
            .rpc(
                Function.AddForgive, {
                    _discord_id: id,
                    _failure_id: failureId
                }
            )

        if (error)
            throw error;

        try {
            const forgivesForFailure = await this.getCountForgivesForFailure(failureId);
            return {
                ...data,
                count_forgives: forgivesForFailure
            }
        } catch (error) {
            throw error;
        }

    }

}