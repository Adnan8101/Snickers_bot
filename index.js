const { Client, GatewayIntentBits, Events, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();
const ownerIds = config.ownerIds || [];

// Database setup
const dbPath = path.join(__dirname, './noprefix.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('❌ Could not connect to SQLite database:', err);
    } else {
        console.log('✅ Connected to the SQLite database.');
    }
});

// Load commands from command folders
const loadCommands = () => {
    const commandFolders = fs.readdirSync('./src/commands');
    for (const folder of commandFolders) {
        const folderPath = path.join(__dirname, 'src', 'commands', folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./src/commands/${folder}/${file}`);
                if (command.name) {
                    client.commands.set(command.name, command);
                    console.log(`✅ Command loaded: ${command.name}`);
                }
            }
        }
    }
};

// Load utilities from utils folder
const loadUtils = () => {
    const utilsPath = path.join(__dirname, 'src', 'utils');
    const utilFiles = fs.readdirSync(utilsPath).filter(file => file.endsWith('.js'));

    for (const file of utilFiles) {
        require(`./src/utils/${file}`);
        console.log(`✅ Utility loaded: ${file}`);
    }
};

// Register slash commands with Discord API
const registerSlashCommands = async () => {
    const commands = [];
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./src/commands/${file}`);
        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST({ version: '10' }).setToken(config.token);

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('❌ Error registering slash commands:', error);
    }
};

client.once(Events.ClientReady, () => {
    console.log(`🎉 Bot is logged in as ${client.user.tag}`);
    client.user.setActivity('music | Type !help', { type: 'LISTENING' });

    // Register commands only once when bot is ready
    registerSlashCommands();
});

const isNoPrefixUser = (userId) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT user_id FROM noprefix WHERE user_id = ?", [userId], (err, row) => {
            if (err) {
                console.error('❌ Error querying no-prefix users:', err);
                return reject(err);
            }
            resolve(!!row);
        });
    });
};

// Handle message events for prefix commands and slash commands
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    const prefix = config.prefix;
    const userIsNoPrefix = await isNoPrefixUser(message.author.id);
    const startsWithPrefix = message.content.startsWith(prefix);
    const isBotMentioned = message.mentions.has(client.user);

    if (isBotMentioned && !ownerIds.includes(message.author.id)) {
        return message.reply("The bot is currently under development and can only be used by developers for testing and debugging purposes.");
    }

    if (ownerIds.includes(message.author.id)) {
        if (!userIsNoPrefix && !startsWithPrefix) {
            return; // Ignore non-prefixed messages if the owner is not in the no-prefix list
        }
        const args = startsWithPrefix ? message.content.slice(prefix.length).trim().split(/ +/) : message.content.trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);

        if (command) {
            try {
                await command.execute(message, args);
            } catch (error) {
                console.error(`Error executing command ${commandName}:`, error);
                message.reply('There was an error executing that command.');
            }
        }
    } else {
        if (!userIsNoPrefix && !startsWithPrefix) return; // Ignore non-prefixed messages if the user is not in the no-prefix list

        const args = startsWithPrefix ? message.content.slice(prefix.length).trim().split(/ +/) : message.content.trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);

        if (!command) {
            return; // If no command is found, do not respond
        }

        if (command.category === 'Voice channel') {
            try {
                await command.execute(message, args);
            } catch (error) {
                console.error(`Error executing command ${commandName}:`, error);
                message.reply('There was an error executing that command.');
            }
        } else {
            message.reply("The bot is currently under development and can only be used by developers for testing and debugging purposes.");
        }
    }
});

// Handle slash command interactions
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('❌ Error executing slash command:', error);
        await interaction.reply({ content: 'There was an error while executing that command!', ephemeral: true });
    }
});

// Load commands and utilities
loadCommands();
loadUtils();

// Log in to Discord
client.login(config.token)
    .then(() => {
        console.log('✅ Logged into Discord successfully.');
    })
    .catch(err => {
        console.error('❌ Failed to log in to Discord:', err);
    });

// Ensure that the database connection is closed when the bot exits
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('❌ Error closing the database connection:', err);
        } else {
            console.log('✅ Database connection closed.');
        }
    });
});
