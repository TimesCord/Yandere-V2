import { Message, MessageEmbed, Collection } from "discord.js";
import { Command, ClientExtensionInterface } from "../../types";
module.exports = {
	name: "help",
	description: "Shows the help menu or description for a command.",
	usage: "help {Command Name}",
	args: "multiple",
	commandGroup: "Utils",
	commandGroupName: "help",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		const prefix: string =
			client.PREFIX ||
			(await client.ClientFunction.getprefix(client, message.guild?.id));
		const botName: string = client.user?.username as string;
		const botTag: string = client.user?.tag as string;
		const botImage: string = client.user?.avatarURL() as string;
		if (args.length == 0) {
			const helpEmbed: MessageEmbed = new MessageEmbed()
				.setTitle(`Help module for ${botName} Discord Bot.`)
				.setDescription(
					`Welcome to the help module for ${botName} Discord Bot! Here you will find the list of commands that i may offer. If there seems to by a problem, Please contact an admin! Enjoy <3`
				)
				.addField("Usage: ", "`" + `${prefix} {command name}` + "`")
				.setAuthor({
					name: botTag,
				})
				.setThumbnail(botImage)
				.setTimestamp()
				.setFooter({
					text: `- ${botName} loves you <3`,
				})
				.setColor(client.ClientFunction.generateColor());
			const commandGroups: Collection<
				string,
				Collection<string, Command>
			> = client.MessageCommandGroups;
			for (const groups of commandGroups) {
				const groupName = groups[0].toUpperCase();
				const commandList: Collection<string, Command> = groups[1];
				const commandArray = [];
				for (const commands of commandList) {
					const commandName: string = commands[1].name;
					const parsedCommand: string = "`" + commandName + "`";
					commandArray.push(parsedCommand);
				}
				const commandArrayString = commandArray.join(", ");
				helpEmbed.addField(groupName, commandArrayString);
			}
			return message
				.reply({
					embeds: [helpEmbed],
				})
				.catch();
		} else {
			const commandName: string = args[0] as string;
			if (!client.MessageCommands.has(commandName))
				return message
					.reply(
						"I can't seem to find this command! Are you sure you typed it correctly?"
					)
					.catch();
			const commandData = client.MessageCommands.get(commandName) as Command;
			const { name, description, usage, commandGroup } = commandData;
			const helpEmbed = new MessageEmbed()
				.setTitle(`Help module for ${botName} Discord Bot.`)
				.addField("Command:", name, true)
				.addField("Group:", commandGroup, true)
				.addField("Description:", description, true)
				.addField("Usage: ", "`" + `${prefix} ${usage}` + "`")
				.setAuthor({
					name: botTag,
				})
				.setThumbnail(botImage)
				.setTimestamp()
				.setFooter({
					text: `- ${botName} loves you <3`,
				})
				.setColor(client.ClientFunction.generateColor());
			return message
				.reply({
					embeds: [helpEmbed],
				})
				.catch();
		}
	},
};
