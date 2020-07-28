var pjson = require('../package.json');
const Discord = require('discord.js');

module.exports = {
	name: 'commands',
	description: 'Sends a list about every available command',
	execute(client, message, args) {

        var date = new Date();

        const commandLogEmbed = new Discord.MessageEmbed()
        .setColor('#73547e')
        .setTitle(`**Commands**`)
        .addFields(
            { name: 'Username', value: message.member.user.tag},
            { name: 'Command', value: message.content},
            { name: 'Date', value: date}
        )
        .setThumbnail(message.member.user.displayAvatarURL({ format: 'jpg' }))
        .setTimestamp()
        .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
        const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
        channel.send(commandLogEmbed);

        let commandEmbed = new Discord.MessageEmbed()
            .setTitle('Commands')
            .setDescription('Every social-media command has two versions. If you just write the command itself you get a link to Redfur\'s platform there. If you however use !platform accountName you get a link to the corresponding account if that person added it to our database')
            .setURL('https://github.com/Akashic101/SweetyPi#commands')
            .setColor((Math.random()*0xFFFFFF<<0).toString(16))
            .addFields(
                { name: '!instagram', value: 'For instagram-profiles', inline: true},
                { name: '!twitch', value: 'For twitch-profiles', inline: true},
                { name: '!patreon', value: 'For patreon-profiles', inline: true},
                { name: '!twitter', value: 'For twitter-profiles', inline: true},
                { name: '!facebook', value: 'For facebook-profiles', inline: true},
                { name: '!reddit', value: 'For reddit-profiles', inline: true},
                { name: '!website', value: 'For website-profiles', inline: true},
                { name: '!github', value: 'For github-profiles', inline: true},
                { name: '!etsy', value: 'For etsy-profiles', inline: true},
                { name: '\u200b', value: '\u200b'},
                { name: '!link <platform> <link.to.website>', value: 'Adds your account to our database'},
                { name: '\u200b', value: '\u200b'},
                { name: '!sweety', value: 'Sends you a random pic/video of Sweety', inline: true},
                { name: '!comic', value: 'Sends you a random comic', inline: true},
                { name: '\u200b', value: '\u200b'},
                { name: '!uptime', value: 'Displays how long SweetyPi is online', inline: true},
                { name: '!info', value: 'Shows general info', inline: true},
                { name: '!command', value: 'Lists every command avalaible', inline: true},
                { name: '!help', value: 'Givey you a general idea where to find assistance', inline: true},
                { name: '!poll <text>', value: 'Creates a poll members can vote on using :thumbsup: or :thumbsdown: ', inline: true},
                { name: '!corona <country>', value: 'Lists the current informations available about the specified country ', inline: true}
            )
            .setTimestamp()
            .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png')
        message.channel.send(commandEmbed);
	},
};