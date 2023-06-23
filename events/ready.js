const { Events } = require('discord.js');
const Discord = require('discord.js');  

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        client.user.setActivity('/help for commands', { type: Discord.ActivityType.Playing })
        console.log(`Logged in as ${client.user.tag}`);
        console.log(client.guilds.cache.size);
        console.log(client.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c));

        // const channel = await client.channels.fetch("899473218824441926");
        // const msg = await channel.messages.fetch("1108048174087688304");
        // await msg.reply("https://discord.com/channels/899473218333708330/1100453543820931173/1108043889618735185 \nSkill issue frfr");
	},
};