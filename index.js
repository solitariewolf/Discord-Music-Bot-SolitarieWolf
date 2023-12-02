require("dotenv").config();

const {REST} = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Player } = require("discord-player");
const { YouTubeExtractor } = require('@discord-player/extractor');


const fs = require("node:fs");
const path = require("node:path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ]
})

//carregar todos os comandos
const commands = [];
client.commands =  new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandsFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.player = new Player(client, {
    ytdlOptions: {
        quality:"highestaudio",
        highWaterMark: 1 << 25
    }
});

// Carrega os extratores padrão
client.player.extractors.register(YouTubeExtractor);

client.on("ready", () => {
    const guilds_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({version: "9"}).setToken(process.env.TOKEN);
    for (const guildId of guilds_ids)
    {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),{
            body: commands
        })
        .then(() =>console.log('Added commands to ${guildId}'))
        .catch(console.error);
    }
})

client.on("interactionCreate", async interaction =>{
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {
        await command.execute({client, interaction});
    }
    catch(err)
    {
        console.error(err);
        await interaction.reply("Ocorreu um erro ao tentar executar este comando.");
    }
});

client.login(process.env.TOKEN);