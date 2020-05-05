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

clientTWI.on('connected', (address, port) => {
    clientTWI.action('Redfur_13', 'SweetyBot has awoken from her slumber');
});

clientTWI.on('chat', (channel, user, message, self) => {
    if(self) return;
    const commandmessage = message.trim().toLowerCase();

    if (commandmessage === '!instagram' || commandmessage === '!insta') {
        clientTWI.say('Redfur_13', 'https://www.instagram.com/sweetycomics')
    }

    if (commandmessage === '!discord') {
        clientTWI.say('Redfur_13', 'https://discordapp.com/invite/U4rymnU')
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
});

//----------------------------------------------------------------------------------