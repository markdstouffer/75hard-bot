import {FailurePunishment} from "@internalTypes/database";
import {PunishmentService} from "@services/punishment-service";
import {FailureService} from "@services/failure-service";
import {Colors, EmbedBuilder, Snowflake, TextBasedChannel} from "discord.js";
import {ProgressService} from "@services/progress-service";

const shouldAutoFail = async (goalId: number, weekCompletions: number, goalFrequency: number | null): Promise<boolean> => {
    if (!goalFrequency || weekCompletions >= goalFrequency) return false;

    const failures = await FailureService.getByGoalIdForWeek(goalId);

    return (failures.length + weekCompletions) < goalFrequency;
}

export const generateFailure = async (goalTitle: string, discordId: Snowflake): Promise<FailurePunishment> => {
    const randomPunishment = await PunishmentService.getRandom();

    const failure = await FailureService.add(discordId, goalTitle, randomPunishment.id);

    return {
        failure,
        punishment: randomPunishment,
        discordId,
        goalTitle
    }
}

export const autoFail = async (channel: TextBasedChannel): Promise<void> => {
    const unfinishedGoals = await ProgressService.getAllUnfinished();

    const newFailures: FailurePunishment[] = [];

    for (const unfinishedGoal of unfinishedGoals) {
        if (await shouldAutoFail(unfinishedGoal.id, unfinishedGoal.completions, unfinishedGoal.frequency)) {
            newFailures.push(await generateFailure(unfinishedGoal.title, unfinishedGoal.discord_id));
        }
    }

    const embed = new EmbedBuilder()
        .setTitle("Auto-failures for the week")
        .setColor(Colors.Red);

    newFailures.forEach(fail => {
        embed.addFields({value: `<@${fail.discordId}> failed '${fail.goalTitle}'`, name: `${fail.punishment.description}`});
    });

    await channel.send({embeds: [embed]});
}