import { Message } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "deleterole",
	description: "Deletes a custom role and tokens in the mentioned name",
	usage: "deleterole " + "`{mention}`",
	args: "single",
	commandGroup: "Booster",
	commandGroupName: "deleterole",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		if (!message.member?.permissions.has("MANAGE_GUILD"))
			return message
				.reply("You do not have the permission to use this command!")
				.catch();
		if (!message.mentions?.members?.first())
			return message.reply("Please mention a user in this command").catch();
		const guildid = message.guild?.id;
		const memberid = message.mentions.members.first()?.id;
		await client.ClientDatabase.boostertoken.findOneAndDelete({
			guildid: guildid,
			memberid: memberid,
		});
		const roleQuery = await client.ClientDatabase.boosterroles
			.find({ guildID: guildid, memberID: memberid })
			.catch();
		if (roleQuery.length == 0)
			return message
				.reply(
					"I have deleted any custom roles and available tokens from member " +
						"`" +
						message.mentions.members.first()?.user.username +
						"`"
				)
				.catch();
		const roleid = roleQuery[0].roleID;
		await message.guild?.roles.cache.get(roleid)?.delete().catch();
		await client.ClientDatabase.boosterroles
			.findOneAndDelete({ guildID: guildid, memberID: memberid })
			.catch((err: any) => {
				console.log(err);
			});
		await message.mentions.members
			.first()
			?.send(
				"Your claimed custom roles and any available tokens has been deleted. If you think this is a mistake then please contact an admin for further details."
			)
			.catch();
		return message
			.reply(
				"I have deleted any custom roles and available tokens from member " +
					"`" +
					message.mentions.members.first()?.user.username +
					"`"
			)
			.catch();
	},
};
