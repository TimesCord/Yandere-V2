import { Message, MessageEmbed } from "discord.js";
import { ClientExtensionInterface } from "../../types";
import { generate } from "shortid";
module.exports = {
	name: "givetoken",
	description: "Gives a token to a member",
	usage: "token",
	args: "single",
	commandGroup: "Booster",
	commandGroupName: "givetoken",
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
			return message
				.reply("Please mention a member you want to give a token to.")
				.catch();
		const mentionedid = message.mentions?.members?.first()?.id as string;
		const roleQuery = await client.ClientDatabase.boosterroles.find({
			guildID: message.guild?.id,
			memberID: mentionedid,
		});
		if (roleQuery.length != 0) {
			const roleid = roleQuery[0].roleID;
			if (message.guild?.roles.cache.has(roleid)) {
				return message
					.reply(
						"It seems like this member already has an active role created."
					)
					.catch();
			} else {
				await client.ClientDatabase.boosterroles
					.findOneAndDelete({
						guildID: message.guild?.id,
						memberID: mentionedid,
					})
					.catch();
				return message
					.reply(
						"It seems like this member already has an active role created."
					)
					.catch();
			}
		}
		const tokenQuery = await client.ClientDatabase.boostertoken.find({
			guildid: message.guild?.id,
			memberid: mentionedid,
		});
		if (tokenQuery.length != 0)
			return message
				.reply(
					"This member already has a token in their name. You cannot give another token."
				)
				.catch();

		const prefix: string =
			client.PREFIX ||
			(await client.ClientFunction.getprefix(client, message.guild?.id));
		const token = generate();
		await client.ClientDatabase.boostertoken
			.findOneAndUpdate(
				{
					guildid: message.guild?.id,
					memberid: mentionedid,
				},
				{
					guildid: message.guild?.id,
					memberid: mentionedid,
					token: token,
				},
				{
					upsert: true,
				}
			)
			.catch((err: any) => {
				return message
					.reply(
						"It seems like i am unable to give this member a token. Please try again or contact an admin."
					)
					.catch();
			});
		const tokenEmbed = new MessageEmbed()
			.setThumbnail(client.user?.avatarURL() as string)
			.setAuthor({
				name: `Thank you so much for boosting the server ${
					message.mentions?.members.first()?.user.username
				}!!`,
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
				text: "Please contact an admin for futher details!",
			});
		return message.mentions?.members
			?.first()
			?.send({
				embeds: [tokenEmbed],
			})
			.catch((err: any) => {
				message
					.reply(
						"This member does not have their Direct Messages open. Please contact the user to use the command 'token' !"
					)
					.catch();
			});
	},
};
