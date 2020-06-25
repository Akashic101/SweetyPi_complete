#

[![GitHub issues](https://img.shields.io/github/issues/Akashic101/SweetyPi)](https://github.com/Akashic101/SweetyPi/issues) 
[![GitHub license](https://img.shields.io/github/license/Akashic101/SweetyPi)](https://github.com/Akashic101/SweetyPi/blob/master/LICENSE) 
![GitHub package.json version](https://img.shields.io/github/package-json/v/Akashic101/SweetyPi) 
![GitHub repo size](https://img.shields.io/github/repo-size/Akashic101/SweetyPi?color=blueviolet) 
![Discord](https://img.shields.io/discord/641609707848728587?color=7289DA) 
![GitHub last commit](https://img.shields.io/github/last-commit/Akashic101/SweetyPi) 

```bash
 ____                   _         ____  _
/ _____      _____  ___| |_ _   _|  _ \(_)
\___ \ \ /\ / / _ \/ _ | __| | | | |_) | |
 ___) \ V  V |  __|  __| |_| |_| |  __/| |
|____/ \_/\_/ \___|\___|\__|\__, |_|   |_|
                            |___/  
```

A Discord- and Twitch-bot for [Redfur13](https://www.instagram.com/sweetycomics/)
___

## Table of Content

* [General Info](#general-info)
* [Features](#features)
* [How to Install](#how-to-install)
* [Commands](#commands)
* [Auto launch](#auto-launch)
* [TO DO](#to-do)

## General Info

This bot was made for the Discord and [Twitch](https://www.twitch.tv/Redfur_13) of [Redfur13](https://www.instagram.com/sweetycomics/), with the goal to make it easier for people to link their social-media-platforms since her Discord is heavily art-focused. This enables others to easier find channels they would be interested in. This bot also functions as a bridge between her Discord and Twitch to enable more communication between both platforms

## Features

### Discord

Users can enter `!link <platform> <link.to.website>`. This will send an automatic message to a hidden mod-channel where the mods can
approve or deny the link  
![approval-message](https://i.imgur.com/97uTAwW.png)  
If the mods agree on adding the link to the database, a mod can use `!add <platform> <Username> <link.to.website>`, which automatically adds the account to the social-media-database. After that it can be called by everyone with  
`!<platform> username`

The bot also automatically adds a `👍` and `👎` to the critique-your-work-channel, so people can vote on others art

### Twitch

The bot can just like on Discord be used to get links to all platforms Redfur13 is using. It's also used to notify every viewer per chat if someone followed, subscribed or gifted subs/bits.

## How to Install

First you need to install [Node](https://nodejs.org/en/). After that, create and go into the folder where the bot should be in, and clone the necessary code with  
`git clone https://github.com/Akashic101/SweetyPi.git`  
When that is done, move into the directory of SweetyPi with `cd SweetyPi` use `npm install` to install all necessary dependencies.

Just to bring everything up-to-date, run `npm update` and `npm fund` after this. This is not necessary, but bringing everything up to the newest version is always a good idea.

Next, create a new file in the root-directory and name it `.env`. In that file, enter following lines and change them to your liking:  

```bash
DISCORD_TOKEN= 'your token here'  
SERVER_LOG_CHANNEL= 'id here'  
CHITCHAT_CHANNEL= 'id here'  
ART_FEEDBACK_CHANNEL= 'id here'  
APPROVAL_CHANNEL= 'id here'
IDENTITY_PASSWORD0 'password here'
```

You can get the ID of a channel by enabling Developer Mode in Discord and right-clicking on a channel, there you can copy the ID. Remember to enter them all as a String with \` at the start and the end. You can get the IDENTITY_PASSWORD by signing into your bot-account and go to <https://twitchapps.com/tmi/>, there click on `Connect` and copy the token.

After that you can launch the bot either with  
`node .`  
or  
`node index.js`

## Commands

The prefix for the commands is `!`. You can change that to your liking by edtiting the `PREFIX`-variable in Index.js

### Discord

Currently, the platforms accessible are as follows:  

* `instagram <accountName>`
* `twitch <accountName>`
* `patreon <accountName>`
* `twitter <accountName>`
* `facebook <accountName>`
* `reddit <accountName>`
* `website <accountName>`
* `github <accountName>`

Other commands are:

* `link <platform> <link.to.website>`
* `sweety`
* `uptime`
* `info`
* `commands`
* `poll <text>`  
* `schedule`
* `quote`
* `joke`

And mod-only commands are:

* `add <platform> <accountName> <link.to.website>`
* `addSweety <link>`
* `delSweety <link>`

For `addSweety` and `delSweety` it is possible to add or delete multiple images at once by seperating them with a space, for example `addSweety link1 link2 link3`

* `addStrike <username>`
* `updateStrike <username> <1-3> <reason>`
* `getStrike <username>`

### Twitch

Entering those commands will always link to the corresponding plattform of Redfur_13

* `!instagram` or `!insta`
* `!discord`
* `!facebook` or `!fb`
* `!youtube` or `!yt`
* `!twitter`
* `!webtoon` or `!webtoons!`
* `!fiverr`
* `!command` or `!commands!`

 There are also other commands such as:

* `!commands` or `!commmand`
* `!uptime`
* `!spotify`
* `!hi`
* `!quit` or `!exit`
* `!shake`
* `!sweety`

## Auto Launch

 If you want SweetyPi to automatically boot whenever your system is starting you can use [pm2](https://www.npmjs.com/package/pm2) for this. Simply install it with `npm install pm2`, but instead of launching SweetyPi with `node .` or `node index.js`, use `pm2 start index.js`. SweetyPi is now daemonized, monitored and kept alive forever. If you want to see how many resources SweetyPi is using, enter `pm2 list` or `pm2 monit` for more in-depth information

## TO DO

* ~~Add custom status to SweetyPi~~Fixed in [#2](https://github.com/Akashic101/SweetyPI/issues/2)
* ~~Rework "Member joined"~~ Fixed in [#3](https://github.com/Akashic101/SweetyPI/issues/3)
* Add proper logging with [WinstonJs](https://github.com/winstonjs/winston)
* Add more commands and features to the Twitch-version
* Add more mod-commands to both versions
* Enable Spotify-support using [Spotify-Web-Api_Node](https://github.com/thelinmichael/spotify-web-api-node)
* Add birthday-feature for Discord
