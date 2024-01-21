import { GuildMember, MessageEmbed } from "discord.js";
import { ClientExtensionInterface } from "../types";
import { generate } from "shortid";
module.exports = {
	name: "boostdetector",
	eventName: "guildMemberUpdate",
	async execute(
		oldMember: GuildMember,
		newMember: GuildMember,
		client: ClientExtensionInterface
	) {
		const prefix =
			(await client.ClientFunction.getprefix(client, oldMember.guild.id)) ||
			client.PREFIX;
		var boostroleid: string = await client.ClientDatabase.getAsync(
			`boostrole:${oldMember.guild.id}`
		);
		if (!boostroleid) {
			const query = await client.ClientDatabase.guildData.find({
				guildID: oldMember.guild.id,
			});
			if (query.length == 0 || !query[0].boosterRoleID) return;
			boostroleid = query[0].boosterRoleID;
			await client.ClientDatabase.setAsync(
				`boostrole:${oldMember.guild.id}`,
				query[0].boosterRoleID
			).catch();
		}
		const memberid: string = oldMember.id;
		const guildid: string = oldMember.guild.id;
		if (
			!oldMember.roles.cache.has(boostroleid) &&
			newMember.roles.cache.has(boostroleid)
		) {
			const roleQuery = await client.ClientDatabase.boosterroles.find({
				guildID: guildid,
				memberID: memberid,
			});
			if (roleQuery.length != 0) return;
			const tokenQuery = await client.ClientDatabase.boostertoken.find({
				guildid: guildid,
				memberid: memberid,
			});
			if (tokenQuery.length != 0) return;
			const token: string = generate();
			const write = await client.ClientDatabase.boostertoken
				.findOneAndUpdate(
					{
						guildid: guildid,
						memberid: memberid,
					},
					{
						guildid: guildid,
						memberid: memberid,
						token: token,
					},
					{
						upsert: true,
					}
				)
				.catch((err: void) => {
					return oldMember
						.send(
							"Hi! this is the automated custom role system. Unfortunately, we are experiencing issues with the system. To claim your free role, please dm one of the staffs to claim it!"
						)
						.catch();
				});
			if (write) {
				const tokenEmbed = new MessageEmbed()
					.setThumbnail(client.user?.avatarURL() as string)
					.setAuthor({
						name: `Thank you so much for boosting the server ${oldMember.guild?.name}!!!`,
					})
					.setTitle(
						"You will be eligible to claim a free custom role from your boost!"
					)
					.setDescription(
						`To claim your free role, please enter the claim role command i have provided in the server you boosted. `
					)
					.addField("Your token is : ", "`" + `*${token}*` + "`")
					.addField(
						"Claim Role Command : ",
						"`" + `${prefix} claimrole ${token}` + "`"
					)
					.setTimestamp()
					.setColor(await client.ClientFunction.generateColor())
					.setFooter({
						text: "Please contact an admin for further details!",
					});
				return oldMember
					.send({
						embeds: [tokenEmbed],
					})
					.catch((err: any) => {
						console.error(err);
					});
			}
		}
		if (
			oldMember.roles.cache.has(boostroleid) &&
			!newMember.roles.cache.has(boostroleid)
		) {
			await client.ClientDatabase.boostertoken.findOneAndDelete({
				guildid: guildid,
				memberid: memberid,
			});
			const query = await client.ClientDatabase.boosterroles.find({
				guildID: guildid,
				memberID: memberid,
			});
			if (query.length == 0) return;
			const customroleid = query[0].roleID;
			await oldMember.guild.roles.cache.get(customroleid)?.delete().catch();
			await client.ClientDatabase.boosterroles
				.findOneAndDelete({ guildID: guildid, memberID: memberid })
				.catch();

			const expiredEmbed = new MessageEmbed()
				.setThumbnail(client.user?.avatarURL() as string)
				.setAuthor({
					name: `Your boost in the server ${oldMember.guild?.name} has expired.`,
				})
				.setDescription(
					`Any available tokens in your name has been deleted and any custom roles created will be deleted. To create a new custom roles, please re-boost the server!`
				)
				.setTimestamp()
				.setColor(await client.ClientFunction.generateColor())
				.setFooter({
					text: "Please contact an admin for further details!",
				});
			return oldMember
				.send({
					embeds: [expiredEmbed],
				})
				.catch();
		}
	},
};
