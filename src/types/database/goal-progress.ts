import {Goal} from "./goal";

export type GoalProgress = Goal & {
    completions: number
    discord_id: string
}