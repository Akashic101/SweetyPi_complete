var pjson = require('../package.json');
const Discord = require('discord.js');

module.exports = {
	name: 'info',
	description: 'Send info about the current Hot-Lap-Challenge!',
	execute(message, args) {

        var date = new Date();

        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#f21d31')
            .setTitle(`**help**`)
            .addFields(
                { name: 'Username', value: message.member.user.tag},
                { name: 'Command', value: message.content},
		    	{ name: 'Date', value: date}
            )
            .setThumbnail(message.member.user.displayAvatarURL({ format: 'jpg' }))
            .setTimestamp()
            .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
        const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
        channel.send(helpEmbed);

        let infoEmbed = new Discord.MessageEmbed()
            .setTitle('info')
            .setURL('https://github.com/Akashic101/SweetyPi')
            .setColor((Math.random()*0xFFFFFF<<0).toString(16))
            .addFields(
                { name: 'Creator', value: pjson.author, inline: true},
                { name: 'Version', value: pjson.version, inline: true}
            )
            .setTimestamp()
            .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png')
        message.channel.send(infoEmbed);
	},
};