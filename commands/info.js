var pjson = require('../package.json');
const Discord = require('discord.js');

module.exports = {
	name: 'info',
	description: 'Send info about the current Hot-Lap-Challenge!',
	execute(message, args) {

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