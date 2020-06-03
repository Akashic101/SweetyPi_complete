//---------------------------------- OTHER SETUP ---------------------------------

require('dotenv').config();
var pjson = require('./package.json');
const winston = require('winston');

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        command: 2,
        member: 3,
        info: 4,
        debug: 5,
        message: 6
    },
    colors: {
        error: 'red',
        warn: 'magenta',
        command: 'yellow',
        info: 'cyan',
        debug: 'grey',
        message: 'white',
        member: 'white'
    }
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './log/combined.log' })
    ]
})

//---------------------------------- DISCORD SETUP ---------------------------------

const Discord = require('discord.js');

const clientDIS = new Discord.Client();
const Sequelize = require('sequelize');

//Bot-Token that is stored in the .env-file
const token = process.env.DISCORD_TOKEN;

//Prefix that is used to call a command
const prefix = '!';

//Stores the connection information to the Social-Media-Database. More info: https://discordjs.guide/sequelize/#alpha-connection-information
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

//Stores the connection information to the SweetyImages-Database. More info: https://discordjs.guide/sequelize/#alpha-connection-information
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

var author = 'This bot is made by ' + pjson.author;
var version = pjson.version;

//Variables for the various channels of the Discord-channel, that get stored in the .env-file
var serverLogChannel = process.env.SERVER_LOG_CHANNEL;
var artFeedbackChannel = process.env.ART_FEEDBACK_CHANNEL;
var approvalChannel = process.env.APPROVAL_CHANNEL;
var chitchatChannel = process.env.CHITCHAT_CHANNEL; 

let channel_id = "641680374098952192"; 
let message_id = "712781048504647791";

//logs the bot in with the provided token
clientDIS.login(token);

//----------------------------------------------------------------------------------

//---------------------------------- DISCORD CODE ----------------------------------

//Syncs or creates the table once the bot is ready. This event will only trigger one time after logging in. More info: https://discordjs.guide/sequelize/#gamma-syncing-the-model
clientDIS.once('ready', () => {
    SocialMedia.sync();
    SweetyImages.sync();
});

//Once the bot is running he writes a message with the current time into the server-log-channel
clientDIS.on('ready', () =>{

    clientDIS.channels.cache.get(channel_id).messages.fetch(message_id).then(m => {
        console.log("Cached reaction message.");
    }).catch(e => {
    console.error("Error loading message.");
    console.error(e);
    });

    var d = new Date();

    logger.log({
        level: 'info',
        version: pjson.version,
        date: d
    });
    
    console.log('SweetyPi is back online at ' + d);
    let readyEmbed = new Discord.MessageEmbed();
    readyEmbed.setTitle('**ready**');
    readyEmbed.setDescription('SweetyPi is back online at ' + d);
    readyEmbed.setColor("009a92");
    readyEmbed.setTimestamp();
    readyEmbed.setFooter('Server Log');
    clientDIS.channels.cache.get(serverLogChannel).send(readyEmbed);
});

//Gets called whenever a user joins the server
clientDIS.on('guildMemberAdd', (member) => {

    var date = new Date();

    logger.log({
        level: 'member',
        user: ({
            action: 'joined',
            tag: member.user.tag,
            bot: member.user.bot,
            created: member.user.createdAt
        }),
        date: date
    });

    let readyEmbed = new Discord.MessageEmbed();
    readyEmbed.setTitle('**Member joined**');
    readyEmbed.setDescription(`**${member.user.tag}** has joined the server at ` + date);
    readyEmbed.setColor("ffffff");
    readyEmbed.setTimestamp();
    readyEmbed.setFooter('Server Log');
    clientDIS.channels.cache.get(serverLogChannel).send(readyEmbed);
  });

//Gets called whenever a user leaves the server
clientDIS.on('guildMemberRemove',(member) => {

    var date = new Date();

    logger.log({
        level: 'member',
        user: ({
            action: 'left',
            tag: member.user.tag,
            bot: member.user.bot,
            created: member.user.createdAt
        }),
        date: date
    });

    let readyEmbed = new Discord.MessageEmbed();
    readyEmbed.setTitle('**Member left**');
    readyEmbed.setDescription(`**${member.user.tag}** has left the server at ` + date);
    readyEmbed.setColor("000000");
    readyEmbed.setTimestamp();
    readyEmbed.setFooter('Server Log');
    clientDIS.channels.cache.get(serverLogChannel).send(readyEmbed);
});

clientDIS.on("messageReactionAdd", (reaction, user) => {
    var d = new Date();
    if(reaction.message.id === message_id) {
        reaction.message.guild.members.fetch(user) // fetch the user that reacted
        .then((member) => {
            member.roles.add('712001337440862269').catch(console.error)
            .then(() => {
                let readyEmbed = new Discord.MessageEmbed();
                readyEmbed.setTitle('**Member agreed to rules**');
                readyEmbed.setDescription(`**${member.user.tag}** agreed to the rules at ` + d + ". He is in the server since " + Math.round((d - member.joinedAt) / 1000) + " seconds");
                readyEmbed.setColor("7F0000");
                readyEmbed.setTimestamp();
                readyEmbed.setFooter('Server Log');
                clientDIS.channels.cache.get(serverLogChannel).send(readyEmbed);
                }
            );
        });
    }
});

//Get's called when a message is written and changes args into the first word minus the prefix
clientDIS.on('message', async message => {

    var d = new Date();

    logger.log({
        level: 'message',
        user: message.member.user.tag,
        message: message.content,
        channel: message.channel,
        date: d
    });

	let args = message.content.substring(prefix.length).split(" ");

//In case the message is written inside the critique-your-art-channel and has at least one attachement the bot will automatically react to it with 👍 and 👎
if (message.channel.id == artFeedbackChannel) {
    if (message.attachments.size > 0) {
            message.react('👍');
            message.react('👎');
    }
}

switch(args[0]){

//When someone uses !link with 3 arguments (!link <platform> <link.to.website>), a rich message gets created and posted into the approval-channel
//The bot will also react with a 👍 to the message and send the author a private message
//If the message does not contains 3 arguments an error gets called

    case 'link' :

        sendLog("link", message.member.user.tag, message.content, "6f5d57");

        if(args.length != 3) {
            message.channel.send('You\'ve got something wrong there. Please remember that the right command is **!link <platform> <link>** or else it won\'t work');
            break;
        }
		else {
			try {
                message.author.send('Your link has been sent in for approval. Once approved it will be accessible with !' + args[1] + ' ' + message.author.username + '. If there is a problem one of the mods will message you privately');
                message.delete();
				let embed = new Discord.MessageEmbed();
				embed.setTitle('**New Appoval requested**');
				embed.setDescription('User: ' + message.author.username + ' (' + message.author.id + ')\n' +
				'platform: ' + args[1] + '\n' +
				'Link: ' + args[2]);
				embed.setColor("ff0000");
				embed.setTimestamp();
				embed.setFooter('Approval System V1')
				clientDIS.channels.cache.get(approvalChannel).send(embed).then
				(message => message.react('👍'))
				break;
			} catch (e) {
                clientDIS.users.cache.get('320574128568401920').send('error: ' + e);
			}
        }
        
//This message is only possible for people with the mod-role. It enables them to add a new row to the social-media-database. More info: https://discordjs.guide/sequelize/#delta-adding-a-tag
//If the link already exists, there are more or less then 4 arguments or the author is not a mod an error gets called
    case 'add' :

        sendLog("add", message.member.user.tag, message.content, "aadddd");

        if (args.length != 4 && !message.member.roles.cache.has('641618875846492170')) {
            message.channel.send("I'm sorry, you don't have permission to do that");
        }
        else {
            try {
                const match = await SocialMedia.create({
                    platform: args[1],
                    username: args[2],
                    link: args[3]
                });
                
            message.reply(`The command !${match.platform} ${match.username} has been added to the database.`);
            break;
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {				
            message.reply('That link already exists');
            break;
            }
            else {
                clientDIS.users.cache.get('320574128568401920').send('error: ' + e);
            }
        }
    }

//This will search through the database for Twitch accounts with the provived username and write a message with the link into the chat
//If the profile does not exist or there are more or less then 2 arguments provided an error gets called
    case 'twitch' :

        sendLog("twitch", message.member.user.tag, message.content, "6441a5");

        if(args[1] === undefined) {
            return message.channel.send('You can find Redfur\'\s Twitch here: https://www.twitch.tv/redfur_13');
        }

		else if(args.length != 2) return;
		else {
			try {
				const match = await SocialMedia.findOne({where: {platform: "twitch", username: args[1]}});
				if(match) {
					match.increment('usage_count');
					return message.channel.send('You can find the ' + match.platform + ' of ' + match.username + ' here: ' + match.link);
				}
				else {
					return message.channel.send('I could not find that profile on that platform');
				}
			}
			catch (e) {
				message.reply('Could not find tag');
				return console.log(e);
			}
		}

//This will search through the database for Instagram accounts with the provived username and write a message with the link into the chat
//If the profile does not exist or there are more or less then 2 arguments provided an error gets called
    case 'instagram' :

        sendLog("instagram", message.member.user.tag, message.content, "3f729b");
        if(args[1] === undefined) {
            return message.channel.send('You can find Redfur\'\s instagram here: https://www.instagram.com/SweetyComics/');
        }
		else if(args.length != 2) return;
		else {
			try {
				const match = await SocialMedia.findOne({where: {platform: "instagram", username: args[1]}});
				if(match) {
					match.increment('usage_count');
					return message.channel.send('You can find the ' + match.platform + ' of ' + match.username + ' here: ' + match.link);
				}
				else {
					return message.channel.send('I could not find that profile on that platform');
				}
			}
			catch (e) {
				message.reply('Could not find tag');
				return console.log(e);
			}
			
		}

//This will search through the database for Webtoon accounts with the provived username and write a message with the link into the chat
//If the profile does not exist or there are more or less then 2 arguments provided an error gets called
    case 'webtoons' :

        sendLog("webtoons", message.member.user.tag, message.content, "00d564");

        var date = new Date();
        let webtoonsEmbed = new Discord.MessageEmbed();
        webtoonsEmbed.setTitle('**webtoons**');
        webtoonsEmbed.setDescription(message.member.user.tag + ' used ' + message.content + ' at ' + date);
        webtoonsEmbed.setColor("00d564");
        webtoonsEmbed.setTimestamp();
        webtoonsEmbed.setFooter('Server Log');
        clientDIS.channels.cache.get(serverLogChannel).send(webtoonsEmbed);

		sendLog("instagram", message.member.user.tag, message.content, "3f729b");
        if(args[1] === undefined) {
            return message.channel.send('You can find Redfur\'\s Webtoons here: https://www.webtoons.com/en/challenge/life-of-sweety/list?title_no=389966');
        }
		else if(args.length != 2) return;
		else {
			try {
				const match = await SocialMedia.findOne({where: {platform: "webtoons", username: args[1]}});
				if(match) {
					match.increment('usage_count');
					return message.channel.send('You can find the ' + match.platform + ' of ' + match.username + ' here: ' + match.link);
				}
				else {
					return message.channel.send('I could not find that profile on that platform');
				}
			}
			catch (e) {
				message.reply('Could not find tag');
				return console.log(e);
			}
        }

//This will search through the database for Patreon accounts with the provived username and write a message with the link into the chat
//If the profile does not exist or there are more or less then 2 arguments provided an error gets called
    case 'patreon' :

        sendLog("patreon", message.member.user.tag, message.content, "f96854");

		if(args[1] === undefined) {
            return message.channel.send('You can find Redfur\'\s Patreon here: https://www.patreon.com/redfur13');
        }
		else if(args.length != 2) return;
		else {
			try {
				const match = await SocialMedia.findOne({where: {platform: "patreon", username: args[1]}});
				if(match) {
					match.increment('usage_count');
					return message.channel.send('You can find the ' + match.platform + ' of ' + match.username + ' here: ' + match.link);
				}
				else {
					return message.channel.send('I could not find that profile on that platform');
				}
			}
			catch (e) {
				message.reply('Could not find tag');
				return console.log(e);
			}
		}

//This will search through the database for Twitter accounts with the provived username and write a message with the link into the chat
//If the profile does not exist or there are more or less then 2 arguments provided an error gets called
    case 'twitter' :

        sendLog("twitter", message.member.user.tag, message.content, "00acee");

        if(args[1] === undefined) {
            return message.channel.send('You can find Redfur\'\s Twitter here: https://twitter.com/redfur13');
        }
		else if(args.length != 2) return;
        else {
            try {
                const match = await SocialMedia.findOne({where: {platform: "twitter", username: args[1]}});
                if(match) {
                    match.increment('usage_count');
                    return message.channel.send('You can find the ' + match.platform + ' of ' + match.username + ' here: ' + match.link);
                }
                else {
                    return message.channel.send('I could not find that profile on that platform');
                }
            }
            catch (e) {
                message.reply('Could not find tag');
                return console.log(e);
            }  
        }

//This will search through the database for Facebook accounts with the provived username and write a message with the link into the chat
//If the profile does not exist or there are more or less then 2 arguments provided an error gets called
    case 'facebook' :

        sendLog("facebook", message.member.user.tag, message.content, "39569c");

        if(args[1] === undefined) {
            return message.channel.send('You can find Redfur\'\s Facebook here: https://www.facebook.com/Redfur13-2323949451264229/?ref=aymt_homepage_panel&eid=ARBQBOOYhk572IzVWcoV08jK4-y8bf8sSRWQ-KRxqrryne0yGezIFTfZzgmEUg78Xn3D0VU15YKeTW2A');
        }
		else if(args.length != 2) return;
        else {
            try {
                const match = await SocialMedia.findOne({where: {platform: "facebook", username: args[1]}});
                if(match) {
                    match.increment('usage_count');
                    return message.channel.send('You can find the ' + match.platform + ' of ' + match.username + ' here: ' + match.link);
                }
                else {
                    return message.channel.send('I could not find that profile on that platform');
                }
            }
            catch (e) {
                message.reply('Could not find tag');
                return console.log(e);
            }  
        }

//This will search through the database for Etsy accounts with the provived username and write a message with the link into the chat
//If the profile does not exist or there are more or less then 2 arguments provided an error gets called
    case 'etsy' :

        sendLog("etsy", message.member.user.tag, message.content, "eb6d20");

        if(args[1] === undefined) {
            return message.channel.send('You can find Redfur\'\s Etsy here: https://twitter.com/redfur13');
        }
		else if(args.length != 2) return;
            else {
                try {
                    const match = await SocialMedia.findOne({where: {platform: "twitter", username: args[1]}});
                    if(match) {
                        match.increment('usage_count');
                        return message.channel.send('You can find the ' + match.platform + ' of ' + match.username + ' here: ' + match.link);
                    }
                    else {
                        return message.channel.send('I could not find that profile on that platform');
                    }
                }
                catch (e) {
                    message.reply('Could not find tag');
                    return console.log(e);
                }  
            }

//This will search through the database for a website with the provived username and write a message with the link into the chat
//If the profile does not exist or there are more or less then 2 arguments provided an error gets called
    case 'website' :

        sendLog("website", message.member.user.tag, message.content, "ffffff");

        var date = new Date();
        let websiteEmbed = new Discord.MessageEmbed();
        websiteEmbed.setTitle('**website**');
        websiteEmbed.setDescription(message.member.user.tag + ' used ' + message.content + ' at ' + date);
        websiteEmbed.setColor("ffffff");
        websiteEmbed.setTimestamp();
        websiteEmbed.setFooter('Server Log');
        clientDIS.channels.cache.get(serverLogChannel).send(websiteEmbed);
            
        if(args.length != 2) return;
        else {
            try {
                const match = await SocialMedia.findOne({where: {platform: "website", username: args[1]}});
                if(match) {
                    match.increment('usage_count');
                    return message.channel.send('You can find the ' + match.platform + ' of ' + match.username + ' here: ' + match.link);
                }
                else {
                    return message.channel.send('I could not find that profile on that platform');
                }
            }
            catch (e) {
                message.reply('Could not find tag');
                return console.log(e);
            }  
        }

//This will search through the database for Github accounts with the provived username and write a message with the link into the chat
//If the profile does not exist or there are more or less then 2 arguments provided an error gets called
    case 'github' :

        sendLog("github", message.member.user.tag, message.content, "24292e");
        
        if(args.length != 2) return;
        else {
            try {
                const match = await SocialMedia.findOne({where: {platform: "github", username: args[1]}});
                if(match) {
                    match.increment('usage_count');
                    return message.channel.send('You can find the ' + match.platform + ' of ' + match.username + ' here: ' + match.link);
                }
                else {
                    return message.channel.send('I could not find that profile on that platform');
                }
            }
            catch (e) {
                message.reply('Could not find tag');
                return console.log(e);
            }  
        }

//This command will roll a random number, where the min and max are determined by the number of arguments
//If one argument is used the min is 1 and the max is 6
//If two arguments are used the min is 1 and the max is the second argument
//If three arguments are used the min is the second argument and the max is the third argument
    case 'roll' :

        sendLog("roll", message.member.user.tag, message.content, "FF0000");

        if(args.length == 3) {
            message.channel.send('Your random number is: ' + Math.floor((Math.random() * args[2]) + args[1]));
            break;
        }
        else if(args.length == 2) {
            message.channel.send('Your random number is: ' + Math.floor((Math.random() * 6) + args[1]));
            break;
        }
        else if(args.length == 1) {
            message.channel.send('Your random number is: ' + Math.floor((Math.random() * 6) + 1));
            break;
        }
        else {
            message.channel.send('Something broke and I don\'t know what. Please try again');
            break;
        }

function getTimeRemaining(endtime){
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor( (total/1000) % 60 );
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math.floor( (total/(1000*60*60)) % 24 );
    const days = Math.floor( total/(1000*60*60*24) );
  
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }

    case 'schedule' :
        
        var d = new Date();
        var nextStream = new Date();

        if(d.getDay() == 0 || d.getDay() == 5 || d.getDay() == 6 || d.getDay() == 1) {
            nextStream.setDate(nextStream.getDate() + (1+(7-nextStream.getDay())) % 7);
        }
        else if(d.getDay() == 2 || d.getDay() == 3 || d.getDay() == 4) {
            nextStream.setDate(nextStream.getDate() + (4+(7-nextStream.getDay())) % 7);
        }

        nextStream.setHours(12);
        nextStream.setMinutes(0);
        
        var TimeToNextStream = getTimeRemaining(nextStream);

        const nextStreamEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Schedule')
        .setURL('https://www.twitch.tv/redfur_13')
        .addFields(
            { name: 'Monday', value: '12PM - 6PM GMT+2'},
            { name: 'Thursday', value: '12PM - 6PM GMT+2'},
            { name: 'Countdown to next Stream', value: 'd:' + TimeToNextStream.days + ' h:' + TimeToNextStream.hours + ' m:' + TimeToNextStream.minutes}
        );
        clientDIS.channels.cache.get('685192557226885155').send(nextStreamEmbed);
        break;

//Creates a rich message where the text after the second argument is the question. The rich message always has a random color
//and 👍 and 👎 as a reaction
    case 'poll' :

        sendLog("poll", message.member.user.tag, message.content, "FF0000");
        
        messageContent = message.content;

        try {
            let embed = new Discord.MessageEmbed();
			embed.setTitle('**New Poll**');
			embed.setDescription(message.author.username + ' wants to know: ' + messageContent.slice(6));
			embed.setColor((Math.random()*0xFFFFFF<<0).toString(16));
			embed.setTimestamp();
			embed.setFooter('Voting System V1')
            message.channel.send(embed).then
            (message => message.react('👍')).then(
            (reaction => reaction.message.react('👎')))
            break;
        } catch (e) {
            message.send.channel(e);
        }

//If the author is not a mod,less or more then 2 arguments are provided or the link already exists an error gets called
//The second argument will get added to the SweetyPictures-database
    case 'addSweety' :

        logger.log({
            level: 'command',
            command: 'addSweety',
            link: args[1],
            date: d
        });

        sendLog("addSweety", message.member.user.tag, message.content, "cb876f");

        if (args.length != 2 ||!message.member.roles.cache.has('641618875846492170')) {
            message.channel.send("I'm sorry, you don't have permission to do that");
            break;
        }
        else {
            try {
                const add = await SweetyImages.create({
                    link: args[1]
                });
                return message.reply(`Link ${add.link} added.`);
            } catch (e) {
                if (e.link === 'SequelizeUniqueConstraintError') {
                    return message.reply('That link already exists.');
                }
                return message.reply('Something went wrong with adding a link.');
            }
        }

//Grabs a random link from the SweetyPictures-database and posts it as a message
    case 'sweety' :

        var d = new Date();

        logger.log({
            level: 'info',
            user: message.member.user.tag,
            message: message.content,
            channel: message.channel.name,
            date: d
        });

        sendLog("sweety", message.member.user.tag, message.content, "FF0000");

        try {
            const match = await SweetyImages.findOne({ order: Sequelize.literal('random()') })
            if(match) {
                match.increment('usage_count');
                return message.channel.send(match.link);
            }
            else {
                return message.channel.send('error');
            }
        } catch (e) {
            message.channel.send("error: " + e);
    }

//Deletes the row from the SweetyImages-database where link equals to args[1]. Also sends a rich message to the serverLogChannel
//More info: https://discordjs.guide/sequelize/#mu-deleting-a-tag
    case 'delSweety' :

        sendLog("delSweety", message.member.user.tag, message.content, "FF0000");

        if (args.length != 2 || !message.member.roles.cache.has('641618875846492170')) {
            message.channel.send("I'm sorry, you don't have permission to do that");
            break;
        }
        else {
            try {
                const match = args[1];
                // equivalent to: DELETE from tags WHERE name = ?;
                const rowCount = await SweetyImages.destroy({ where: { link: match } });

                if (!rowCount) {
                    message.reply('That link did not exist.');
                    break;
                }
                else {
                    message.reply('Link ' + args[1] + ' deleted.');
                    break;
                }
                
            } catch (e) {
                break;
            }
        }

//Writes a help-message explaining helpful commands and what to !do when encountering a bug or requesting a feature
    case 'help' :

        sendLog("help", message.member.user.tag, message.content, "000000");

        var date = new Date();
        let helpEmbed = new Discord.MessageEmbed();
        helpEmbed.setTitle('**help**');
        helpEmbed.setDescription(message.member.user.tag + ' used ' + message.content + ' at ' + date);
        helpEmbed.setColor("000000");
        helpEmbed.setTimestamp();
        helpEmbed.setFooter('Server Log');
        clientDIS.channels.cache.get(serverLogChannel).send(helpEmbed);

        if(args[1] === undefined) {
            message.channel.send('**commands** \nTo get a list with all available commands you can use !commands.\n' +
            '**problems & ideas**\nIf you have ideas for feautures to make this bot even better, or something is not working as expected, feel free to dm <@320574128568401920>');
            break;
        }

//Lists every command
    case 'commands' :

        sendLog("commands", message.member.user.tag, message.content, "007bb8");

        message.author.send('**Social Media** \nIf you want someones Social Media-links to see more of their work you can type in !<platform> <account-name> to get a link \n_Available platforms_ \n!twitch\n!webtoon(s)\n!twitter\n!facebook\n!reddit\n!etsy\n!patreon\n!instagram\n!website\n\n' +
        '**HOW TO USE IT**\n' +
        '_Redfur\'s links_\nTo get a link to Redfur\'\s accounts just type in !<platform> and you will get a link\n' +
        '_Add your link to the list_\nIf you want to link your account so they can be called, please enter !link <platform> <link>. The mods will add your account to the list as soon as possible\n' + 
        '_Sweety pics and gifs_\nIf you want a random image of Sweety simply enter !sweety\n' + 
        '_Uptime_\nTo see since when the bot is running you can display it with !uptime\n' +
        '_Info_\nIf you want to know who wrote this bot and more you can enter !info\n');
        message.delete();
        break;

//Calculated the time since the bot is online, written in hh:mm:ss. Adds a random message from an array to the end
    case 'uptime' : 

        sendLog("uptime", message.member.user.tag, message.content, "f9f4df");

        var date = new Date();
        let uptimeEmbed = new Discord.MessageEmbed();
        uptimeEmbed.setTitle('**commands**');
        uptimeEmbed.setDescription(message.member.user.tag + ' used ' + messageContent + ' at ' + date);
        uptimeEmbed.setColor("f9f4df");
        uptimeEmbed.setTimestamp();
        uptimeEmbed.setFooter('Server Log');
        clientDIS.channels.cache.get(serverLogChannel).send(uptimeEmbed);

    const sentences = [
        'Maybe she should take a break soon',
        'Crazy how time flies when you are having fun',
        'And she isn\'t even braking a sweat',
        'She really needs a nap right now',
        'Let\'s cheer her on',
        'All of that and her fur is still flawless',
        'Red really needs to up her treat-payment'
        ]

        message.channel.send('SweetyPi worked without a break since ' + sToTime(clientDIS.uptime)  + ' hours. ' + (sentences[Math.floor(Math.random() * sentences.length)]));
        break;

//Writes a message with the name of the author, the current version and a link to the repository
    case 'info' :

        sendLog("info", message.member.user.tag, message.content, "d63d7b");

        message.channel.send(author);
        message.channel.send('This bot has reached version ' + version);
        message.channel.send('You can find the code of this bot here: https://akashic101.github.io/SweetyPI/');
        break;



//function that calculates how many hours, minutes and seconds are in a defined amount of seconds (s)
function sToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return hrs + ':' + mins + ':' + secs;
}

//TODO Link to channel message was send in: clientDIS.channels.cache.get(`${message.channel}`)
function sendLog(platform, color) {
    var date = new Date();
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`**${platform}**`);
        embed.setDescription(`**${message.member.user.tag}**` + ' used ' + message.content + ' at ' + date);
        embed.setColor(color);
        embed.setTimestamp();
        embed.setFooter('Server Log');
        clientDIS.channels.cache.get(serverLogChannel).send(embed);
}

}});

//---------------------------------- TWITCH SETUP ----------------------------------

const tmi = require('tmi.js');
require('dotenv').config();

const options = {
    options: {
        debug: true,
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: "SweetyTheRagdoll",
        password: process.env.IDENTITY_PASSWORD,
    },
    channels: ['Redfur_13'],
};

const clientTWI = new tmi.client(options);

clientTWI.connect();

//----------------------------------------------------------------------------------

//---------------------------------- TWITCH CODE -----------------------------------

//Send a message whenever the bot connected to the stream
clientTWI.on('connected', (address, port) => {
    clientTWI.action('Redfur_13', 'SweetyBot has awoken from her slumber')
    setInterval(() => {
        messageInterval();
    }, 1800000);
});

function messageInterval() {
    clientTWI.say("Redfur_13", "If you're a sub or a patron, you get access to exclusive comics over on the discord server! https://discordapp.com/invite/KTFBR8A. I also published new video, you can watch it here: https://youtu.be/I34-cuyKilQ");
}

//listens to incoming chat-messages
clientTWI.on('chat', async (channel, user, message, self) => {
    if(self) return;
    const commandmessage = message.trim().toLowerCase();

    if (commandmessage === '!instagram' || commandmessage === '!insta') {
        clientTWI.say('Redfur_13', 'https://www.instagram.com/sweetycomics')
    }

    if (commandmessage === '!discord') {
        clientTWI.say('Redfur_13', 'https://discordapp.com/invite/KTFBR8A')
    }

    if (commandmessage === '!facebook' || commandmessage === '!fb') {
        clientTWI.say('Redfur_13', 'https://www.facebook.com/Redfur13-2323949451264229/?ref=aymt_homepage_panel&eid=ARBQBOOYhk572IzVWcoV08jK4-y8bf8sSRWQ-KRxqrryne0yGezIFTfZzgmEUg78Xn3D0VU15YKeTW2A')
    }

    if (commandmessage === '!youtube' || commandmessage === '!yt') {
        clientTWI.say('Redfur_13', 'https://www.youtube.com/channel/UCEefUPort7KP98FpTQGv91A')
    }

    if (commandmessage === '!twitter') {
        clientTWI.say('Redfur_13', 'https://twitter.com/redfur13')
    }

    if (commandmessage === '!webtoon' || commandmessage === '!webtoons') {
        clientTWI.say('Redfur_13', 'https://www.webtoons.com/en/challenge/sweety-comics/list?title_no=389966')
    }

    if(commandmessage === '!fiverr') {
        clientTWI.say('Redfur_13', 'https://www.fiverr.com/share/9dNkgd')
    }

    if(commandmessage === '!command' || commandmessage === '!commands') {
        clientTWI.say('Redfur_13', '!instagram, !discord, !facebook, !youtube, !twitter, !webtoon, !fiverr')
    }

    if(commandmessage === '!uptime') {
        clientTWI.say('Redfur_13', 'The hell do I know, I\'m a cat')
    }
    
    if(commandmessage === '!spotify') {
        clientTWI.say('Redfur_13', 'Favorites: https://open.spotify.com/playlist/3UME90dv7wKZyPzF8dZR1T?si=ldE-69ntRGKEQ_Dko9tWzg    Soundtracks: https://open.spotify.com/playlist/0UjcGDnWcOLUnevCTqtpEh?si=Bv7ojc8XRSqeiYnrjqK6_Q')
    }

    if(commandmessage === '!hi') {
        clientTWI.say('Redfur_13', 'Hello ' + user.username + ' >^ω^<')
    }

    if(commandmessage === '!quit') {
        clientTWI.say('Redfur_13', `shutting down...`)
    }

    if(commandmessage === '!exit') {
        clientTWI.say('Redfur_13', `shutting down...`)
    }

    if(commandmessage === '!shake') {
        clientTWI.say('Redfur_13', 'not without a treat')
    }

    if(commandmessage === '!sweety') {
        try {
            const match = await SweetyImages.findOne({ order: Sequelize.literal('random()') })
            if(match) {
                match.increment('usage_count');
                return clientTWI.say('Redfur_13', "" + match.link);
            }
            else {
                return clientTWI.say('something broke and I don\'t know what');
            }
        } catch (e) {
            clientTWI.say("error: " + e);
        }
    }

    if(commandmessage === '!thanks') {
        var messages = [
            "No problem",
            "Glad to help",
            "Just doing my job",
            "What can I say except you're welcome",
            "Meow Meow"]

            var message = messages[Math.floor(Math.random() * messages.length)];

        clientTWI.say('Redfur_13', message + " " + user.username);
    }
});

//reacts when someone cheered more then 100 bits
clientTWI.on("cheer", (channel, userstate, message) => {
    if(userstate.bits < 100) {
        return;
    }
    else {
        clientTWI.say('Redfur_13', "redfur4Love redfur4Love " + userstate.username + " has cheered " + userstate.bits + " beenz redfur4Love redfur4Love");
        clientDIS.channels.cache.get(chitchatChannel).send("<:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440> " + userstate.username + " has cheered " + userstate.bits + " beenz during Redfur's stream <:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440>");
    }
});

//reacts when someone subscribed
clientTWI.on("subscription", (channel, username, method, message, userstate) => {
    clientTWI.say('Redfur_13', "redfur4Love redfur4Love " + username + " just subscribed! redfur4Love redfur4Love ");
    clientDIS.channels.cache.get(chitchatChannel).send("<:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440> " + username + " just subscribed during Redfur's stream <:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440>");
});

//Username gifted a subscription to recipient in a channel.
clientTWI.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    let senderCount = ~~userstate["msg-param-sender-count"];
    clientTWI.say('Redfur_13', "redfur4Love redfur4Love " + username + " just gifted a subscription to " + recipient + ". He gifted in total " + senderCount + " subscriptions redfur4Love redfur4Love ");
    clientDIS.channels.cache.get(chitchatChannel).send("<:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440> " + username + " just gifted a subscription to " + recipient  + " He gifted in total " + senderCount + " subs <:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440>");
});

//reacts when someone gifted a mystery-subscription
clientTWI.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
    let senderCount = ~~userstate["msg-param-sender-count"];
    clientTWI.say('Redfur_13', "redfur4Love redfur4Love " + userstate.username + " just gifted " + numbOfSubs + " mystery-subscriptions. He gifted in total " + senderCount + " subscriptions redfur4Love redfur4Love ");
    clientDIS.channels.cache.get(chitchatChannel).send("<:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440> " + username + " just gifted " + numbOfSubs + " mystery-subscriptions. He gifted in total " + senderCount + " subscriptions <:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440>");
});

clientTWI.on("resub", (channel, username, months, message, userstate, methods) => {
    let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    clientTWI.say('Redfur_13', "redfur4Love redfur4Love " + userstate.username + " just continued his subscription. He is now subscribed since " + cumulativeMonths + " months redfur4Love redfur4Love");
    clientDIS.channels.cache.get(chitchatChannel).send("<:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440> " + username + " just continued his subscription. He is now subscribed since " + months + " months <:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440>");
});

//----------------------------------------------------------------------------------