import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {GoalService} from "@services/goal-service";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("goal")
        .setDescription("Things you commit to do for the remainder of the challenge")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a new goal")
                .addStringOption(option =>
                    option
                        .setName("title")
                        .setDescription("Title of the goal")
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName("description")
                        .setDescription("More details about the goal")
                        .setRequired(false))
                .addBooleanOption(option =>
                    option
                        .setName("is_daily")
                        .setDescription("Is this something you need to complete every day? (default TRUE)")
                        .setRequired(false))
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "add":
                const title = interaction.options.getString("title")!;
                const description = interaction.options.getString("description");
                const isDaily = interaction.options.getBoolean("is_daily");
                try {
                    await GoalService.addGoal(interaction.user, title, description, isDaily);
                    await interaction.reply({
                        content: `The goal, '**${title}**', is now being tracked!`,
                        ephemeral: true
                    });
                } catch (error) {
                    console.error(error);
                    await interaction.reply({
                        content: "Something went wrong with adding this goal to the DB...",
                        ephemeral: true
                    });
                }
                break;
            default:
                await interaction.reply({content: "You need to pick a subcommand!", ephemeral: true});
        }
    }
}