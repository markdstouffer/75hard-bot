import {
    ChatInputCommandInteraction, Colors,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import {ProgressService} from "@services/progress-service";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("progress")
        .setDescription("See the progress of your tracked goals"),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const trackedProgress = await ProgressService.getForUserThisWeek(interaction.user);

            if (trackedProgress.length === 0) {
                await interaction.reply({content: "You have no tracked goals. `/goal add`", ephemeral: true});
            } else {
                trackedProgress.sort((a, b) => a.goal_id - b.goal_id);

                const embed = new EmbedBuilder()
                    .setTitle(`Weekly progress for ${interaction.user.username}`)
                    .setColor(Colors.Blurple)
                    .setThumbnail(interaction.user.avatarURL());

                let progressString = "";

                for (const progress of trackedProgress) {
                    progressString += `- **${progress.completions}/${progress.goals!.frequency}**: *${progress.goals!.title}*\n`;
                }

                embed.setDescription(progressString);

                await interaction.reply({embeds: [embed]});
            }

        } catch (error) {
            console.error(error);
            await interaction.reply({content: "Something went wrong while listing your progress...", ephemeral: true});
        }
    }
}