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

export const getThisSunday = (): string => {
    const today = new Date();
    const sundayDate = today.getDate() - today.getDay();
    const sunday = new Date(today.setDate(sundayDate));
    sunday.setHours(0, 0, 0, 0);

    return sunday.toUTCString();
}