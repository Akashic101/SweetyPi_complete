const Sequelize = require('sequelize');

const levelSeq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'level.sqlite',
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

module.exports = {
	name: 'levelcreator',
	description: 'creates levels',
	async execute(client, message, args) {

        const level = await levelTable.create({
            level: 0,
            xp_needed: 0
        });

        var min = 0;
        var max = 5;

        try {
            for (var i = 1; i <= 1000; i++) {
                min = max + 1;
                max = (max + 5 + (i * 2));
                const level = await levelTable.create({
                    level: i,
                    xp_needed: min
                });
                console.log(`Level ${levelTable.level} needs ${levelTable.xp_needed} XP`);
            }
            message.channel.send(`All levels have been succesfully added`)
        } catch (e) {
            console.log(e)
        }
	},
};