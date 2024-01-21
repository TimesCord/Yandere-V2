import { Message } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "setboost",
	description: "Sets the boost role for the server.",
	usage: "setboost {role id}",
	args: "multiple",
	commandGroup: "Setups",
	commandGroupName: "setboost",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		if (!message.member?.permissions.has("MANAGE_GUILD"))
			return message
				.reply("You do not have the permission to use this command!")
				.catch();
		if (args.length == 0)
			return message
				.reply("Please provide the role id of your booster role!")
				.catch();
		const roleid: string = args[0];
		//Verify if the role exists in the guild
		if (!message.guild?.roles.cache.has(roleid))
			return message
				.reply("The role you provided doesn't exist in the guild!")
				.catch();
		const roledata = message.guild.roles.cache.get(roleid)?.name;

		const guilddata = client.ClientDatabase.guildData;
		var mongooseWrite = await guilddata
			.findOneAndUpdate(
				{
					guildID: message.guild.id,
				},
				{
					guildID: message.guild.id,
					$set: {
						boosterRoleID: roleid,
						boostRoleLimit: 20,
					},
				},
				{
					upsert: true,
				}
			)
			.then((data: any, error: void) => {
				if (data) return true;
			})
			.catch();

		const rediswrite = await client.ClientDatabase.setAsync(
			`boostrole:${message.guild.id}`,
			roleid
		).catch();
		if (mongooseWrite && rediswrite == "OK") {
			return message
				.reply(
					`I have set the booster role of this server to ` +
						"`" +
						roledata +
						"`!!!"
				)
				.catch();
		}
	},
};
