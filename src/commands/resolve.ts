import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Colors,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import {PunishmentService} from "@services/punishment-service";
import {GoalService} from "@services/goal-service";
import {FailureService} from "@services/failure-service";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resolve")
        .setDescription("Mark a punishment for a failure as completed")
        .addStringOption(option =>
            option
                .setName("punishment")
                .setDescription("Which punishment you completed")
                .setAutocomplete(true)
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const failure = interaction.options.getString("punishment")!;

        try {
            const failureId = parseInt(failure);

            await FailureService.resolve(failureId);
            const completedFailure = await FailureService.getById(failureId);


            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.username} has completed a punishment`)
                .setDescription("They are cleared of all wrong-doing!")
                .addFields([
                    {name: "Failed goal", value: completedFailure.goals!.title},
                    {name: "Completed punishment", value: completedFailure.punishments!.description}
                ])
                .setColor(Colors.Green);

            await interaction.reply({embeds: [embed]});

        } catch (error) {
            console.error(error);
            await interaction.reply({content: "Something went wrong...", ephemeral: true});
        }
    },
    async autocomplete(interaction: AutocompleteInteraction) {
        const userActiveFailures = await FailureService.getActiveForUser(interaction.user);

        const payload = userActiveFailures.map(failure => {
            const shortDate = new Date(failure.failed_at).toLocaleDateString();
            const content = `${failure.goals!.title} (${shortDate}) - ${failure.punishments!.description}`.substring(0, 95) + "...";
            return {
                id: failure.id, content
            }
        });

        const focusedValue = interaction.options.getFocused();
        const filteredChoices = payload.filter(choice => choice.content.startsWith(focusedValue));
        await interaction.respond(
            filteredChoices.map(choice => ({name: choice.content, value: choice.id.toString()}))
        );
    }
}