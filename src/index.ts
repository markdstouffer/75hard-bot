import {Client, Collection, Events, GatewayIntentBits, REST, Routes} from "discord.js";
import {configDotenv} from "dotenv";
import * as fs from "node:fs";
import * as path from "node:path";

configDotenv();

const BOT_TOKEN = process.env.BOT_TOKEN!;
const CLIENT_ID = process.env.CLIENT_ID!;
const GUILD_ID = process.env.GUILD_ID!;

const client = new Client({intents: [GatewayIntentBits.Guilds]});
client.commands = new Collection();
const commands: any[] = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data);
    }

}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    const rest = new REST().setToken(BOT_TOKEN);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            const data: any = await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                {body: commands},
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();

});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    if (interaction.isChatInputCommand()) {
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({content: "There was an error while executing this command!", ephemeral: true});
            } else {
                await interaction.reply({content: "There was an error while executing this command!", ephemeral: true});
            }
        }
    } else {
        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(error);
        }
    }
});


client.login(BOT_TOKEN);