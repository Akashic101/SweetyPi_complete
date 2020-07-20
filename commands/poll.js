var pjson = require('../package.json');
const Discord = require('discord.js');

module.exports = {
	name: 'poll',
	description: 'Send info about the current Hot-Lap-Challenge!',
	execute(message, args) {

        var date = new Date()

        const pollEmbed = new Discord.MessageEmbed()
            .setColor('#f40cbe')
            .setTitle(`**Poll**`)
            .addFields(
                { name: 'Username', value: message.member.user.tag},
                { name: 'Command', value: message.content},
                { name: 'Date', value: date}
            )
            .setThumbnail(message.member.user.displayAvatarURL({ format: 'jpg' }))
            .setTimestamp()
            .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
        const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
        channel.send(pollEmbed);

        messageContent = message.content;

        try {
            let pollEmbed = new Discord.MessageEmbed()
			    .setTitle('**New Poll**')
			    .setDescription(message.author.username + ' wants to know: ' + messageContent.slice(6))
			    .setColor((Math.random()*0xFFFFFF<<0).toString(16))
			    .setTimestamp()
                .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
            message.channel.send(pollEmbed).then
                (message => message.react('👍')).then(
                (reaction => reaction.message.react('👎')))
        } catch (e) {
            console.log(e)
        }
	},
};