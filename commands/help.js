
var pjson = require('../package.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Send info about the current Hot-Lap-Challenge!',
	execute(message, args) {
        let helpEmbed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setURL('https://github.com/Akashic101/SweetyPI#features')
			.setColor((Math.random()*0xFFFFFF<<0).toString(16))
			.addFields(
                { name: 'Commands', value: 'To get a list with all commands avalaible please use **!commands**'},
                { name: 'Rules', value: 'If you see something that breaks the rules please use the corresponding emote, for example :six: when someone breaks Rule 6'},
                { name: 'Questions', value: 'In case you have questions about rules or other topics regarding this server please don\'t hesitate to contact an Admin'},
                { name: 'SweetyPi', value: 'In case you have questions this bot, feel free to DM <@320574128568401920>'}
            )
            .setTimestamp()
            .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png')
        return message.channel.send(helpEmbed);
	},
};