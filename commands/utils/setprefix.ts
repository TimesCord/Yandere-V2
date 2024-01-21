import { Message } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "setprefix",
	description: "Sets the prefix for the bot",
	usage: "setprefix {new prefix}",
	args: "multiple",
	commandGroup: "Utils",
	commandGroupName: "setprefix",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		if (!message.member?.permissions.has("MANAGE_GUILD"))
			return message
				.reply("You do not have any permission to use this command!")
				.catch();
		if (args.length == 0)
			return message.reply("Please provide a new prefix to the bot!").catch();
		await client.ClientDatabase.setAsync(
			`prefix:${message.guild?.id}`,
			args[0]
		);
		const verifyprefix = await client.ClientFunction.getprefix(
			client,
			message.guild?.id
		);
		if (args[0] == verifyprefix) {
			return message
				.reply("I have set your prefix to " + "`" + verifyprefix + "`!!!")
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
