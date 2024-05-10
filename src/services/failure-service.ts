import {User} from "discord.js";
import {supabase} from "@utils/supabase";
import {Failure, CompleteFailure, Function, Table} from "@internalTypes/database";

export class FailureService {

    public static add = async (user: User, goalTitle: string): Promise<Failure> => {
        const {id} = user;

        // TO-DO: attach punishment_id
        const {data, error} = await supabase
            .rpc(
                Function.AddFailure, {
                    _discord_id: id,
                    _goal_title: goalTitle,
                    _punishment_id: 1
                }
            );

        if (error)
            throw error;

        return data;
    }

    public static getAll = async (): Promise<CompleteFailure[]> => {
        const {data, error} = await supabase
            .from(Table.Failures)
            .select(`
                *,
                ${Table.Goals} (title),
                ${Table.Users} (username)
            `);

        if (error)
            throw error;

        return data;
    }

    public static getById = async (id: number): Promise<CompleteFailure> => {
        const {data, error} = await supabase
            .from(Table.Failures)
            .select(`
                *,
                ${Table.Goals} (title),
                ${Table.Users} (username)
            `)
            .eq("id", id)

        if (error)
            throw error;

        if (!data || data.length === 0) {
            throw new Error("There is no failure with that id.");
        }

        return data[0];
    }

}