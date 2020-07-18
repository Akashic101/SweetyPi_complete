const Sequelize = require('sequelize');
const Discord = require('discord.js');

const strikeListSeq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'strikeList.sqlite',
});

const strikeList = strikeListSeq.define('strikeList', {
	user: {
		type: Sequelize.STRING,
	},
	strikeOne: {
		type: Sequelize.STRING,
	},
	strikeTwo: {
		type: Sequelize.STRING,
	},
	strikeThree: {
		type: Sequelize.STRING,
	},
});

module.exports = {
	name: 'addstrike',
	description: 'Send info about the current Hot-Lap-Challenge!',
	async execute(message, args) {

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
                message.channel.send(args.length)
                const match = await strikeList.create({
                    user: args[0],
                    strikeOne: args[1],
                    strikeTwo: "-",
                    strikeThree: "-"
                });
                return message.channel.send(`The User ${match.user} has recieved his first strike.`);
            }
            catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {				
                    message.channel.send('That User already exists');
                    return;
                }
                else {
                    clientDIS.users.cache.get('320574128568401920').send('error: ' + e);
                    return;
                }
            }
        }
	},
};