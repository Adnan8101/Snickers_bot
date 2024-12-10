const { EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { ownerIds } = require('../../../config.json'); // Owner IDs from config

const dbPath = path.join(__dirname, '../../../noprefix.db');
const db = new sqlite3.Database(dbPath);

module.exports = {
    name: 'noprefix',
    aliases: ['np'],
    description: 'Manage users who can use commands without a prefix.',
    category: 'Owner',
    ownerOnly: true,
    async execute(message, args) {
        if (!ownerIds.includes(message.author.id)) {
            const embed = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle('Access Denied')
                .setDescription('❌ You do not have permission to use this command.')
                .setTimestamp();
            return message.channel.send({ embeds: [embed] });
        }

        if (args.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle('Invalid Command Usage')
                .setDescription('Please provide an action: `add`, `remove`, or `show`.')
                .setFooter({ text: 'Usage: >>noprefix <add/remove/show> <user>' })
                .setTimestamp();
            return message.channel.send({ embeds: [embed] });
        }

        const action = args[0].toLowerCase();
        const userId = args[1] ? args[1].replace(/[<@!>]/g, '') : null;

        if (action === 'add') {
            if (!userId) {
                return message.channel.send({ embeds: [new EmbedBuilder().setColor('#FFC0CB').setDescription('❌ Please provide a valid user ID or mention.')] });
            }

            const targetUser = await message.client.users.fetch(userId).catch(() => null);
            if (!targetUser) {
                return message.channel.send({ embeds: [new EmbedBuilder().setColor('#FFC0CB').setDescription('❌ Could not find the specified user.')] });
            }

            db.get(`SELECT * FROM noprefix WHERE user_id = ?`, [userId], (err, row) => {
                if (err) return console.error('Database Error:', err);
                if (row) {
                    return message.channel.send({ embeds: [new EmbedBuilder().setColor('#FFC0CB').setDescription(`❌ User <@${userId}> is already in the no-prefix list.`)] });
                }

                db.run(`INSERT INTO noprefix (user_id, username) VALUES (?, ?)`, [userId, targetUser.username], (err) => {
                    if (err) return console.error('Error adding user to no-prefix list:', err);
                    message.channel.send({ embeds: [new EmbedBuilder().setColor('#FFC0CB').setDescription(`✅ User <@${userId}> has been added to the no-prefix list.`)] });
                });
            });
        } else if (action === 'remove') {
            if (!userId) {
                return message.channel.send({ embeds: [new EmbedBuilder().setColor('#FFC0CB').setDescription('❌ Please provide a valid user ID or mention.')] });
            }

            db.get(`SELECT * FROM noprefix WHERE user_id = ?`, [userId], (err, row) => {
                if (err) return console.error('Database Error:', err);
                if (!row) {
                    return message.channel.send({ embeds: [new EmbedBuilder().setColor('#FFC0CB').setDescription(`❌ User <@${userId}> is not in the no-prefix list.`)] });
                }

                db.run(`DELETE FROM noprefix WHERE user_id = ?`, [userId], (err) => {
                    if (err) return console.error('Error removing user from no-prefix list:', err);
                    message.channel.send({ embeds: [new EmbedBuilder().setColor('#FFC0CB').setDescription(`✅ User <@${userId}> has been removed from the no-prefix list.`)] });
                });
            });
        } else if (action === 'show') {
            db.all(`SELECT * FROM noprefix`, [], (err, rows) => {
                if (err) return console.error('Database Error:', err);

                const embed = new EmbedBuilder()
                    .setColor('#FFC0CB')
                    .setTitle('No-Prefix Users List')
                    .setDescription(rows.length ? 'Users who can use commands without a prefix:' : 'No users in the no-prefix list.');

                if (rows.length > 0) {
                    rows.forEach((row, index) => {
                        embed.addFields({ name: `${index + 1}. ${row.username}`, value: `ID: ${row.user_id}`, inline: false });
                    });
                }

                message.channel.send({ embeds: [embed] });
            });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setDescription('Invalid action. Please use `add`, `remove`, or `show`.')
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
        }
    }
};
