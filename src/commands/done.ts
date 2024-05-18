import {
    AutocompleteInteraction,
    ChatInputCommandInteraction, Colors,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import {ProgressService} from "@services/progress-service";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("done")
        .setDescription("Add to your weekly goal progress")
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("Title of the goal")
                .setRequired(true)
                .setAutocomplete(true))
        .addNumberOption(option =>
            option
                .setName("count")
                .setDescription("Amount to increment goal progress by (negative to decrement)")
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const goalString = interaction.options.getString("title")!;
        const count = interaction.options.getNumber("count")!;

        try {
            const goalIdCutoff = goalString.indexOf(":");
            const goalId = goalString.substring(0, goalIdCutoff);
            const goalTitle = goalString.substring(goalIdCutoff + 1);

            const newProgress = await ProgressService.increment(interaction.user, parseInt(goalId), count);

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.username} has updated their progress`)
                .setThumbnail(interaction.user.avatarURL())
                .setColor(Colors.Green)
                .addFields({name: "Goal", value: goalTitle}, {
                    name: "Completions this week",
                    value: `${newProgress.completions}`
                });

            await interaction.reply({embeds: [embed]});

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "Something went wrong when updating your progress...",
                ephemeral: true
            });
        }
    },
    async autocomplete(interaction: AutocompleteInteraction) {
        const goalProgresses = await ProgressService.getForUser(interaction.user);
        const payload = goalProgresses.map(progress => ({
                content: progress.goals!.title,
                id: `${progress.goal_id}:${progress.goals!.title}`
            })
        );

        const focusedValue = interaction.options.getFocused();
        const filteredChoices = payload.filter(choice => choice.content.startsWith(focusedValue));
        await interaction.respond(
            filteredChoices.map(choice => ({name: choice.content, value: choice.id}))
        );
    }
}