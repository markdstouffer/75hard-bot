import {Failure} from "./failure";

export type CompleteFailure = Failure & {
    goals: {
        title: string
    } | null,
    users: {
        username: string
    } | null,
    punishments?: {
        description: string
    } | null
}