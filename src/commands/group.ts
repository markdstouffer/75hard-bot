import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import {GroupService} from "@services/group-service";
import {UserService} from "@services/user-service";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("group")
        .setDescription("A group of members taking part in the 75HARD challenge")
        .addSubcommand(subcommand =>
            subcommand
                .setName("init")
                .setDescription("Initialize an group"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("start")
                .setDescription("Set a start date/time for the group")
                .addStringOption(option =>
                    option
                        .setName("date")
                        .setDescription("The date to start on (format '01/01/2024')")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("join")
                .setDescription("Join an existing group")
                .addStringOption(option =>
                    option
                        .setName("group")
                        .setDescription("Choose the group you wish to join")
                        .setAutocomplete(true)
                        .setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        const fail = async () => await interaction.reply({
            content: "Something went wrong...",
            ephemeral: true
        });

        switch (subcommand) {
            case "init":
                try {
                    if (!interaction.guild) {
                        await fail();
                        break;
                    }
                    await GroupService.add(interaction.guild.id);

                    const embed = new EmbedBuilder()
                        .setTitle("A new 75HARD group has been initiated!")
                        .setDescription("Join using the `/group join` command.")
                        .setFooter({
                            text: `Initiated by ${interaction.user.username}`,
                            iconURL: interaction.user.avatarURL() ?? undefined
                        });

                    await interaction.reply({embeds: [embed]});
                } catch (error) {
                    console.error(error);
                    await fail();
                }
                break;
            case "start":
                const startDate = interaction.options.getString("date")!;
                const adjustedStartDate = new Date(startDate);

                try {
                    const group = await GroupService.getForUser(interaction.user);
                    const groupMembers = await UserService.getAllForGroup(group.id);
                    const groupMemberNames = groupMembers.map(member => member.username);

                    await GroupService.start(group.id, adjustedStartDate.toISOString());

                    const embed = new EmbedBuilder()
                        .setTitle("A group's start time has been set!")
                        .setDescription(`The group containing user(s) ${groupMemberNames.join(", ")} will begin on ${adjustedStartDate.toLocaleDateString()}.`)
                        .setFooter({
                            text: `Set by ${interaction.user.username}`,
                            iconURL: interaction.user.avatarURL() ?? undefined
                        });

                    await interaction.reply({embeds: [embed]});
                } catch (error) {
                    console.error(error);
                    await fail();
                }
                break;
            case "join":
                const group = interaction.options.getString("group")!;

                try {
                    await UserService.joinGroup(interaction.user, parseInt(group));
                    await interaction.reply({content: "You have joined the group!", ephemeral: true});
                } catch (error) {
                    console.error(error);
                    await fail();
                }
                break;
            default:
                await fail();
        }
    },
    async autocomplete(interaction: AutocompleteInteraction) {
        const groups = interaction.guild ? await GroupService.getAllForServer(interaction.guild.id) : [];
        const groupUsers = await Promise.all(groups.map(async group => {
            const users = await UserService.getAllForGroup(group.id);
            const selectionString = users.length > 0
                ? `Group ${group.id}: ` + users.map(user => user.username).join(", ")
                : `Group ${group.id} (no users have joined yet)`;
            return {
                id: group.id,
                content: selectionString
            }
        }));

        const focusedValue = interaction.options.getFocused();
        const filteredChoices = groupUsers.filter(choice => choice.content.startsWith(focusedValue));
        await interaction.respond(
            filteredChoices.map(choice => ({name: choice.content, value: choice.id.toString()}))
        );
    }
}