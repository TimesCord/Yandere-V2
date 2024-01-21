import { Message, TextChannel } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "slowmode",
	description: "Sets the slowmode limit for the channel.",
	usage: "slowmode | slowmode {time in seconds}",
	args: "multiple",
	commandGroup: "moderation",
	commandGroupName: "slowmode",
	async execute(
		message: Message,
		args: string[],
		client: ClientExtensionInterface
	) {
		if (!message.member?.permissions.has("MANAGE_CHANNELS"))
			return message
				.reply("You don't have the permission to use this command!")
				.catch();
		const channel = message.channel as TextChannel;
		if (args.length == 0) {
			channel.setRateLimitPerUser(0, "Invoked by bot");
			return message
				.reply("I have turned off the slowmode on this channel!")
				.catch();
		}
		if (args.length != 0) {
			const slowmodeTime = parseInt(args[0]);
			if (isNaN(slowmodeTime))
				return message.reply("Please only provide a number!").catch();
			channel
				.setRateLimitPerUser(slowmodeTime)
				.then((data) => {
					if (data)
						return message
							.reply(
								"I have set the rate limit to " +
									"`" +
									slowmodeTime +
									"` seconds!"
							)
							.catch();
				})
				.catch((err) => {
					return message
						.reply(
							"It seems like I am not able to set the rate limit for this channel! Please check the permissions on this server."
						)
						.catch();
				});
		}
	},
};
