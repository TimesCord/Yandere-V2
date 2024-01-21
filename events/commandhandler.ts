import { Message, GuildMember } from "discord.js";
import { Command, ClientExtensionInterface } from "../types";
module.exports = {
	name: "commandhandler",
	eventName: "messageCreate",
	async execute(message: Message, client: ClientExtensionInterface) {
		if (message.member?.user.bot) return;
		const prefix =
			(await client.ClientFunction.getprefix(client, message.guild?.id)) ||
			client.PREFIX;
		if (message.author.bot) return;
		if (!message.content) return;
		const temporary = message.content.toUpperCase();
		if (temporary.indexOf(prefix.toUpperCase()) !== 0) return;
		if (client.ClientCollection.activeCommand.has(message.member?.id as string))
			return;
		let args: string[] | string = message.content
			.slice(prefix.length)
			.trim()
			.split(/ +/g);
		const commandName = args[0].toLowerCase();

		if (!client.MessageCommands.has(commandName)) {
			return message
				.reply(
					"I can't seem to find this command! Are you sure you typed it correctly?"
				)
				.catch();
		}
		args.shift();
		client.ClientCollection.activeCommand.set(
			message.member?.id as string,
			message.member as GuildMember
		);
		const command: Command = client.MessageCommands.get(commandName) as Command;

		if (command.args == "single") {
			args = args.join(" ");
		}
		await command.execute(message, args, client).catch();
		if (client.ClientCollection.activeCommand.has(message.member?.id as string))
			return client.ClientCollection.activeCommand.delete(
				message.member?.id as string
			);
	},
};
