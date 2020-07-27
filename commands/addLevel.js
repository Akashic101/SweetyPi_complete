const Discord = require('discord.js');
var pjson = require('../package.json');
const Sequelize = require('sequelize');

const levelSeq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'level.sqlite',
});


//Model that defines the structure of the SweetyImages-database: More info: https://discordjs.guide/sequelize/#beta-creating-the-model
const xp = levelSeq.define('xp', {
	id: {
    primaryKey: true,
	type: Sequelize.INTEGER,
    unique: true,
  },
  level: {
    type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
  },
  minimum: {
    type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
  },
  maximum: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
  }
});

module.exports = {
	name: 'addlevel',
	description: 'Sends the current level of a user',
	async execute(client, message, args) {
        try {
            const add = await xp.create({
                level: args[0],
                minimum: args[1],
                maximum: args[2]
            });
            return console.log(`Level ${add.level} with minimum ${add.minimum} and maximum ${add.maximum} added.`);
            
        } catch (e) {
            if (e.image === 'SequelizeUniqueConstraintError') {
                return message.channel.send('That comic already exists.');
            }
            return message.channel.send('Something went wrong with adding a level.' + e);
        }
	},
};