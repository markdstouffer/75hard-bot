import {AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {PunishmentService} from "@services/punishment-service";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("punishment")
        .setDescription("Punishments randomly given in response to goal failures")
        .addSubcommand(subcommand =>
            subcommand
                .setName("suggest")
                .setDescription("Suggests a punishment to add to the list")
                .addStringOption(option =>
                    option
                        .setName("description")
                        .setDescription("Description of the suggested punishment")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("second")
                .setDescription("Vote to approve a punishment into the roster (you must not be the user who suggested it)")
                .addStringOption(option =>
                    option
                        .setName("description")
                        .setDescription("Description of the punishment to second")
                        .setAutocomplete(true)
                        .setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "suggest":
                const description = interaction.options.getString("description")!;
                try {
                    await PunishmentService.add(interaction.user, description);

                    const embed = new EmbedBuilder()
                        .setTitle("A new punishment has been suggested!")
                        .setDescription(description + "\n\nUse `/punishment second` to approve it and enter it into the punishment roster")
                        .setFooter({
                            text: `Suggested by ${interaction.user.username}`,
                            iconURL: interaction.user.avatarURL() ?? undefined
                        });

                    await interaction.reply({embeds: [embed]});
                } catch (error) {
                    console.error(error);
                    await interaction.reply({
                        content: "Something went wrong with adding this punishment to the DB...",
                        ephemeral: true
                    });
                }
                break;
            case "second":
                const punishmentToSecond = interaction.options.getString("description")!;
                try {
                    const was_seconded = await PunishmentService.second(interaction.user, punishmentToSecond);

                    if (!was_seconded) {
                        await interaction.reply({
                            content: "You can't second this punishment (make sure you didn't suggest it yourself and it already exists)",
                            ephemeral: true
                        });
                        break;
                    }

                    const embed = new EmbedBuilder()
                        .setTitle("A new punishment has been added to the punishment roster!")
                        .setDescription(punishmentToSecond)
                        .setFooter({
                            text: `Seconded by ${interaction.user.username}`,
                            iconURL: interaction.user.avatarURL() ?? undefined
                        });

                    await interaction.reply({embeds: [embed]});
                } catch (error) {
                    console.error(error);
                    await interaction.reply({
                        content: "Something went wrong with seconding this punishment...",
                        ephemeral: true
                    });
                }
                break;
            default:
                await interaction.reply({content: "You need to pick a subcommand!", ephemeral: true});
        }
    },
    async autocomplete(interaction: AutocompleteInteraction) {
        const suggestedPunishments = await PunishmentService.getNonSeconded();
        const suggestedPunishmentDescriptions = suggestedPunishments
            .map(punishment => punishment.description);

        const focusedValue = interaction.options.getFocused();
        const filteredChoices = suggestedPunishmentDescriptions.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filteredChoices.map(choice => ({name: choice, value: choice}))
        );
    }
}