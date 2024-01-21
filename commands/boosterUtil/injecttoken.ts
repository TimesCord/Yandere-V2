import { Message, MessageEmbed, GuildMember, Collection } from "discord.js";
import { ClientExtensionInterface } from "../../types";
import { generate } from "shortid";
module.exports = {
	name: "injecttoken",
	description: "Injects a token for every booster in the guild",
	usage: "injecttoken",
	args: "single",
	commandGroup: "Booster",
	commandGroupName: "injecttoken",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		var successWrite = 0;
		var failedWrite = 0;
		var failedSend = 0;
		if (!message.member?.permissions.has("MANAGE_GUILD"))
			return message
				.reply("You do not have the permission to use this command!")
				.catch();
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
		const roleMemberList: Collection<string, GuildMember> =
			message.guild?.roles.cache.get(boostroleid)?.members as Collection<
				string,
				GuildMember
			>;
		for (const member of roleMemberList) {
			const guildMember: GuildMember = member[1];
			const guildMemberID: string = guildMember.id;
			const roleQuery = await client.ClientDatabase.boosterroles.find({
				guildID: message.guild?.id,
				memberID: guildMemberID,
			});
			if (roleQuery.length != 0) {
				failedWrite = failedWrite + 1;
			} else {
				const token = generate();
				await client.ClientDatabase.boostertoken
					.findOneAndUpdate(
						{
							guildid: message.guild?.id,
							memberid: guildMemberID,
						},
						{
							guildid: message.guild?.id,
							memberid: guildMemberID,
							token: token,
						},
						{
							upsert: true,
						}
					)
					.then(async (data: any) => {
						successWrite = successWrite + 1;
						const tokenEmbed = new MessageEmbed()
							.setThumbnail(client.user?.avatarURL() as string)
							.setAuthor({
								name: `Thank you so much for boosting the server ${guildMember.user.tag}!!`,
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
								"`" +
									`${
										(await client.ClientFunction.getprefix()) || client.PREFIX
									} claimrole ${token}` +
									"`"
							)
							.setTimestamp()
							.setColor(await client.ClientFunction.generateColor())
							.setFooter({
								text: "Please contact an admin for further details!",
							});
						await guildMember
							.send({
								embeds: [tokenEmbed],
							})
							.catch((err: any) => {
								failedSend = failedSend + 1;
							});
					})
					.catch((err: any) => {
						failedWrite = failedWrite + 1;
					});
			}
		}
		const finishedEmbed = new MessageEmbed()
			.setTitle("Finished injecting token")
			.setAuthor({
				name: "Boost token injecting system",
			})
			.addField("Success Write", successWrite.toString())
			.addField("Failed Write", failedWrite.toString())
			.addField("Failed DM's", failedSend.toString())
			.setColor(await client.ClientFunction.generateColor())
			.setFooter({
				text: "Love ya <3",
			});
		await message
			.reply({
				embeds: [finishedEmbed],
			})
			.catch();
	},
};
