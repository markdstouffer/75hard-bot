import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import {timeUntil} from "@utils/time";
import {GroupService} from "@services/group-service";

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
        try {
            const group = await GroupService.getForUser(interaction.user);
            const startDateString = group.started_at;

            if (!startDateString) {
                await interaction.reply({
                    content: "Your group has no start-time set. (`/group start`)",
                    ephemeral: true
                });
            } else {
                const startDate = new Date(startDateString);
                const endDate = addDays(startDate, 75);

                const challengeHasStarted = Date.now() >= startDate.getTime();

                if (challengeHasStarted) {
                    const timeSpan = timeUntil(endDate);

                    await interaction.reply({
                        content: `There are **${timeSpan.days}** days, ` +
                            `**${timeSpan.hours}** hours, **${timeSpan.minutes}** minutes, ` +
                            `and **${timeSpan.seconds}** seconds left in this challenge.`
                    });
                } else {
                    const timeSpan = timeUntil(startDate);

                    await interaction.reply({
                        content: `There are **${timeSpan.days}** days, ` +
                            `**${timeSpan.hours}** hours, **${timeSpan.minutes}** minutes, ` +
                            `and **${timeSpan.seconds}** seconds until this challenge begins.`
                    });
                }

            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "Something went wrong. Make sure you've joined a group! (`/group join`)",
                ephemeral: true
            });
        }
    }
}