import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Colors,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import {PunishmentService} from "@services/punishment-service";
import {FailureService} from "@services/failure-service";

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
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a suggested punishment")
                .addStringOption(option =>
                    option
                        .setName("description")
                        .setDescription("Description of the punishment to remove")
                        .setAutocomplete(true)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List all punishments")
                .addStringOption(option =>
                    option
                        .setName("scope")
                        .setDescription("List punishments in the roster, your pending punishments, or all pending punishments")
                        .setRequired(true)
                        .addChoices(
                            {name: "roster", value: "roster"},
                            {name: "mine", value: "mine"},
                            {name: "all", value: "all"}
                        )
                )
        ),
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
            case "remove":
                const punishmentToRemove = interaction.options.getString("description")!;
                try {
                    await PunishmentService.remove(punishmentToRemove);
                    await interaction.reply({
                        content: `Removed punishment '**${punishmentToRemove}'**`,
                        ephemeral: true
                    })
                } catch (error) {
                    console.error(error);
                    await interaction.reply({
                        content: `${error}`,
                        ephemeral: true
                    })
                }
                break;
            case "list":
                const scope = interaction.options.getString("scope")!;

                switch (scope) {
                    case "roster":
                        try {
                            const punishments = await PunishmentService.getAll();

                            let punishmentsString = "";
                            let prevWasSeconded = punishments[0].is_seconded;

                            punishments.sort((a, b) => {
                                if (!a.is_seconded && !b.is_seconded) {
                                    return a.id - b.id;
                                } else if (!a.is_seconded) {
                                    return 1;
                                } else if (!b.is_seconded) {
                                    return -1;
                                } else {
                                    return a.id - b.id;
                                }
                            });

                            for (let i = 0; i < punishments.length; i++) {
                                const punishment = punishments[i];
                                if (punishment.is_seconded) {
                                    punishmentsString += `- ${punishment.description}`;
                                } else if (prevWasSeconded) {
                                    prevWasSeconded = false;

                                    punishmentsString += "\n__Proposed punishments__\n";
                                    punishmentsString += `- ${punishment.description}`;
                                } else {
                                    punishmentsString += `- ${punishment.description}`;
                                }
                                punishmentsString += "\n";
                            }

                            const embed = new EmbedBuilder()
                                .setTitle("Punishments")
                                .setDescription(punishmentsString)
                                .setFooter({
                                    text: `Requested by ${interaction.user.username}`,
                                    iconURL: interaction.user.avatarURL() ?? undefined
                                });

                            await interaction.reply({embeds: [embed]});
                        } catch (error) {
                            console.error(error);
                            await interaction.reply({
                                content: "Something went wrong when listing all roster punishments...",
                                ephemeral: true
                            });
                        }
                        break;
                    case "mine":
                        try {
                            const failures = await FailureService.getActiveForUser(interaction.user);
                            if (failures.length === 0) {
                                await interaction.reply({
                                    content: "You don't have any pending failures. Nice work!",
                                    ephemeral: true
                                });
                            } else {
                                const embed = new EmbedBuilder()
                                    .setTitle(`Pending failures/punishments for ${interaction.user.username}`)
                                    .setThumbnail(interaction.user.displayAvatarURL())
                                    .setColor(Colors.Blurple);

                                for (const failure of failures) {
                                    const formattedFailedAt = new Date(failure.failed_at).toLocaleDateString();

                                    embed.addFields(
                                        {name: "Failed goal", value: `${failure.goals!.title} (${formattedFailedAt})`},
                                        {name: "Punishment", value: failure.punishments!.description}
                                    );
                                }

                                await interaction.reply({embeds: [embed]});
                            }
                        } catch (error) {
                            console.error(error);
                            await interaction.reply({
                                content: "Something went wrong when listing your punishments...",
                                ephemeral: true
                            });
                        }
                        break;
                    default:
                        try {
                            const allFailures = await FailureService.getAllActive();

                            if (allFailures.length === 0) {
                                await interaction.reply({
                                    content: "The group has no pending failures. Nice work!",
                                    ephemeral: true
                                });
                            } else {
                                const embed = new EmbedBuilder()
                                    .setTitle("All pending punishments")
                                    .setColor(Colors.Blurple);

                                let failsString = ""

                                for (const failure of allFailures) {
                                    failsString += `- ${failure.users!.username}: ${failure.punishments!.description}\n`
                                }

                                embed.setDescription(failsString);

                                await interaction.reply({embeds: [embed]});
                            }
                        } catch (error) {
                            console.error(error);
                            await interaction.reply({
                                content: "Something went wrong when listing all punishments...",
                                ephemeral: true
                            });
                        }
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