import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import {timeUntil} from "@utils/time";

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

        const timeSpan = timeUntil(endDate);

        await interaction.reply({
            content: `There are **${timeSpan.days}** days, ` +
                `**${timeSpan.hours}** hours, **${timeSpan.minutes}** minutes, ` +
                `and **${timeSpan.seconds}** seconds left in this challenge.`
        });
    }
}