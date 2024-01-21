import { Message } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "ping",
	description: "Ping!",
	usage: "ping",
	args: "multiple",
	commandGroup: "Utils",
	commandGroupName: "ping",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		const messageTimeSent = message.createdAt.getTime();
		const timeNow = new Date().getTime();
		const timeDiff = Math.abs(messageTimeSent - timeNow);

		const newMessage = await message
			.reply(`Pong! Execution time ` + "`" + timeDiff + "`" + " ms")
			.catch();
		const newMessageTimeSent = Math.abs(
			newMessage.createdAt.getTime() - messageTimeSent
		);
		return newMessage
			.edit(
				`Pong! Execution time ` +
					"`" +
					timeDiff +
					"ms`" +
					" Round Trip time " +
					"`" +
					newMessageTimeSent +
					"ms`"
			)
			.catch();
	},
};
