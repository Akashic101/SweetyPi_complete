const Discord = require('discord.js');
var pjson = require('../package.json');

module.exports = {
	name: 'roll',
	description: 'Send info about the current Hot-Lap-Challenge!',
	execute(message, args) {

        const rollEmbed = new Discord.MessageEmbed()
            .setColor('#928d58')
            .setTitle(`**Roll**`)
            .addFields(
                { name: 'Username', value: message.member.user.tag},
                { name: 'Command', value: message.content},
                { name: 'Date', value: date}
            )
            .setThumbnail(message.member.user.displayAvatarURL({ format: 'jpg' }))
            .setTimestamp()
            .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
        const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
        channel.send(rollEmbed);

        if(args.length == 2) {
            message.channel.send('Your random number is: ' + Math.floor((Math.random() * args[1]) + args[0]))
        }
        else if(args.length == 1) {
            message.channel.send('Your random number is: ' + Math.floor((Math.random() * 6) + args[0]))
        }
        else if(args.length == 0) {
            message.channel.send('Your random number is: ' + Math.floor((Math.random() * 6) + 1))
        }
        else {
            message.channel.send('Something broke and I don\'t know what. Please try again')
        }
	},
};