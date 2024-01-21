import { Message } from "discord.js";
import { ClientExtensionInterface } from "../types";
module.exports = {
	name: "imagesent",
	eventName: "messageCreate",
	async execute(message: Message, client: ClientExtensionInterface) {
		if (
			message.attachments.size < 1 &&
			!message.content.endsWith(".jpg" || ".png" || ".jpeg" || ".heic")
		)
			return;
		if (!message.member) return;
		const memberInfo = message.member;
		//Check if member joined server within the last 1 week
		const memberJoined = memberInfo?.joinedAt as Date;
		const memberJoinedDate = new Date(memberJoined);
		const currentDate = new Date();
		const timeDifference = currentDate.getTime() - memberJoinedDate.getTime();
		const timeDifferenceInDays = timeDifference / (1000 * 3600 * 24);
		if (timeDifferenceInDays > 4) return;
		if (message.deletable) await message.delete().catch();
		return;
	},
};
//&& !message.content.endsWith(".png") && !message.content.endsWith(".heic") && !message.content.endsWith(".jpeg")
