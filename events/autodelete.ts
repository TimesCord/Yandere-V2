import { Message } from "discord.js";
import { ClientExtensionInterface } from "../types";
import fs from "fs";
module.exports = {
	name: "autodelete",
	eventName: "messageCreate",
	async execute(message: Message, client: ClientExtensionInterface) {
		const wordList = fs.readFileSync(__dirname + "/../assets/JSON/words.json");
		const wordListJSON: string[] = JSON.parse(wordList.toString());
		for (const words of wordListJSON) {
			const regexExpression = new RegExp(words, "i");
			if (regexExpression.test(message.content)) {
				if (message.deletable) await message.delete().catch();
				return;
			}
		}
	},
};
