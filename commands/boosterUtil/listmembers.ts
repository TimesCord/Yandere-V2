import { Message, Role, MessageEmbed } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "listmembers",
	description: "Displays the members of this role",
	usage: "listmembers " + "`{role name}`",
	args: "single",
	commandGroup: "Booster",
	commandGroupName: "listmembers",
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

		const rolemembers = rolefromid.members;
		const replyEmbed = new MessageEmbed()
			.setTitle(
				"Here is a list of members for the role " + "`" + rolefromid.name + "`"
			)
			.setColor(await client.ClientFunction.generateColor())
			.setFooter({
				text: message.guild?.name as string,
				iconURL: message.guild?.iconURL() as string,
			})
			.setTimestamp();
		var memberArray: string[] = [];
		rolemembers.forEach((member: any) => {
			const membertag = member.user.tag;
			const membertagstring = "`" + membertag + "`";
			memberArray.push(membertagstring);
		});
		memberArray.join(", ");
		replyEmbed.addField("Members", memberArray.join("\n"));
		replyEmbed.addField("Total", rolemembers.size.toString());
		return message.channel
			.send({
				embeds: [replyEmbed],
			})
			.catch();
	},
};
