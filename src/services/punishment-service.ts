import {User} from "discord.js";
import {supabase} from "@utils/supabase";
import {Function, Punishment, Table} from "@internalTypes/database";

export class PunishmentService {

    public static add = async (user: User, description: string): Promise<Punishment> => {
        const {id, username} = user;

        const {data, error} = await supabase
            .rpc(
                Function.AddPunishment, {
                    _discord_id: id,
                    _username: username,
                    _description: description
                }
            )

        if (error)
            throw error;

        return data;
    }

    public static remove = async (description: string): Promise<Punishment[]> => {
        const {data, error} = await supabase
            .from(Table.Punishments)
            .delete()
            .eq("description", description)
            .eq("is_seconded", false)
            .select()

        if (error)
            throw error;

        if (!data || data.length === 0) {
            throw new Error("No punishments matched the given description");
        }

        return data;
    }

    public static second = async (user: User, punishmentDescription: string): Promise<boolean> => {
        const {id, username} = user;

        const {data, error} = await supabase
            .rpc(
                Function.SecondPunishment, {
                    _discord_id: id,
                    _username: username,
                    _punishment_description: punishmentDescription
                }
            )

        if (error)
            throw error;

        return data;
    }

    public static getAll = async (): Promise<Punishment[]> => {
        const {data, error} = await supabase
            .from(Table.Punishments)
            .select("*");

        if (error)
            throw error;

        return data;
    }

    public static getNonSeconded = async (): Promise<Punishment[]> => {
        const {data, error} = await supabase
            .from(Table.Punishments)
            .select("*")
            .eq("is_seconded", false)

        if (error)
            throw error;

        return data;
    }

    public static getSeconded = async (): Promise<Punishment[]> => {
        const {data, error} = await supabase
            .from(Table.Punishments)
            .select("*")
            .eq("is_seconded", true)

        if (error)
            throw error;

        return data;
    }

    public static getRandom = async(): Promise<Punishment> => {
        const allPunishments = await this.getSeconded();
        if (allPunishments.length === 0) {
            throw new Error("There are no approved punishments in the roster");
        }

        return allPunishments[Math.floor(Math.random() * allPunishments.length)];
    }

}