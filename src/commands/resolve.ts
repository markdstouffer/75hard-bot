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
        const failedGoal = interaction.options.getString("goal")!;

        try {
            const randomPunishment = await PunishmentService.getRandom();

            await FailureService.add(interaction.user, failedGoal, randomPunishment.id);

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.username} has failed on a goal`)
                .addFields([
                    {name: "Goal", value: failedGoal},
                    {name: "Punishment", value: randomPunishment.description}
                ])
                .setColor(Colors.Red);

            await interaction.reply({embeds: [embed]});

        } catch (error) {
            await interaction.reply({content: "Something went wrong...", ephemeral: true});
        }
    },
    async autocomplete(interaction: AutocompleteInteraction) {
        // const userGoals = await GoalService.getAllActiveForUser(interaction.user);
        // const userGoalTitles = userGoals.map(goal => goal.title);

        const userPunishments = await FailureService.getAllForUser(interaction.user);


        // const focusedValue = interaction.options.getFocused();
        // const filteredChoices = userGoalTitles.filter(choice => choice.startsWith(focusedValue));
        // await interaction.respond(
        //     filteredChoices.map(choice => ({name: choice, value: choice}))
        // );
    }
}