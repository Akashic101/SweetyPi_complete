const Sequelize = require('sequelize');
const Discord = require('discord.js');

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
	name: 'addsweety',
	description: 'Send info about the current Hot-Lap-Challenge!',
	async execute(message, args) {

        if (!message.member.roles.cache.has('641618875846492170')) {
            return message.channel.send("I'm sorry, you do not have the permissions to do that. If you think this was a mistake please contact <@320574128568401920>")
        }
        else if (args.length != 1) {
            return message.channel.send("I'm sorry, it seems like you entered the command wrong. Please check if you entered it correcty or use !commands to see how your command should look like. If you believe there is an error, please contact <@320574128568401920>")
        }
        else {
            try {
                for(var i = 0; i < args.length; i++) {
                    const add = await SweetyImages.create({
                        link: args[i]
                    });
                    message.channel.send(`Link ${add.link} added.`);
                }
            } catch (e) {
                if (e.link === 'SequelizeUniqueConstraintError') {
                    return message.channel.send('That link already exists.');
                }
                return message.channel.send('Something went wrong with adding a link.');
            }
        }
	},
};