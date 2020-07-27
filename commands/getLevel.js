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

const level = levelSeq.define('level', {
	id: {
    primaryKey: true,
		type: Sequelize.INTEGER,
    unique: true,
  },
  user_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  xp: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
  }
});

const levelTable = levelSeq.define('levelTable', {
	id: {
        primaryKey: true,
	    type: Sequelize.INTEGER,
        unique: true,
    },
    level: {
        type: Sequelize.INTEGER,
        unique: true,
    },
    xp_needed: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
    }
});

levelTable.sync()
level.sync()

module.exports = {
	name: 'getlevel',
	description: 'Sends the current level of another user',
	async execute(client, message, args) {

        var date = new Date();

        const logEmbed = new Discord.MessageEmbed()
            .setColor('#0352ea')
            .setTitle(`**get Level**`)
            .addFields(
                { name: 'Username', value: message.member.user.tag},
                { name: 'Command', value: message.content},
                { name: 'Date', value: date}
            )
            .setThumbnail(message.member.user.displayAvatarURL({ format: 'jpg' }))
            .setTimestamp()
            .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
        const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
        channel.send(logEmbed);

        try {
            var username = message.mentions.users.first().username
            var userID = message.mentions.users.first().id
            //Find the user by searching through the database with the id
            const match = await level.findOne({where: {user_id: userID}});

            //If a match was found
            if(match) {
                const userLevel = await levelTable.findAll({attributes: ['xp_needed'] });
                const userString = userLevel.map(t => t.xp_needed);
                var index=userString.findIndex(function(number) {
                    return number > match.xp;
                });

                if(userLevel) {
                    const levelEmbed = new Discord.MessageEmbed()
                        .setColor('#e7a09c')
                        .setTitle(`**Level**`)
                        .setDescription(`**${username}** is level ${index} and has ${match.xp} XP`)
                        .setThumbnail(message.mentions.users.first().displayAvatarURL({ format: 'jpg' }))
                        .setTimestamp()
                        .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
                    return message.channel.send(levelEmbed)
                }
                else {
                    message.channel.send(`I cannot find that level ${username} for because I am stupid`)
                }
            }
            else {
                message.channel.send("I was unable to find that profile")
            }
        }
        catch (e) {
          console.log(e);
        }   
	},
};