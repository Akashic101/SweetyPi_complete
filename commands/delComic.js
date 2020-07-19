const Sequelize = require('sequelize');
const Discord = require('discord.js');
var pjson = require('../package.json');

const comicsSeq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'scomics.sqlite',
});

const comics = comicsSeq.define('comics', {
	id: {
        primaryKey: true,
		type: Sequelize.INTEGER,
        unique: true,
    },
    image: {
        type: Sequelize.STRING,
        unique: true,
    },
    instagram: {
		type: Sequelize.STRING,
        unique: true,
	},
});

module.exports = {
	name: 'delcomic',
	description: 'Send info about the current Hot-Lap-Challenge!',
	async execute(message, args) {

        const delComicEmbed = new Discord.MessageEmbed()
        .setColor('#991bad')
        .setTitle(`**Comic deleted**`)
        .addFields(
            { name: 'Username', value: message.member.user.tag},
            { name: 'Command', value: message.content},
            { name: 'Date', value: date},
            { name: 'image', value: args[0], inline: true},
            { name: 'instagram', value: args[1], inline: true}
        )
        .setThumbnail(message.member.user.displayAvatarURL({ format: 'jpg' }))
        .setTimestamp()
        .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
        const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
        channel.send(delComicEmbed);

        if (!message.member.roles.cache.has('641618875846492170')) {
            message.channel.send("I'm sorry, you do not have the permissions to do that. If you think this was a mistake please contact <@320574128568401920>")
            return
        }
        else if (args.length != 2) {
            message.channel.send("I'm sorry, it seems like you entered the command wrong. Please check if you entered it correcty or use !commands to see how your command should look like. If you believe there is an error, please contact <@320574128568401920>")
            return
        }
        else {
            try {
                for(var i = 0; i < args.length; i++) {
                    // equivalent to: DELETE from tags WHERE name = ?;
                    const rowCount = await comics.destroy({ where: { image: args[i] } });
    
                    if (!rowCount) {
                        message.channel.send('That comic did not exist.');
                    }
                    else {
                        message.channel.send('Comic ' + args[i] + ' deleted.');
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
	},
};