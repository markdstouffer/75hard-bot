import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {UserService} from "@services/user-service";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join the 75HARD challenge"),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await UserService.addUser(interaction.user)
            await interaction.reply({content: "You have joined the 75HARD challenge!", ephemeral: true});
        } catch (error) {
            console.error(error);
            await interaction.reply({content: "Something went wrong with adding you to the DB...", ephemeral: true});
        }
    }
}