const Sequelize = require('sequelize');
const Discord = require('discord.js');
var pjson = require('../package.json');

const sweetyImagesSeq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'sweetyImages.sqlite',
});

//Model that defines the structure of the SweetyImages-database: More info: https://discordjs.guide/sequelize/#beta-creating-the-model
const SweetyImages = sweetyImagesSeq.define('sweetyImages', {
	id: {
        primaryKey: true,
		type: Sequelize.INTEGER,
        unique: true,
    },
    link: {
        type: Sequelize.STRING,
        unique: true,
    },
    usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

module.exports = {
	name: 'sweety',
	description: 'Send info about the current Hot-Lap-Challenge!',
	async execute(message, args) {

        var date = new Date();

        const sweetyEmbed = new Discord.MessageEmbed()
            .setColor('#6f77e9')
            .setTitle(`**Sweety**`)
            .addFields(
                { name: 'Username', value: message.member.user.tag},
                { name: 'Command', value: message.content},
                { name: 'Date', value: date}
            )
            .setThumbnail(message.member.user.displayAvatarURL({ format: 'jpg' }))
            .setTimestamp()
            .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
        const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
        channel.send(sweetyEmbed);

        try {
            const match = await SweetyImages.findOne({ order: Sequelize.literal('random()') })
            if(match) {
                match.increment('usage_count')
                return message.channel.send(match.link)
            }
            else {
                return message.channel.send('error')
            }
        } catch (e) {
            return message.channel.send("error: " + e)
        }
	}
};