const tmi = require('tmi.js');
const Sequelize = require('sequelize');
require('dotenv').config();
var cron = require('node-cron');
const fs = require('fs');

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
})

var botMessage = false;

const botOptions = {
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

const client = new tmi.client(botOptions);

client.connect();

//Send a message whenever the bot connected to the stream
client.on('connected', (address, port) => {
    setInterval(() => {
        messageInterval();
    }, 1800000);
});

function messageInterval() {
    if (botMessage) {
        client.say("Redfur_13", "If you're a sub or a patron, you get access to exclusive comics over on the discord server! https://discordapp.com/KTFBR8A");
        botMessage = false;
    }
    if (!botMessage) {
        client.say("Redfur_13", "Made a clip you want to share? Post it in the #stream-highlights channel on our Discord server! redfur4NoTouch https://discordapp.com/KTFBR8A")
        botMessage = true;
    }
}

//listens to incoming chat-messages
client.on('chat', async (channel, user, message, self) => {
    if (self) return;
    const commandmessage = message.trim().toLowerCase();

    if (commandmessage === '!pun') {
        fs.readFile('./json/pun.json', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            data++;
            client.say('Redfur_13', `There has been ${data} puns so far`)

            fs.writeFile('./json/pun.json', data, function (err) {
                if (err) return console.log(err);
            });
        });
    }

    if (commandmessage === '!roulette') {
        var random_number = Math.round(Math.random() * 6 + 1);
        if (random_number == 1) {
            if(user.username == "Rarin") {
                client.say('Redfur_13', `${user.username} got bullied by the bot because he deserves it`)
                client.timeout("Redfur_13",  user.username, 60, "BAMM You are dead")
            }
            client.say('Redfur_13', `${user.username} died. F`)
            client.timeout("Redfur_13",  user.username, 60, "BAMM You are dead")
        } else {
            client.say('Redfur_13', `Congratz ${user.username} on surviving. Wanna push your luck and try again?`)
        }
    }

    if (commandmessage === '!guest') {
        client.say('Redfur_13', 'redfur4Love https://www.multitwitch.tv/redfur_13/doodleforfood redfur4Love')
    }

    if (commandmessage === '!social' || commandmessage === '!socials') {
        client.say('Redfur_13', 'Instagram: https://www.instagram.com/sweetycomics, Discord: https://discordapp.com/invite/KTFBR8A, Webtoons: https://www.webtoons.com/en/challenge/sweety-comics/list?title_no=389966')
    }

    if (commandmessage === '!tapas') {
        client.say('Redfur_13', 'https://tapas.io/series/Sweety-Comics')
    }

    if (commandmessage === '!instagram' || commandmessage === '!insta') {
        client.say('Redfur_13', 'https://www.instagram.com/sweetycomics')
    }

    if (commandmessage === '!discord') {
        client.say('Redfur_13', 'https://discordapp.com/invite/KTFBR8A')
    }

    if (commandmessage === '!music') {
        client.say('Redfur_13', 'Join #Stream Music to listen to some awesome tunes redfur4Love https://discordapp.com/invite/KTFBR8A')
    }

    if (commandmessage === '!facebook' || commandmessage === '!fb') {
        client.say('Redfur_13', 'https://www.facebook.com/Redfur13-2323949451264229/?ref=aymt_homepage_panel&eid=ARBQBOOYhk572IzVWcoV08jK4-y8bf8sSRWQ-KRxqrryne0yGezIFTfZzgmEUg78Xn3D0VU15YKeTW2A')
    }

    if (commandmessage === '!youtube' || commandmessage === '!yt') {
        client.say('Redfur_13', 'https://www.youtube.com/channel/UCEefUPort7KP98FpTQGv91A')
    }

    if (commandmessage === '!twitter') {
        client.say('Redfur_13', 'https://twitter.com/redfur13')
    }

    if (commandmessage === '!webtoon' || commandmessage === '!webtoons') {
        client.say('Redfur_13', 'https://www.webtoons.com/en/challenge/sweety-comics/list?title_no=389966')
    }

    if (commandmessage === '!fiverr') {
        client.say('Redfur_13', 'https://www.fiverr.com/share/9dNkgd')
    }

    if (commandmessage === '!command' || commandmessage === '!commands') {
        client.say('Redfur_13', '!instagram, !discord, !facebook, !youtube, !twitter, !webtoon, !fiverr')
    }

    if (commandmessage === '!uptime') {
        client.say('Redfur_13', 'The hell do I know, I\'m a cat')
    }

    if (commandmessage === '!hyello') {

        var message = 'Hyello, welcome to my stream';
        var newMessage = '';

        for (var i = 0; i < message.length; i++) {
            var random_number = Math.round(Math.random() * 10 + 1);
            if (random_number % 2 == 0) {
                newMessage += message.charAt(i).toUpperCase();
            } else {
                newMessage += message.charAt(i).toLowerCase();
            }
        }
        client.say('Redfur_13', `redfur4Hyello ${newMessage} redfur4Hyello`)
    }

    if (commandmessage === '!hi') {
        client.say('Redfur_13', 'Hello ' + user.username + ' >^ω^<')
    }

    if (commandmessage === '!quit') {
        client.say('Redfur_13', `shutting down...`)
    }

    if (commandmessage === '!exit') {
        client.say('Redfur_13', `shutting down...`)
    }

    if (commandmessage === '!shake') {

        var successMessage = [
            'Shakes paw',
            'Lifts paw'
        ]

        var failureMessage = [
            'Stares into your soul',
            'Does nothing',
            'Meows',
            'Headbutts',
            'Demands a treat',
            'Screams',
            'Walks away',
            'Ignores you',
            'Stares',
            'demands headscratches'
        ]

        var randomNumber = Math.floor((Math.random() * 100) + 1);
        if (randomNumber >= 1 && randomNumber <= 20) {
            var randomMessage = Math.floor((Math.random() * 2) + 1);
            client.say('Redfur_13', `/me ${successMessage[randomMessage - 1]}`)
        } else {
            var randomNumber = Math.floor((Math.random() * failureMessage.length) + 1);
            client.say('Redfur_13', `/me ${failureMessage[randomNumber- 1]}`)
        }
    }

    if (commandmessage === '!love') {
        client.say('Redfur_13', 'redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love ')
    }

    if (commandmessage === '!sweety') {
        try {
            const match = await SweetyImages.findOne({
                order: Sequelize.literal('random()')
            })
            if (match) {
                match.increment('usage_count');
                return client.say('Redfur_13', "" + match.link);
            } else {
                return client.say('something broke and I don\'t know what');
            }
        } catch (e) {
            client.say("error: " + e);
        }
    }

    if (commandmessage === '!comic') {
        try {
            const match = await comics.findOne({
                order: Sequelize.literal('random()')
            })
            if (match) {
                return client.say('Redfur_13', "" + match.instagram);
            } else {
                return client.say('something broke and I don\'t know what');
            }
        } catch (e) {
            client.say("error: " + e);
        }
    }

    if (commandmessage === '!thanks') {
        var messages = [
            "No problem",
            "Glad to help",
            "Just doing my job",
            "What can I say except you're welcome",
            "Meow Meow"
        ]

        var message = messages[Math.floor(Math.random() * messages.length)];

        client.say('Redfur_13', message + " " + user.username);
    }
});

//reacts when someone cheered more then 100 bits
client.on("cheer", (channel, userstate, message) => {
    if (userstate.bits < 100) {
        return;
    } else {
        client.say('Redfur_13', "redfur4Love redfur4Love " + userstate.username + " has cheered " + userstate.bits + " beans redfur4Love redfur4Love");
        //client.channels.cache.get(chitchatChannel).send("<:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440> " + userstate.username + " has cheered " + userstate.bits + " beans during Redfur's stream <:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440>");
    }
});

//reacts when someone subscribed
client.on("subscription", (channel, username, method, message, userstate) => {
    client.say('Redfur_13', "redfur4Love redfur4Love " + username + " just subscribed! redfur4Love redfur4Love ");
    //client.channels.cache.get(chitchatChannel).send("<:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440> " + username + " just subscribed during Redfur's stream <:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440>");
});

//Username gifted a subscription to recipient in a channel.
client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    let senderCount = ~~userstate["msg-param-sender-count"];
    client.say('Redfur_13', "redfur4Love redfur4Love " + username + " just gifted a subscription to " + recipient + " redfur4Love redfur4Love ");
    //client.channels.cache.get(chitchatChannel).send("<:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440> " + username + " just gifted a subscription to " + recipient  + " <:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440>");
});

//reacts when someone gifted a mystery-subscription
client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
    let senderCount = ~~userstate["msg-param-sender-count"];
    client.say('Redfur_13', "redfur4Love redfur4Love " + username + " just gifted " + numbOfSubs + " mystery-subscriptions. He gifted in total " + senderCount + " subscriptions redfur4Love redfur4Love ");
    //client.channels.cache.get(chitchatChannel).send("<:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440> " + username + " just gifted " + numbOfSubs + " mystery-subscriptions. He gifted in total " + senderCount + " subscriptions <:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440>");
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
    let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    client.say('Redfur_13', "redfur4Love redfur4Love " + username + " just continued his subscription. He is now subscribed since " + cumulativeMonths + " months redfur4Love redfur4Love");
    //client.channels.cache.get(chitchatChannel).send("<:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440> " + username + " just continued his subscription. He is now subscribed since " + cumulativeMonths + " months <:Sweety_scared:713075786713661440> <:Sweety_scared:713075786713661440>");
});

cron.schedule('0,30 0-23 * * *', () => {

    var messages = [
        "If you're a sub or a patron, you get access to exclusive comics over on the discord server! https://discordapp.com/KTFBR8A",
        "Made a clip you want to share? Post it in the #stream-highlights channel on our Discord server! redfur4NoTouch https://discordapp.com/KTFBR8A",
        "Stream is a little quiet isn't it? Join the Discord server voice chat to have some music! https://discordapp.com/KTFBR8A",
        "Want to watch both streams at the same time? Click here: https://www.multitwitch.tv/redfur_13/doodleforfood"
    ]
    var item = messages[Math.floor(Math.random() * messages.length)];

    client.say("Redfur_13", item);
});