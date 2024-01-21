// import { Message } from "discord.js";
// import { ClientExtensionInterface } from "../../types";
// module.exports = {
// 	name: "getinvite",
// 	description: "Gets the OAUTH2 invite link for this bot",
// 	usage: "getinvite",
// 	args: "multiple",
// 	commandGroup: "Dev",
// 	commandGroupName: "getinvite",
// 	async execute(
// 		message: Message,
// 		args: string[] | string,
// 		client: ClientExtensionInterface
// 	) {
// 		if (!message.member?.permissions.has("MANAGE_GUILD"))
// 			return message
// 				.reply("You do not have the permission to use this command!")
// 				.catch();
// 		return message.reply(client.INVITE_LINK).catch();
// 	},
// };
