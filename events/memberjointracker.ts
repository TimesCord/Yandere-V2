import { ClientExtensionInterface } from "../types";
import { GuildMember, TextChannel } from "discord.js";
module.exports = {
	name: "memberJoin",
	eventName: "guildMemberAdd",
	async execute(member: GuildMember, client: ClientExtensionInterface) {
		var logchannel = await client.ClientDatabase.getAsync(
			`logchannel:${member.guild.id}`
		);
		if (!logchannel) {
			const query = await client.ClientDatabase.guildData.find({
				guildID: member.guild.id,
			});
			if (query.length == 0 || !query[0].logChannelID) return;
			logchannel = query[0].logChannelID;
			await client.ClientDatabase.setAsync(
				`logchannel:${member.guild.id}`,
				query[0].logChannelID
			);
		}
		const memberusername: string = member.user.username;
		const memberregister: string = member.user.createdAt?.toLocaleString(
			"id-ID",
			{ timeZone: "Asia/Jakarta" }
		) as string;
		// const embed = new MessageEmbed()
		//   .addField("Username: ", memberusername, true)
		//   .addField("User Tag:", membertag, true)
		//   .addField("Registered At: ", memberregister, true)
		//   .addField("Member Joined: ", memberjoin, true)
		//   .addField("ID: ", member.id, true)
		//   .setTimestamp()
		//   .setColor(await client.ClientFunction.generateColor())
		// return (member.guild.channels.cache.get(logchannel) as TextChannel).send({
		//   embeds: [embed]
		// }).catch((err) => console.log(err))
		return (member.guild.channels.cache.get(logchannel) as TextChannel)
			?.send(
				`Registered : ` +
					"`" +
					`${memberregister} ` +
					"`" +
					` | ID: ` +
					"`" +
					`${member.id}` +
					"`" +
					`| ${memberusername} | `
			)
			.catch();
	},
};
