const Command = require('../../structures/Command');
const math = require('mathjs');
const { stripIndents } = require('common-tags');
const { list } = require('../../structures/Util');
const difficulties = ['easy', 'medium', 'hard', 'extreme', 'impossible'];
const operations = ['+', '-', '*'];
const maxValues = {
	easy: 10,
	medium: 100,
	hard: 500,
	extreme: 1000,
	impossible: 1000000
};

module.exports = class MathGameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math-game',
			group: 'games',
			memberName: 'math-game',
			description: 'See how fast you can answer a math problem in a given time limit.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'difficulty',
					prompt: `What should the difficulty of the game be? Either ${list(difficulties, 'or')}.`,
					type: 'string',
					validate: difficulty => {
						if (difficulties.includes(difficulty.toLowerCase())) return true;
						return `Invalid difficulty, please enter either ${list(difficulties, 'or')}.`;
					},
					parse: difficulty => difficulty.toLowerCase()
				}
			]
		});
	}

	async run(msg, { difficulty }) {
		const value1 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
		const value2 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
		const operation = operations[Math.floor(Math.random() * operations.length)];
		const expression = `${value1} ${operation} ${value2}`;
		const answer = math.eval(expression).toString();
		await msg.say(stripIndents`
			**You have 10 seconds to answer this question.**
			${expression}
		`);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 10000
		});
		if (!msgs.size) return msg.say(`Time! It was ${answer}, sorry!`);
		if (msgs.first().content !== answer) return msg.say(`Nope, sorry, it's ${answer}.`);
		return msg.say('Nice job! 10/10! You deserve some cake!');
	}
};
