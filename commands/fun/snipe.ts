import { Message, MessageEmbed } from "discord.js";
import {
	ClientExtensionInterface,
	messageDeleteContent,
	messageDeleteHeader,
} from "../../types";
module.exports = {
	name: "snipe",
	description: "Snipes a deleted message!",
	usage: "snipe {number}",
	args: "multiple",
	commandGroup: "Fun",
	commandGroupName: "snipe",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		const channelid: string = message.channel.id;
		if (!client.ClientCollection.deleteSnipes.has(channelid))
			return message.reply("There is nothing to snipe!").catch();
		var snipeIndex: number = 0;
		if (
			args.length != 0 &&
			!isNaN(parseInt(args[0]) - 1) &&
			parseInt(args[0]) > 0
		) {
			snipeIndex = parseInt(args[0]) - 1;
		}
		const snipeDataArray = client.ClientCollection.deleteSnipes.get(
			channelid
		) as messageDeleteHeader[];
		if (snipeDataArray.length == 0)
			return message.reply("There is nothing to snipe!").catch();
		if (snipeDataArray[snipeIndex] === undefined)
			return message.reply("There is nothing to snipe!").catch();
		const snipeData: messageDeleteContent = snipeDataArray[snipeIndex].data;
		const snipeEmbed = new MessageEmbed()
			.setTitle("Snipe!")
			.setAuthor({
				name: snipeData.author,
				iconURL: snipeData.member?.user.displayAvatarURL() as string,
			})
			.setDescription(snipeData.content)
			.setFooter({
				text: "Bang!",
			})
			.setColor(client.ClientFunction.generateColor())
			.setTimestamp();
		if (snipeData.image != null) snipeEmbed.setImage(snipeData.image);
		return message.channel
			.send({
				embeds: [snipeEmbed],
			})
			.catch();
	},
};
