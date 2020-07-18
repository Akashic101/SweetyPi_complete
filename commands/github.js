const Sequelize = require('sequelize');
const Discord = require('discord.js');
const client = new Discord.Client();
var pjson = require('../package.json');

const socialMediaSeq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'socialMedia.sqlite',
});

//Model that defines the structure of the Social-Media-database: More info: https://discordjs.guide/sequelize/#beta-creating-the-model
const SocialMedia = socialMediaSeq.define('socialmedia', {
	platform: {
		type: Sequelize.STRING,
	},
	username: {
		type: Sequelize.STRING,
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
	name: 'github',
	description: 'Send info about the current Hot-Lap-Challenge!',
	async execute(message, args) {

        if (args.length != 1) {
            return message.channel.send("I'm sorry, it seems like you entered the command wrong. Please check if you entered it correcty or use !commands to see how your command should look like. If you believe there is an error, please contact <@320574128568401920>") 
        }
        else {
            try {
                const match = await SocialMedia.findOne({where: {platform: "github", username: args[0]}});
                if(match) {
                    match.increment('usage_count');
                    return message.channel.send('You can find the ' + match.platform + ' of ' + match.username + ' here: ' + match.link);
                }
                else {
                    return message.channel.send('I could not find that profile on that platform');
                }
            }
            catch (e) {
                message.channel.send('Could not find tag');
                return console.log(e);
            }
        }
	}
};