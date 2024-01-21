import { Message } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "setlog",
	description: "Sets the log channel for the server.",
	usage: "setlog {tag the channel}",
	args: "multiple",
	commandGroup: "Setups",
	commandGroupName: "setlog",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		if (!message.member?.permissions.has("MANAGE_GUILD"))
			return message
				.reply("You do not have the permission to use this command!")
				.catch();
		if (!message.mentions.channels.first())
			return message.reply("Please tag a channel!").catch();
		//Verify if the role exists in the guild
		const channelid = message.mentions.channels.first()?.id as string;
		const channelname = message.guild?.channels.cache.get(channelid)?.name;
		const guilddata = client.ClientDatabase.guildData;
		var mongooseWrite = await guilddata
			.findOneAndUpdate(
				{
					guildID: message.guild?.id,
				},
				{
					guildID: message.guild?.id,
					$set: {
						logChannelID: channelid,
					},
				},
				{
					upsert: true,
				}
			)
			.then((data: any, error: void) => {
				if (data) return true;
			})
			.catch(() => {
				return false;
			});

		const rediswrite = await client.ClientDatabase.setAsync(
			`logchannel:${message.guild?.id}`,
			channelid
		).catch();
		if (mongooseWrite && rediswrite == "OK") {
			return message
				.reply(
					`I have set the log channel of this server to ` +
						"`" +
						channelname +
						"`!!!"
				)
				.catch();
		}
	},
};
