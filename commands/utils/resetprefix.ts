import { Message } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "resetprefix",
	description: "Resets the prefix for the bot",
	usage: "resetprefix",
	args: "multiple",
	commandGroup: "Utils",
	commandGroupName: "resetprefix",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		if (!message.member?.permissions.has("MANAGE_GUILD"))
			return message
				.reply("You do not have any permission to use this command!")
				.catch();
		const set = await client.ClientDatabase.setAsync(
			`prefix:${message.guild?.id}`,
			client.PREFIX
		);
		if (set == "OK") {
			return message
				.reply("I have set your prefix to " + "`" + client.PREFIX + "`!!!")
				.catch();
		} else {
			return message
				.reply(
					"It seems like there has been a problem setting the prefix for this server. Please try again or contact an admin!"
				)
				.catch();
		}
	},
};
