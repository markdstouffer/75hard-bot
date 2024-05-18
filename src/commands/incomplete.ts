import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import {getIncompleteGoalsEmbed} from "@utils/incomplete-embed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("incomplete")
        .setDescription("See all incomplete goals"),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const embed = await getIncompleteGoalsEmbed();

            await interaction.reply({embeds: [embed]});

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "Something went wrong while checking incomplete goals...",
                ephemeral: true
            });
        }
    }
}