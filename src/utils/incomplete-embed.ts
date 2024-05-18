import {Colors, EmbedBuilder} from "discord.js";
import {ProgressService} from "@services/progress-service";

export const getIncompleteGoalsEmbed = async (warning?: boolean): Promise<EmbedBuilder> => {
    const incompleteGoals = await ProgressService.getAllUnfinished();

    let description = warning ? "5 minute warning! Auto-fails will be created for the below.\n\n" : "";

    incompleteGoals.sort((a, b) => a.discord_id.localeCompare(b.discord_id));

    for (const goal of incompleteGoals) {
        description += `- <@${goal.discord_id}>: ${goal.title} (${goal.completions}/${goal.frequency})\n`;
    }

    return new EmbedBuilder()
        .setTitle("Incomplete Goals")
        .setColor(Colors.Yellow)
        .setDescription(description);
}