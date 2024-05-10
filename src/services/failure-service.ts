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
                ${Table.Punishments} (description),
                ${Table.Goals} (title),
                ${Table.Users} (username)
            `)
            .eq("id", id)

        if (error)
            throw error;

        if (!data || data.length === 0)
            throw new Error("There is no failure with that id.");

        return data[0];
    }

    public static getActiveForUser = async (user: User): Promise<CompleteFailure[]> => {
        const {id} = user;

        const {data, error} = await supabase
            .from(Table.Failures)
            .select(`
                *,
                ${Table.Users}!inner(username, discord_id),
                ${Table.Punishments}!inner(description),
                ${Table.Goals}!inner(title)
            `)
            .eq("is_forgiven", false)
            .eq("is_completed", false)
            .eq("users.discord_id", id);

        if (error)
            throw error;

        if (!data)
            throw new Error("There are no failures for a user with that id.");

        return data;
    }

    public static resolve = async (id: number): Promise<Failure[]> => {
        const {data, error} = await supabase
            .from(Table.Failures)
            .update({is_completed: true})
            .eq("id", id)
            .select();

        if (error)
            throw error;

        if (!data)
            throw new Error("There are no failures with that id.");

        return data;
    }

}