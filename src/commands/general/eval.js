const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ownerIds } = require('../../../config.json'); // Owner IDs from config

module.exports = {
    name: 'eval',
    description: 'Evaluates JavaScript code and provides output for bot owners.',
    category: 'Owner',
    ownerOnly: true,
    async execute(message, args) {
        // Verify if the user is an owner
        if (!ownerIds.includes(message.author.id)) {
            const embed = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle('Access Denied')
                .setDescription('❌ You do not have permission to use this command.')
                .setTimestamp();
            return message.channel.send({ embeds: [embed] });
        }

        const code = args.join(' ');
        let result;

        try {
            // Evaluate the code
            result = eval(code);
            if (result instanceof Promise) result = await result; // Await if result is a Promise
        } catch (error) {
            result = error.message; // Capture errors
        }

        // Result embed for `eval`
        const evalEmbed = new EmbedBuilder()
            .setColor('#FFC0CB')
            .setTitle('📜 Eval Command Executed')
            .addFields(
                { name: 'Input:', value: `\`\`\`javascript\n${code}\n\`\`\``, inline: false },
                { name: 'Output:', value: `\`\`\`\n${result}\n\`\`\``, inline: false }
            )
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // Delete button for security and cleanup
        const deleteButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('delete_eval')
                .setEmoji('🗑️') // Trash icon for delete button
                .setStyle(ButtonStyle.Danger)
                .setLabel('Delete')
        );

        const msg = await message.channel.send({ embeds: [evalEmbed], components: [deleteButton] });

        // Button interaction for deleting the message
        const filter = i => i.customId === 'delete_eval' && i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            await msg.delete(); // Delete the message with the embed
            await i.reply({ content: 'Message deleted.', ephemeral: true });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                msg.edit({ components: [] }); // Remove button if not clicked
            }
        });
    }
};
