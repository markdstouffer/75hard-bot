import {User} from "discord.js";
import {supabase} from "@utils/supabase";
import {Failure, CompleteFailure, Function, Table} from "@internalTypes/database";

export class FailureService {

    public static add = async (user: User, goalTitle: string, punishmentId: number): Promise<Failure> => {
        const {id} = user;

        const {data, error} = await supabase
            .rpc(
                Function.AddFailure, {
                    _discord_id: id,
                    _goal_title: goalTitle,
                    _punishment_id: punishmentId
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

    public static getAllForUser = async (user: User): Promise<CompleteFailure[]> => {
        const {id} = user;

        const {data, error} = await supabase
            .from(Table.Failures)
            .select(`
                *,
                ${Table.Goals} (title),
                ${Table.Users} (username, id)
            `)
            .eq("users.id", id)

        if (error)
            throw error;

        if (!data) {
            throw new Error("There are no failures for a user with that id.");
        }

        return data;
    }

}