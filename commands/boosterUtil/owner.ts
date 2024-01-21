import { Message, Role } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "owner",
	description: "Displays the owner of the custom role",
	usage: "owner " + "`{role name}`",
	args: "single",
	commandGroup: "Booster",
	commandGroupName: "owner",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		if (args.length == 0)
			return message
				.reply("Please mention the role you want to check the owner of.")
				.catch();
		const role = message.guild?.roles.cache
			.filter((role: Role, key: string): boolean => {
				//use regex to match the role name
				const rolename = role.name;
				const regex = new RegExp(`${args}`, "i");
				return regex.test(rolename);
			})
			.first();
		var rolefromid: Role | undefined = role;
		if (rolefromid === undefined) {
			if (!message.guild?.roles.cache.has(args as string))
				return message
					.reply(
						"It seems like the role you mentioned doesn't exist in this server. Please try again."
					)
					.catch();
			rolefromid = message.guild?.roles.cache.get(args as string) as Role;
		}
		const rolequery = await client.ClientDatabase.boosterroles
			.find({ guildID: message.guild?.id, roleID: rolefromid.id })
			.catch((err: Error) => {
				return message
					.reply(
						"It seems like there is a problem with the database. Please contact an admin."
					)
					.catch();
			});
		if (rolequery.length == 0)
			return message
				.reply(
					"It seems like the role you are looking for doesn't have an owner. Please try again."
				)
				.catch();
		const memberid = rolequery[0].memberID;
		const member = await message.guild?.members.cache.get(memberid);
		if (!member)
			return message
				.reply(
					"It seems like the owner of this role has left the server. Please contact an admin to fix this."
				)
				.catch();
		return message
			.reply("The owner of this role is " + "`" + member.user.tag + "`")
			.catch();
	},
};
