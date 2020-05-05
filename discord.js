const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
const Sequelize = require('sequelize');

//Bot-Token that is stored in the .env-fike
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
var approvalChannel  = process.env.APPROVAL_CHANNEL;

//Syncs or creates the table once the bot is ready. This event will only trigger one time after logging in. More info: https://discordjs.guide/sequelize/#gamma-syncing-the-model
client.once('ready', () => {
    SocialMedia.sync();
    SweetyImages.sync();
});

//Once the bot is running he writes a message with the current time into the server-log-channel
client.on('ready', () =>{

    var date = new Date();
    console.log('SweetyPi is back online at ' + date);
    let readyEmbed = new Discord.MessageEmbed();
    readyEmbed.setTitle('**ready**');
    readyEmbed.setDescription('SweetyPi is back online at ' + date);
    readyEmbed.setColor("009a92");
    readyEmbed.setTimestamp();
    readyEmbed.setFooter('Server Log');
    client.channels.cache.get(serverLogChannel).send(readyEmbed);
});

//Gets called whenever a user joins the server
client.on('guildMemberAdd', (member) => {      
    var date = new Date();
    let readyEmbed = new Discord.MessageEmbed();
    readyEmbed.setTitle('**Member joined**');
    readyEmbed.setDescription(`**${member.user.tag}** has joined the server at ` + date);
    readyEmbed.setColor("ffffff");
    readyEmbed.setTimestamp();
    readyEmbed.setFooter('Server Log');
    client.channels.cache.get(serverLogChannel).send(readyEmbed);
  });

//Gets called whenever a user leaves the server
client.on('guildMemberRemove',(member) => {
    var date = new Date();
    let readyEmbed = new Discord.MessageEmbed();
    readyEmbed.setTitle('**Member left**');
    readyEmbed.setDescription(`**${member.user.tag}** has left the server at ` + date);
    readyEmbed.setColor("000000");
    readyEmbed.setTimestamp();
    readyEmbed.setFooter('Server Log');
    client.channels.cache.get(serverLogChannel).send(readyEmbed);
});


//Get's called when a message is written and changes args into the first word minus the prefix
client.on('message', async message => {
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
				client.channels.cache.get(approvalChannel).send(embed).then
				(message => message.react('👍'))
				break;
			} catch (e) {
                client.users.cache.get('320574128568401920').send('error: ' + e);
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
                client.users.cache.get('320574128568401920').send('error: ' + e);
            }
        }
    }

//This will search through the database for Twitch accounts with the provived username and write a message with the link into the chat
//If the profile does not exist or there are more or less then 2 arguments provided an error gets called
    case 'twitch' :

        sendLog("twitch", message.member.user.tag, message.content, "6441a5");

		if(args.length != 2) return;
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

		if(args.length != 2) return;
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
        client.channels.cache.get(serverLogChannel).send(webtoonsEmbed);

		if(args.length != 2) return;
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

		if(args.length != 2) return;
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

        if(args.length != 2) return;
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

        if(args.length != 2) return;
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

        if(args.length != 2) return;
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
        client.channels.cache.get(serverLogChannel).send(websiteEmbed);
            
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

//Creates a rich message where the text after the second argument is the question. The rich message always has a random color
//and 👍 and 👎 as a reaction
    case 'poll' :

        sendLog("poll", message.member.user.tag, message.content, "FF0000");
        
        var date = new Date();
        let pollEmbed = new Discord.MessageEmbed();
        pollEmbed.setTitle('**poll**');
        pollEmbed.setDescription(message.member.user.tag + ' used ' + message.content + ' at ' + date);
        pollEmbed.setColor("FF0000");
        pollEmbed.setTimestamp();
        pollEmbed.setFooter('Server Log');
        client.channels.cache.get(serverLogChannel).send(pollEmbed);

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

//Writes a help-message explaining helpful commands and what to do when encountering a bug or requesting a feature
    case 'help' :

        sendLog("help", message.member.user.tag, message.content, "000000");

        var date = new Date();
        let helpEmbed = new Discord.MessageEmbed();
        helpEmbed.setTitle('**help**');
        helpEmbed.setDescription(message.member.user.tag + ' used ' + messageContent + ' at ' + date);
        helpEmbed.setColor("000000");
        helpEmbed.setTimestamp();
        helpEmbed.setFooter('Server Log');
        client.channels.cache.get(serverLogChannel).send(helpEmbed);

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
        client.channels.cache.get(serverLogChannel).send(uptimeEmbed);

    const sentences = [
        'Maybe she should take a break soon',
        'Crazy how time flies when you are having fun',
        'And she isn\'t even braking a sweat',
        'She really needs a nap right now',
        'Let\'s cheer her on',
        'All of that and her fur is still flawless',
        'Red really needs to up her treat-payment'
        ]

        message.channel.send('SweetyPi worked without a break since ' + msToTime(client.uptime)  + ' hours. ' + (sentences[Math.floor(Math.random() * sentences.length)]));
        break;

//Writes a message with the name of the author, the current version and a link to the repository
    case 'info' :

        sendLog("info", message.member.user.tag, message.content, "d63d7b");

        message.channel.send(author);
        message.channel.send('This bot has reached version ' + version);
        message.channel.send('You can find the code of this bot here: https://akashic101.github.io/SweetyPI/');
        break;

//function that calculates how many hours, minutes and seconds are in a defined amount of seconds (s)
function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return hrs + ':' + mins + ':' + secs;
}

//TODO Link to channel message was send in: client.channels.cache.get(`${message.channel}`)
function sendLog(platform, color) {
    var date = new Date();
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`**${platform}**`);
        embed.setDescription(`**${message.member.user.tag}**` + ' used ' + message.content + ' at ' + date);
        embed.setColor(color);
        embed.setTimestamp();
        embed.setFooter('Server Log');
        client.channels.cache.get(serverLogChannel).send(embed);
}

}});

//logs the bot in with the provided token
client.login(token);
