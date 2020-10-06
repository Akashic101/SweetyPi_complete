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
    name: 'add',
    description: 'Adds a user to the social-media-database',
    args: true,
    args_length: 3,
    channel: ['approval-channel', 'testing'],
    modOnly: true,
    color: '#EB0066',
    async execute(client, message, args) {

        try {
            const match = await SocialMedia.create({
                platform: args[0],
                username: args[1],
                link: args[2]
            });
            let addEmbed = new Discord.MessageEmbed()
                .setTitle('**New Appoval requested**')
                .addFields({
                    name: 'User',
                    value: args[1],
                    inline: true
                }, {
                    name: 'platform',
                    value: args[0],
                    inline: true
                }, {
                    name: 'Link',
                    value: args[2],
                    inline: true
                })
                .setColor("ff0000")
                .setTimestamp()
                .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
            return message.channel.send(addEmbed)
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.channel.send('That link already exists');
            } else {
                clientDIS.users.cache.get('320574128568401920').send('error: ' + e);
            }
        }
    }
};