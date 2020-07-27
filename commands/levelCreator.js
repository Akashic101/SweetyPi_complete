const Sequelize = require('sequelize');

const levelSeq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'level.sqlite',
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

xp.sync()

module.exports = {
	name: 'levelcreator',
	description: 'creates levels',
	async execute(client, message, args) {

        const level = await xp.create({
            level: 0,
            minimum: 0,
            maximum: 5
        });
        console.log(`Level ${level.level}: from ${level.minimum} to ${level.maximum}`);

        var min = 0;
        var max = 5;

        try {
            for (var i = 1; i <= 1000; i++) {
                min = max + 1;
                max = (max + 5 + (i * 2));
                const level = await xp.create({
                    level: i,
                    minimum: min,
                    maximum: max
                });
                console.log(`Level ${level.level}: from ${level.minimum} to ${level.maximum}`);
            }
        } catch (e) {
            console.log(e)
        }
	},
};