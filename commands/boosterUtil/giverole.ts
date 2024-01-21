import { Message, Role } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "giverole",
	description: "Gives a custom role to a mentioned member",
	usage: "claimrole " + "`{mention}`",
	args: "single",
	commandGroup: "Booster",
	commandGroupName: "giverole",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		var boostroleid = await client.ClientDatabase.getAsync(
			`boostrole:${message.guild?.id}`
		);
		if (!boostroleid) {
			const guildquery = await client.ClientDatabase.guildData.find({
				guildID: message.guild?.id,
			});
			if (guildquery.length == 0 || !guildquery[0].boosterRoleID)
				return message
					.reply(
						"It seems like this server is not configured to handle custom boost roles yet. Please contact an admin and try again later!"
					)
					.catch();
			boostroleid = guildquery[0].boosterRoleID;
			await client.ClientDatabase.setAsync(
				`boostrole:${message.guild?.id}`,
				boostroleid
			);
		}
		if (!message.guild?.roles.cache.has(boostroleid))
			return message
				.reply(
					"It seems like the boost role in this server has been deleted. Please contact an admin."
				)
				.catch();
		// if(!message.member?.roles.cache.has(boostroleid)) return message.reply("Hi! It seems like you are not a booster of this server. You're not allowed to use this command!")

		if (!message.mentions.members?.first())
			return message
				.reply("Please mention the member you want to give your role to.")
				.catch();

		const rolequery = await client.ClientDatabase.boosterroles.find({
			guildID: message.guild?.id,
			memberID: message.member?.id,
		});
		if (rolequery.length == 0)
			return message
				.reply(
					"It seems like you have not claimed your custom role yet. Please create one with the `claimrole` command!"
				)
				.catch();
		const customroleid = rolequery[0].roleID;
		const role: Role = (await message.guild?.roles.cache.get(
			customroleid
		)) as Role;
		if (!role) {
			await message
				.reply(
					"It seems like your role doesn't exist in this server. Please contact an admin!"
				)
				.catch();
			return client.ClientDatabase.boosterroles
				.findOneAndDelete({
					guildID: message.guild?.id,
					memberID: message.member?.id,
				})
				.catch();
		}
		const roleLimit = await client.ClientDatabase.guildData.find({
			guildID: message.guild?.id,
		});
		if (roleLimit.length == 0 || !roleLimit[0].boostRoleLimit)
			return message
				.reply(
					"It seems like this server is not configured to for this command to work. Please try again or contact an admin!"
				)
				.catch();
		const roleMemberSize: number = message.guild.roles.cache.get(customroleid)
			?.members.size as number;
		if (roleMemberSize > roleLimit[0].boostRoleLimit)
			return message
				.reply(
					"You have reached the maximum allowed members for this custom role!"
				)
				.catch();
		await message.mentions.members
			?.first()
			?.roles.add(role)
			.catch((err) => {
				return message.reply(
					"It seems like I am unable to give them your role! Please try again or contact an admin."
				);
			});
		return message
			.reply(
				"I have added the role " +
					"`" +
					`${role.name}` +
					"`" +
					" to " +
					"`" +
					message.mentions.members.first()?.user.tag +
					"`"
			)
			.catch();
	},
};
