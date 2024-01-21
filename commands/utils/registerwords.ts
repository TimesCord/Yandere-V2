 import { Message } from "discord.js";
 import { ClientExtensionInterface } from "../../types";
 import fs from "fs";
 import path from "path";
 const staticPath = path.join(__dirname, "../../assets/JSON/words.json");
 module.exports = {
 	name: "regword",
 	description: "Registers a word to the local database.",
 	usage: "regword {sentence}",
 	args: "single",
 	commandGroup: "Dev",
 	commandGroupName: "regword",
 	async execute(
 		message: Message,
 		args: string[] | string,
 		client: ClientExtensionInterface
 	) {
 		if (!message.member?.permissions.has("MANAGE_MESSAGES"))
 			return message
 				.reply("You do not have the permission to use this command!")
 				.catch();
 		if (args.length == 0 || args === undefined)
 			return message.reply("No arguments provided").catch();
 		var sentence = args as string;
 		var words = JSON.parse(fs.readFileSync(staticPath, "utf8"));
 		words.push(sentence);
 		fs.writeFile(staticPath, JSON.stringify(words), async () => {
 			return message.reply("Sentence added: " + "`" + sentence + "`").catch();
 		});
 	},
 };
