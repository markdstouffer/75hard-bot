import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";

function timeUntil(date: Date) {

    function z(n: number) {
        return (n < 10 ? '0' : '') + n;
    }

    let diff = date.getTime() - Date.now();

    const sign = diff < 0? '-' : '';
    diff = Math.abs(diff);
    
    const hours = diff/3.6e6 | 0;
    const mins  = diff%3.6e6 / 6e4 | 0;
    const secs  = Math.round(diff%6e4 / 1e3);

    return sign + z(hours) + ':' + z(mins) + ':' + z(secs);
}

function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("countdown")
        .setDescription("See how much time is left in the 75HARD challenge"),
    async execute(interaction: ChatInputCommandInteraction) {
        // hard coded for now, need to make this dynamic
        const startDate = new Date("May 05, 2024 00:00:00");
        const endDate = addDays(startDate, 75);

        const timeUntilEnd = timeUntil(endDate);

        await interaction.reply({content: timeUntilEnd})
    }
}