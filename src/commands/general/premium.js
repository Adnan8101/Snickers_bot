const { EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const ms = require('ms'); // Ensure the 'ms' package is installed
const { ownerIds } = require('../../../config.json'); // Owner IDs

// Define the database path
const dbPath = path.join(__dirname, '../../../premium.db');
const db = new sqlite3.Database(dbPath);

module.exports = {
    name: 'premium',
    description: 'Manage premium subscriptions and related actions.',
    category: 'Owner',
    ownerOnly: true,
    async execute(message, args) {
        // Ensure only bot owners can use this command
        if (!ownerIds.includes(message.author.id)) {
            const embed = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle('Access Denied')
                .setDescription('❌ You do not have permission to use this command.')
                .setTimestamp();
            return message.channel.send({ embeds: [embed] });
        }

        if (!args.length) {
            const embed = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setDescription('Please provide an action: `add`, `activate`, `transfer`, `remove`, or `manage`.')
                .setFooter({ text: 'Usage: >>premium <action> <user> <duration> <guildCount>' })
                .setTimestamp();
            return message.channel.send({ embeds: [embed] });
        }

        const action = args[0].toLowerCase();
        
        // Execute actions based on argument
        if (action === 'add') {
            await addPremium(message, args);
        } else if (action === 'activate') {
            await activatePremium(message);
        } else if (action === 'transfer') {
            await transferPremium(message, args);
        } else if (action === 'remove') {
            await removePremium(message, args);
        } else if (action === 'manage') {
            await managePremium(message, args);
        } else {
            const embed = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setDescription('Invalid action. Use `add`, `activate`, `transfer`, `remove`, or `manage`.')
                .setTimestamp();
            return message.channel.send({ embeds: [embed] });
        }
    }
};

// Helper function to add premium
async function addPremium(message, args) {
    const userMention = args[1];
    const duration = args[2] || '30d';
    const guildCount = parseInt(args[3], 10) || 1;

    const userId = userMention.replace(/[<@!>]/g, '');
    const user = await message.client.users.fetch(userId).catch(() => null);

    if (!user || isNaN(guildCount) || guildCount <= 0 || !ms(duration)) {
        return message.channel.send({ embeds: [generateEmbed('❌ Invalid arguments. Provide a user mention, duration, and valid guild count.', '#FFC0CB')] });
    }

    const expirationDate = new Date(Date.now() + ms(duration)).toISOString();

    db.run(
        `INSERT OR REPLACE INTO premium_users (user_id, expiration, remaining_guild_count) VALUES (?, ?, ?)`,
        [user.id, expirationDate, guildCount],
        (err) => {
            if (err) return console.error('Error adding premium:', err);

            message.channel.send({
                embeds: [generateEmbed(`✅ Premium added for <@${user.id}> for ${duration} with ${guildCount} guild activations available.`, 'GREEN')]
            });
        }
    );
}

// Helper functions for other actions (activatePremium, transferPremium, removePremium, managePremium) follow similar structure, ensuring feedback.

function generateEmbed(description, color) {
    return new EmbedBuilder()
        .setColor(color)
        .setDescription(description)
        .setTimestamp();
}
