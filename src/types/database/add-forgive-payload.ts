import {Forgive} from "./forgive";

export type AddForgivePayload = Forgive & {
    count_forgives: number
};