import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
    User
} from "discord.js";
import {GoalService} from "@services/goal-service";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("goal")
        .setDescription("Things you commit to do for the remainder of the challenge")
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List all of your goals")
                .addMentionableOption(option =>
                    option
                        .setName("user")
                        .setDescription("List all goals for this user")
                        .setRequired(false)))
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
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Mark one of your goals as inactive")
                .addStringOption(option =>
                    option
                        .setName("title")
                        .setDescription("Title of the goal to remove")
                        .setAutocomplete(true)
                        .setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "add":
                const title = interaction.options.getString("title")!;
                const description = interaction.options.getString("description");
                const isDaily = interaction.options.getBoolean("is_daily");
                try {
                    await GoalService.add(interaction.user, title, description, isDaily);
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
            case "list":
                const givenUser = interaction.options.getMentionable("user");
                const user = givenUser
                    ? (givenUser as GuildMember).user
                    : interaction.user;

                try {
                    const goals = await GoalService.getAllActiveForUser(user);

                    if (goals.length === 0) {
                        await interaction.reply({content: `User ${user.username} has no goals set. \`/goal add\``});
                        break;
                    }

                    let goalsString = "";
                    let prevWasDaily = goals[0].is_daily;

                    goals.sort((a, b) => {
                       if (!a.is_daily && !b.is_daily) {
                           return a.id - b.id;
                       } else if (!a.is_daily) {
                           return 1;
                       } else if (!b.is_daily) {
                           return -1;
                       } else {
                           return a.id - b.id;
                       }
                    });

                    for (let i = 0; i < goals.length; i++) {
                        const goal = goals[i];
                        if (goal.is_daily) {
                            goalsString += `- ${goal.title}`;
                        } else if (prevWasDaily) {
                            prevWasDaily = false;

                            goalsString += "\n__Non-Daily Goals__\n";
                            goalsString += `- ${goal.title}`;
                        } else {
                            goalsString += `- ${goal.title}`;
                        }
                        goalsString += "\n";
                    }

                    const embed = new EmbedBuilder()
                        .setTitle(`75HARD Goals for ${user.username}`)
                        .setDescription(goalsString)
                        .setThumbnail(user.avatarURL());

                    await interaction.reply({embeds: [embed]});
                } catch (error) {
                    console.error(error);
                    await interaction.reply({
                        content: "Something went wrong when trying to fetch your goals...",
                        ephemeral: true
                    });
                }
                break;
            case "remove":
                const goalToRemove = interaction.options.getString("title")!;

                try {
                    const updateResponse = await GoalService.markInactive(parseInt(goalToRemove));
                    const updatedGoal = updateResponse[0];

                    await interaction.reply({content: `You have marked goal **${updatedGoal.title}** as inactive.`, ephemeral: true});
                } catch (error) {
                    console.error(error);
                    await interaction.reply({
                        content: "Something went wrong when trying to mark this goal inactive...",
                        ephemeral: true
                    });
                }

                break;
            default:
                await interaction.reply({content: "You need to pick a subcommand!", ephemeral: true});
        }
    },
    async autocomplete(interaction: AutocompleteInteraction) {
        const userGoals = await GoalService.getAllActiveForUser(interaction.user);
        const userGoalsData = userGoals.map(goal => ({
            name: goal.title,
            value: goal.id
        }));

        const focusedValue = interaction.options.getFocused();
        const filteredChoices = userGoalsData.filter(choice => choice.name.startsWith(focusedValue));
        await interaction.respond(
            filteredChoices.map(choice => ({name: choice.name, value: choice.value.toString()}))
        );
    }
}