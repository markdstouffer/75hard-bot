import {Failure} from "./failure";
import {Punishment} from "./punishment";
import {Snowflake} from "discord.js";

export type FailurePunishment = {
    failure: Failure
    punishment: Punishment
    discordId: Snowflake
    goalTitle: string
}