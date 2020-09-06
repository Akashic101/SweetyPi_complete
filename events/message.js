require('dotenv').config();
const Sequelize = require('sequelize');
const Discord = require('discord.js');
var pjson = require('../package.json');

const prefix = '!';

const levelSeq = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'level.sqlite',
    timestamps: false,
});

//Model that defines the structure of the SweetyImages-database: More info: https://discordjs.guide/sequelize/#beta-creating-the-model
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

const xp = levelSeq.define('xp', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
    },
    level: {
        type: Sequelize.INTEGER,
        unique: true,
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

module.exports = async (client, message) => {
    var increment = 0

    switch (message.channel.id) {
        case '641661443984588821': //suggestions
            increment = 1
            break;
        case '641623885065879582': //vip-chat
            increment = 2
            break;
        case '735979384653217872': //rich-people-club
            increment = 3
            break;
        case '641674237811097629': //chitchat
            increment = 1
            break;
        case '717741113674563587': //memes
            increment = 1
            break;
        case '641678073497911327': //pets
            increment = 1 + (message.attachments.size * 5)
            break;
        case '662287174691192832': //good-vibes
            increment = 1
            break;
        case '662287308032311307': //bad-vibes
            increment = 1
            break;
        case '641677806413283328': //gaming
            increment = 1 + (message.attachments.size * 3)
            break;
        case '685404830575231040': //sweety
            increment = 1
            break;
        case '710411736381128715': //stream-highlights
            increment = 0 + (message.embeds.length * 5)
            break;
        case '641674197814476830': //share-your-work
            increment = 1 + (message.attachments.size * 5)
            break;
        case '669958317711425556': //critique-your-work
            increment = 1
            break;
        case '679246697091825675': //promote-your-work
            increment = 2 + (message.embeds.length * 2)
            break;
        case '685192557226885155': //test-channel
            increment = 2
            break;
    }

    if (message.author.bot || message.author.self) return;

    try {
        const match = await level.findOne({
            where: {
                user_id: message.author.id
            }
        });
        if (match) {
            match.increment('xp', {
                by: increment
            });
            console.log(`${message.guild.members.cache.get(match.user_id).displayName} now has ${match.xp} xp`)
        } else {
            const match = await level.create({
                user_id: message.author.id,
                xp: 0,
                level: 0
            });
            let firstMessageEmbed = new Discord.MessageEmbed()
                .setTitle('**First Message**')
                .setDescription(`**${message.guild.members.cache.get(match.user_id)}** send their first message`)
                .setColor("#45959f")
                .addFields({
                    name: 'Channel',
                    value: message.channel.name,
                    inline: true
                }, {
                    name: 'Message',
                    value: message.content,
                    inline: true
                })
                .setTimestamp()
                .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
            return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(firstMessageEmbed);
        }
    } catch (e) {
        return console.log(e);
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!message.content.startsWith(prefix) || message.author.bot || message.author.self || !client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
};