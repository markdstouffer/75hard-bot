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
import {ForgiveService} from "@services/forgive-service";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("forgive")
        .setDescription("Forgive another users failure")
        .addStringOption(option =>
            option
                .setName("failure")
                .setDescription("Which failure to forgive")
                .setAutocomplete(true)
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const failure = interaction.options.getString("failure")!;

        try {
            const failureId = parseInt(failure);
            const newForgive = await ForgiveService.add(interaction.user, failureId);

            const forgivenFailure = await FailureService.getById(failureId);

            const newForgiveEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.username} has voted to forgive a failure`)
                .addFields([
                    {name: "Failed goal", value: forgivenFailure.goals!.title, inline: true},
                    {name: "Failed by", value: forgivenFailure.users!.username, inline: true},
                    {name: "Count forgives", value: newForgive.count_forgives.toString()}
                ])
                .setFooter({text: "Use /forgive to vote to forgive this failure"});

            await interaction.reply({embeds: [newForgiveEmbed]});

            if (newForgive.count_forgives >= 3) {
                const failedAt = new Date(forgivenFailure.failed_at).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "2-digit"
                });

                const clearedOfPunishmentEmbed = new EmbedBuilder()
                    .setTitle("A failure has been forgiven")
                    .setDescription(`${forgivenFailure.users!.username} has been forgiven for failing their goal, **${forgivenFailure.goals!.title}** on ${failedAt}. \n\nThe previously mandated punishment is no longer required!`)
                    .setColor(Colors.Green);
                interaction.channel!.send({embeds: [clearedOfPunishmentEmbed]})
            }

        } catch (error) {
            await interaction.reply({
                content: "Something went wrong (remember you cannot forgive your own failures or repeat votes)",
                ephemeral: true
            });
        }
    },
    async autocomplete(interaction: AutocompleteInteraction) {
        const failures = await FailureService.getAllActive();
        const failuresData = failures.map(failure => {
            const failedAt = new Date(failure.failed_at).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "2-digit"
            });
            return {
                name: `${failure.goals?.title}  (${failure.users?.username} on ${failedAt})`,
                value: failure.id
            }
        });

        const focusedValue = interaction.options.getFocused();
        const filteredChoices = failuresData.filter(choice => choice.name.startsWith(focusedValue));
        await interaction.respond(
            filteredChoices.map(choice => ({name: choice.name, value: choice.value.toString()}))
        );
    }
}