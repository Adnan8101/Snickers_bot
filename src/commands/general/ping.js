const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Show bot’s latency and uptime.',
    category: 'General',
    async execute(context) {
        // Check if the context is a slash command interaction or a text message
        const isInteraction = context.isCommand?.(); // Checks if it's an interaction

        if (isInteraction) {
            // Interaction (Slash Command)
            const sent = await context.reply({ content: 'Pinging...', fetchReply: true });
            const latency = sent.createdTimestamp - context.createdTimestamp;
            const wsPing = context.client.ws.ping;

            await context.editReply(`🏓 Round-trip Latency: ${latency}ms\n⏱️ WebSocket Ping: ${wsPing}ms`);
        } else {
            // Message (Text Command)
            const sentMessage = await context.channel.send('Pinging...');
            const latency = sentMessage.createdTimestamp - context.createdTimestamp;
            const wsPing = context.client.ws.ping;

            // Create an embed for the response
            const embed = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle('🏓 Pong!')
                .setDescription(`**Round-trip Latency:** ${latency}ms\n**WebSocket Ping:** ${wsPing}ms`)
                .setTimestamp()
                .setFooter({ text: 'Ping command executed' });

            await sentMessage.edit({ content: null, embeds: [embed] });
        }
    },
};
