const Sequelize = require('sequelize');
const Discord = require('discord.js');
const client = new Discord.Client();
const pjson = require('../package.json');
const validUrl = require('valid-url');
const url = require('url');

const comicsSeq = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'comics.sqlite',
});

const comics = comicsSeq.define('comics', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
    },
    image: {
        type: Sequelize.STRING,
        unique: true,
    },
    instagram: {
        type: Sequelize.STRING,
        unique: true,
    },
});

module.exports = {
    name: 'addcomic',
    description: 'Adds a comic to the database',
    args: true,
    modOnly: true,
    log: true,
    async execute(message, args) {

        if (validUrl.isUri(args[0]) && validUrl.isUri(args[1])) {

            const imgurURL =
                url.parse(args[0]);

            const instaURL =
                url.parse(args[1]);

            if (imgurURL.hostname == "imgur.com" && instaURL == "instagram.com") {
                try {
                    const add = await comics.create({
                        image: args[0],
                        instagram: args[1]
                    });
                    return message.channel.send(`Comic ${add.image} with link ${add.instagram} added.`);

                } catch (e) {
                    if (e.image === 'SequelizeUniqueConstraintError') {
                        return message.channel.send('That comic already exists.');
                    }
                    return message.channel.send('Something went wrong with adding a link.');
                }
            } else {
                message.reply('seems like the first argument was not a link from Imgur or the second argument not from Instagram')
            }
        } else {
            message.reply("seems like either one or both of the arguments were not a valid Link")
        }
    },
};