const { EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'stats',
    description: 'Displays the bot’s cute status information',

    async execute(message) {
        const ownerIds = ['563766170675576873', '1198364874623942738'];
        
        if (!ownerIds.includes(message.author.id)) {
            return message.reply("🐣 Sorry! The bot is under development and only owners can use it right now.");
        }

        const { version: discordJsVersion } = require('discord.js');
        const nodeVersion = process.version;
        const uptime = process.uptime();
        const memoryUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
        const cpuModel = os.cpus()[0].model;
        const operatingSystem = `${os.type()} ${os.release()}`;
        const totalGuilds = message.client.guilds.cache.size;
        const wsPing = message.client.ws.ping;

        // Calculate round-trip latency
        const sentMessage = await message.channel.send("Calculating ping...");
        const roundTripLatency = sentMessage.createdTimestamp - message.createdTimestamp;

        // Get total unique members across all guilds
        const allMembers = new Set();
        message.client.guilds.cache.forEach(guild => {
            guild.members.cache.forEach(member => allMembers.add(member.id));
        });
        const totalUniqueUsers = allMembers.size;

        // Format the bot uptime
        const formatUptime = () => {
            let seconds = Math.floor(uptime);
            const days = Math.floor(seconds / (3600 * 24));
            seconds %= 3600 * 24;
            const hours = Math.floor(seconds / 3600);
            seconds %= 3600;
            const minutes = Math.floor(seconds / 60);
            seconds %= 60;
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        };

        // Create and send the embed message
        const embed = new EmbedBuilder()
            .setColor('#FFB6C1') // Soft pink color for a cute look
            .setTitle('🌸 Bot Status 🌸')
            .setThumbnail(message.client.user.displayAvatarURL())
            .setDescription("Here's how the bot is doing! 💖")
            .addFields(
                { name: '⏳ Bot Uptime', value: `**${formatUptime()}**`, inline: false },
                { name: '🌐 Servers Count', value: `**${totalGuilds}**`, inline: false },
                { name: '🏓 WebSocket Ping', value: `**${wsPing}ms**`, inline: false },
                { name: '🔄 Round-trip Latency', value: `**${roundTripLatency}ms**`, inline: false },
                { name: '🧠 Memory Usage', value: `**${memoryUsage} MB**`, inline: false },
                { name: '💻 CPU Model', value: `**${cpuModel}**`, inline: false },
                { name: '🖥️ OS', value: `**${operatingSystem}**`, inline: false },
                { name: '📦 Node.js', value: `**${nodeVersion}**`, inline: false },
                { name: '✨ Discord.js', value: `**${discordJsVersion}**`, inline: false },
                { name: '📜 Loaded Commands', value: `**${message.client.commands.size}**`, inline: false },
                { name: '💡 Developer Mode', value: `**Enabled**`, inline: false }
            )
            .setFooter({ 
                text: `✨ Requested by ${message.author.tag} ✨`, 
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        // Edit the initial message to include the embed
        await sentMessage.edit({ content: null, embeds: [embed] });
    }
};
