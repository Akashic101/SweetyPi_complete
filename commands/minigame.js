const Discord = require('discord.js');
const pjson = require('../package.json');
const quiz = require('../json/quiz.json');

module.exports = {
    name: 'minigame',
    description: 'Let\'s the user play a random minigame',
    async execute(client, message, args) {

        var minigame = Math.floor((Math.random() * 3) + 1);
        switch (minigame) {
            case 1:
                var auswahl = Math.floor((Math.random() * 2) + 1);

                var filter = (reaction, user) => {
                    return ['⚔️', '🏹'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                var minigameEmbed = new Discord.MessageEmbed()
                    .setTitle('**Heads or Tails**')
                    .setDescription('Choose your side')
                    .setColor('RANDOM')
                    .setTimestamp()
                    .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
                var msg = await message.channel.send(minigameEmbed)

                msg.react('⚔️').then(() => msg.react('🏹'));

                msg.awaitReactions(filter, {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    })
                    .then(collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name === '⚔️') {
                            if (auswahl == 1) {
                                message.channel.send(`Congratz ${message.author}, you won :)`)
                            } else {
                                message.channel.send(`Sorry ${message.author}, that was wrong. Maybe you win next time`)
                            }
                        } else {
                            if (auswahl == 0) {
                                message.channel.send(`Congratz ${message.author}, you won :)`)
                            } else {
                                message.channel.send(`Sorry ${message.author}, that was wrong. Maybe you win next time`)
                            }
                        }
                    })
                    .catch(collected => {});
                break;
            case 2:
                var auswahl = Math.floor((Math.random() * 5) + 1);
                var filter = (reaction, user) => {
                    return ['💛', '❤️', '💙', '🧡', '💚'].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id;
                };

                var minigameEmbed = new Discord.MessageEmbed()
                    .setTitle('**Follow your heart**')
                    .setDescription('Choose the right colored heart')
                    .setColor('RANDOM')
                    .setTimestamp()
                    .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
                var msg = await message.channel.send(minigameEmbed)

                msg.react('💛').then(() => msg.react('❤️')).then(() => msg.react('💙')).then(() => msg.react('🧡')).then(() => msg.react('💚'));

                msg.awaitReactions(filter, {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    })
                    .then(collected => {
                        const reaction = collected.first();
                        switch (reaction.emoji.name) {
                            case '💛':
                                if (auswahl == 1) {
                                    message.channel.send(`Congratz ${message.author}, you won :)`)
                                } else {
                                    message.channel.send(`Sorry ${message.author}, that was wrong. Maybe you win next time`)
                                }
                                break;
                            case '❤️':
                                if (auswahl == 2) {
                                    message.channel.send(`Congratz ${message.author}, you won :)`)
                                } else {
                                    message.channel.send(`Sorry ${message.author}, that was wrong. Maybe you win next time`)
                                }
                                break;
                            case '💙':
                                if (auswahl == 3) {
                                    message.channel.send(`Congratz ${message.author}, you won :)`)
                                } else {
                                    message.channel.send(`Sorry ${message.author}, that was wrong. Maybe you win next time`)
                                }
                                break;
                            case '🧡':
                                if (auswahl == 4) {
                                    message.channel.send(`Congratz ${message.author}, you won :)`)
                                } else {
                                    message.channel.send(`Sorry ${message.author}, that was wrong. Maybe you win next time`)
                                }
                                break;
                            case '💚':
                                if (auswahl == 5) {
                                    message.channel.send(`Congratz ${message.author}, you won :)`)
                                } else {
                                    message.channel.send(`Sorry ${message.author}, that was wrong. Maybe you win next time`)
                                }
                                break;
                        }
                    })
                    .catch(collected => {});
                break;
            case 3:
                var item = quiz[Math.floor(Math.random() * quiz.length)];
                var filter = response => {
                    return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
                };

                var questionEmbed = new Discord.MessageEmbed()
                                .setTitle('**Quiz**')
                                .setDescription(item.question)
                                .setColor('RANDOM')
                                .setTimestamp()
                                .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');

                message.channel.send(questionEmbed).then(() => {
                    message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        })
                        .then(collected => {
                            var correctAnswerEmbed = new Discord.MessageEmbed()
                                .setTitle('**Correct answer**')
                                .setDescription(item.footnote)
                                .setColor('RANDOM')
                                .setTimestamp()
                                .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
                            message.channel.send(correctAnswerEmbed)
                        })
                        .catch(collected => {
                        });
                });
                break;
        }
    }
};