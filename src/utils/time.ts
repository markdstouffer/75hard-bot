import {TimeSpan} from "@internalTypes/shared";

export const timeUntil = (endDate: Date): TimeSpan => {
    const diff = Math.abs(endDate.getTime() - Date.now());

    const seconds = Math.round(diff / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    return {
        days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60
    }
}