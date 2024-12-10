const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'profile',
    description: 'Display detailed user profile information.',
    category: 'General',
    async execute(message, args) {
        try {
            const user = message.mentions.users.first() || message.author;
            const member = await message.guild.members.fetch(user.id);

            const createdAgo = Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24 * 365));
            const joinedAgo = Math.floor((new Date() - member.joinedAt) / (1000 * 60 * 60 * 24 * 365));

            const embed = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle(`${user.username}'s Profile`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Account Created', value: `${createdAgo} years ago`, inline: true },
                    { name: 'Joined Server', value: `${joinedAgo} years ago`, inline: true },
                    { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: false }
                )
                .setFooter({ text: `User ID: ${user.id}` })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching profile:', error);
            const embed = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle('Error')
                .setDescription('There was an error fetching the profile.')
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
        }
    },
};
