import { Message } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "setrolelimit",
	description: "Sets the role member limit in a guild",
	usage: "setrolelimit {number}",
	args: "multiple",
	commandGroup: "Setups",
	commandGroupName: "setrolelimit",
	async execute(
		message: Message,
		args: string,
		client: ClientExtensionInterface
	) {
		const guildid = message.guild?.id;
		if (!message.member?.permissions.has("MANAGE_GUILD"))
			return message
				.reply("You do not have the permission to use this command!")
				.catch();
		if (args.length == 0)
			return message
				.reply("Please provide a number to for the role limit! `")
				.catch();
		if (isNaN(parseInt(args[0])))
			return message.reply("Only provide a number in this command!").catch();
		const limit: number = parseInt(args[0]);
		const setLimit = await client.ClientDatabase.guildData
			.findOneAndUpdate(
				{
					guildID: guildid,
				},
				{
					$set: {
						boostRoleLimit: limit,
					},
				},
				{
					upsert: true,
				}
			)
			.catch();
		if (!setLimit)
			return message
				.reply(
					"I have failed to set the role limit. Please try again or contact an admin."
				)
				.catch();
		return message
			.reply("I have set the server role limit to " + "`" + limit + "`")
			.catch();
	},
};
