const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// Inisialisasi bot Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Menyimpan commands ke koleksi
client.commands = new Collection();

// Memuat command files
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Event: Bot siap
client.once('ready', () => {
    console.log(`${client.user.tag} is online and ready!`);
});

// Event: Saat command di-trigger
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
});

// Login ke Discord menggunakan token
client.login(process.env.BOT_TOKEN);
