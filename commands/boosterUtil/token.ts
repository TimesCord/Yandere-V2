import { Message, MessageEmbed } from "discord.js";
import { ClientExtensionInterface } from "../../types";
module.exports = {
	name: "token",
	description: "Lists available tokens in your name",
	usage: "token",
	args: "single",
	commandGroup: "Booster",
	commandGroupName: "token",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		const prefix: string =
			client.PREFIX ||
			(await client.ClientFunction.getprefix(client, message.guild?.id));
		const tokenQuery = await client.ClientDatabase.boostertoken.find({
			guildid: message.guild?.id,
			memberid: message.member?.id,
		});
		if (tokenQuery.length == 0)
			return message
				.reply(
					"Either you are not a booster of this server or your token doesn't exist."
				)
				.catch();
		const token = tokenQuery[0].token;
		const tokenEmbed = new MessageEmbed()
			.setThumbnail(client.user?.avatarURL() as string)
			.setAuthor({
				name: `Thank you so much for boosting the server ${message.member?.displayName}!!!`,
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
		return message
			.reply({
				embeds: [tokenEmbed],
			})
			.catch();
	},
};
