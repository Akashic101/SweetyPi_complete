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
	name: 'level',
	description: 'Sends the current level of a user',
	async execute(client, message, args) {

        var username = message.author.username
        var date = new Date();
        var userID = message.author.id

        const logEmbed = new Discord.MessageEmbed()
            .setColor('#e7a09c')
            .setTitle(`**Level**`)
            .addFields(
                { name: 'Username', value: message.member.user.tag},
                { name: 'Command', value: message.content},
                { name: 'Date', value: date}
            )
            .setThumbnail(message.member.user.displayAvatarURL({ format: 'jpg' }))
            .setTimestamp()
            .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
        const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
        //channel.send(logEmbed);

        try {
            //Find the user by searching through the database with the id
            const match = await level.findOne({where: {user_id: userID}});

            //If a match was found
            if(match) {
                const userLevel = await levelTable.findOne({
                    where: {
                        //Find the level by looking where match.xp is greater or equal than the xp_needed
                        //EXAMPLE: User 1 has 10 xp. Level 1 goes from 0 to 5, Level 2 from 6 to 15. 
                        xp_needed: {
                            [Sequelize.gte]: match.xp
                        }
                    } 
                })

                //If the level was found
                if(userLevel) {

                    //Do something with the result
                    const levelEmbed = new Discord.MessageEmbed()
                    .setColor('#e7a09c')
                    .setTitle(`**Level**`)
                    .setDescription(`**${username}** is level ${userLevel.level + 1} and has ${match.xp} XP`)
                    .setThumbnail(message.member.user.displayAvatarURL({ format: 'jpg' }))
                    .setTimestamp()
                    .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
                message.channel.send(levelEmbed)
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