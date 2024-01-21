// import { Message } from "discord.js";
// import { ClientExtensionInterface } from "../../types";
// import fs from "fs";
// import path from "path";
// const staticPath = path.join(__dirname, "../../assets/JSON/colors.json");
// module.exports = {
// 	name: "regcolor",
// 	description: "Registers a color to the local database.",
// 	usage: "regcolor {color tag}",
// 	args: "multiple",
// 	commandGroup: "Dev",
// 	commandGroupName: "regcolor",
// 	async execute(
// 		message: Message,
// 		args: string[] | string,
// 		client: ClientExtensionInterface
// 	) {
// 		if (!message.member?.permissions.has("MANAGE_GUILD"))
// 			return message
// 				.reply("You do not have the permission to use this command!")
// 				.catch();
// 		if (args.length == 0) return message.reply("No arguments provided").catch();
// 		var colorTag = args[0] as string;
// 		if (!colorTag.startsWith("#")) {
// 			colorTag = "#" + colorTag;
// 		}
// 		var colors = JSON.parse(fs.readFileSync(staticPath, "utf8"));
// 		colors.push(colorTag);
// 		fs.writeFile(staticPath, JSON.stringify(colors), () => {
// 			return message.reply("Color added").catch();
// 		});
// 	},
// };
