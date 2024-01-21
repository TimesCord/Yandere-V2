import { Message } from "discord.js";
import { generate } from "shortid";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "setreaction",
	description: "Sets a reaction message",
	usage: "setreaction {trigger}|{reaction}",
	args: "single",
	commandGroup: "Setups",
	commandGroupName: "setboost",
	async execute(
		message: Message,
		args: string,
		client: ClientExtensionInterface
	) {
		const guildid = message.guild?.id;
		const prefix = await client.ClientFunction.getprefix(
			client,
			message.guild?.id
		);
		if (!message.member?.permissions.has("MANAGE_GUILD"))
			return message
				.reply("You do not have the permission to use this command!")
				.catch();
		if (args.length == 0)
			return message
				.reply(
					"Please provide a trigger word and a reaction message with the following format \n " +
						"`" +
						prefix +
						"setreaction {trigger word} | {trigger message} `"
				)
				.catch();

		const reactionid: string = generate();
		const triggerMessage = args.split("|")[0] as string;
		const reactionMessage = args.split("|")[1] as string;
		if (!triggerMessage || !reactionMessage)
			return message
				.reply(
					"There is not enough arguments to set a reaction message! Please follow the following format :\n " +
						"Please provide a trigger word and a reaction message with the following format \n " +
						"`" +
						prefix +
						"| {trigger word} | {trigger message} `"
				)
				.catch();
		await client.ClientDatabase.messageReaction
			.findOneAndUpdate(
				{
					guildid: guildid,
					reactionid: reactionid,
				},
				{
					guildid: guildid,
					reactionid: reactionid,
					trigger: triggerMessage,
					reaction: reactionMessage,
				},
				{
					upsert: true,
				}
			)
			.catch(() => {
				return message
					.reply(
						"There seems to be a problem saving this reaction message. Please try again or contact an administrator!"
					)
					.catch();
			});
		return message.reply(`I have set a new reaction message!`).catch();
	},
};
