import {
	Message,
	MessageEmbed,
	TextChannel,
	Collection,
	Role,
} from "discord.js";
import { ClientExtensionInterface } from "../../types";
import axios from "axios";
import resizeImage from "resize-img";
import { convertHexToRgb } from "@mdhnpm/rgb-hex-converter";
module.exports = {
	name: "claimrole",
	description: "Claims a role",
	usage: "claimrole " + "`{token}`",
	args: "multiple",
	commandGroup: "Booster",
	commandGroupName: "claimrole",
	async execute(
		message: Message,
		args: string[] | string,
		client: ClientExtensionInterface
	) {
		var boostroleid = await client.ClientDatabase.getAsync(
			`boostrole:${message.guild?.id}`
		);
		if (!boostroleid) {
			const guildquery = await client.ClientDatabase.guildData.find({
				guildID: message.guild?.id,
			});
			if (guildquery.length == 0 || !guildquery[0].boosterRoleID)
				return message
					.reply(
						"It seems like this server is not configured to handle custom boost roles yet. Please contact an admin and try again later!"
					)
					.catch();
			boostroleid = guildquery[0].boosterRoleID;
			await client.ClientDatabase.setAsync(
				`boostrole:${message.guild?.id}`,
				boostroleid
			);
		}
		if (!message.guild?.roles.cache.has(boostroleid))
			return message
				.reply(
					"It seems like the boost role in this server has been deleted. Please contact an admin."
				)
				.catch();
		// if(!message.member?.roles.cache.has(boostroleid)) return message.reply("Hi! It seems like you are not a booster of this server. You're not allowed to use this command!")
		if (args.length == 0)
			return message
				.reply("Please provide a token to use this command!")
				.catch();

		const memberid: string = message.member?.id as string;
		const guildid: string = message.guild?.id as string;
		const token: string = args[0] as string;

		const query = await client.ClientDatabase.boostertoken.find({
			guildid: guildid,
			memberid: memberid,
		});
		if (
			query.length == 0 ||
			query[0].memberid != memberid ||
			query[0].token != token
		) {
			return message
				.reply(
					"I'm sorry, it seems like your token is invalid or you are not a registered booster! Please contact an admin if you need help."
				)
				.catch();
		}
		const rolequery = await client.ClientDatabase.boosterroles.find({
			guildID: guildid,
			memberID: memberid,
		});
		if (rolequery.length != 0)
			return message
				.reply(
					"It seems like you already have a role created in this server. The maximum amount of owned roles per booster is only 1!"
				)
				.catch();

		var rolename: string;
		var rolecolor: any;
		var roleicon: Buffer;
		var newRoleData: Role;
		const channel: TextChannel = message.channel as TextChannel;
		const roleNameEmbed = new MessageEmbed()
			.setAuthor({
				name: `-${client.user?.username}`,
				iconURL: client.user?.displayAvatarURL(),
			})
			.setTitle(
				"Please type a role name! This will be the name of the role you are creating."
			)
			.setDescription(
				"You won't be able to change this in the future so make sure you choose correctly!"
			)
			.setTimestamp()
			.setFooter({
				text: "Type `cancel` to abort role creation!",
			})
			.setColor(await client.ClientFunction.generateColor());
		const roleColorEmbed = new MessageEmbed()
			.setAuthor({
				name: `-${client.user?.username}`,
				iconURL: client.user?.displayAvatarURL(),
			})
			.setTitle(
				"Please provide a role color! This will be the color of the role you are creating."
			)
			.setDescription(
				"You won't be able to change this in the future so make sure you choose correctly! Type a hex value (ex: #F0KSFH). If you don't know what color to choose, simply visit the link provided before and paste the given hex code in to this channel."
			)
			.addField("Search HEX code here:", "https://htmlcolorcodes.com/")
			.setTimestamp()
			.setFooter({
				text: "Type `cancel` to abort role creation!",
			})
			.setColor(await client.ClientFunction.generateColor());
		const roleIconEmbed = new MessageEmbed()
			.setAuthor({
				name: `-${client.user?.username}`,
				iconURL: client.user?.displayAvatarURL(),
			})
			.setTitle(
				"Please provide a role icon! This will be the icon of the role you are creating."
			)
			.setDescription(
				"You won't be able to change this in the future so make sure you choose correctly!"
			)
			.addField(
				"Disclaimer!",
				"Please only send an image for the icon. If the format of the image is other than png or jpeg, it will not work!"
			)
			.setTimestamp()
			.setFooter({
				text: "Type `cancel` to abort role creation!",
			})
			.setColor(await client.ClientFunction.generateColor());
		const confirmationEmbed = new MessageEmbed()
			.setAuthor({
				name: `-${client.user?.username}`,
				iconURL: client.user?.displayAvatarURL(),
			})
			.setTitle("Please preview the role you just created!")
			.setDescription(
				"I have created the role and given it to you. You can check the role in your profile. Once you are satisfied, type `confirm` to finish role creation! Otherwise, if you would like to change it, type `cancel` and try again!"
			)
			.setTimestamp()
			.setFooter({
				text: "Type `cancel` to abort role creation!",
			})
			.setColor(await client.ClientFunction.generateColor());

		const roleNameFunction = async (): Promise<any> => {
			const rolenamemessage = await message
				.reply({
					embeds: [roleNameEmbed],
				})
				.catch();
			const roleNameInput: Collection<string, Message> = (await channel
				.awaitMessages({
					max: 1,
					filter: (n) => n.author.id == message.member?.id,
					time: 30000,
				})
				.catch((err: any) => {
					return message.reply("You have timed out! Please try again.").catch();
				})) as Collection<string, Message>;
			if (rolenamemessage.deletable) await rolenamemessage.delete().catch();
			if (roleNameInput.size == 0 || !roleNameInput.first()?.content)
				return message.reply("You have timed out! Please try again.").catch();
			if (roleNameInput.first()?.content.toUpperCase() == "CANCEL")
				return message.reply("I Have cancelled the role creation!").catch();
			rolename = roleNameInput.first()?.content as string;
			return roleColorFunction();
		};
		const roleColorFunction = async (): Promise<any> => {
			const rolecolormessage = await message
				.reply({
					embeds: [roleColorEmbed],
				})
				.catch();
			const roleColorInput: Collection<string, Message> = (await channel
				.awaitMessages({
					max: 1,
					filter: (n) => n.author.id == message.member?.id,
					time: 30000,
				})
				.catch((err: any) => {
					return message.reply("You have timed out! Please try again.").catch();
				})) as Collection<string, Message>;
			if (rolecolormessage.deletable) await rolecolormessage.delete().catch();
			if (roleColorInput.size == 0 || !roleColorInput.first()?.content)
				return message.reply("You have timed out! Please try again.").catch();
			if (roleColorInput.first()?.content.toUpperCase() == "CANCEL")
				return message.reply("I Have cancelled the role creation!").catch();
			const colorString: string = roleColorInput.first()?.content as string;
			const regexString = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
			const colorValid = regexString.test(colorString);
			if (!colorValid) {
				message.reply("Please provide a valid color code!").catch();
				return roleColorFunction();
			}
			const rgbArray = convertHexToRgb(colorString);

			rolecolor = rgbArray;
			return roleIconFunction();
		};

		const roleIconFunction = async (): Promise<any> => {
			var tempRoleURL: string;
			const roleiconmessage = await message
				.reply({
					embeds: [roleIconEmbed],
				})
				.catch();
			const roleIconInput: Collection<string, Message> = (await channel
				.awaitMessages({
					max: 1,
					filter: (n) => n.author.id == message.member?.id,
					time: 30000,
				})
				.catch((err: any) => {
					return message.reply("You have timed out! Please try again.").catch();
				})) as Collection<string, Message>;
			if (roleiconmessage.deletable) await roleiconmessage.delete().catch();
			if (roleIconInput.size == 0)
				return message.reply("You have timed out! Please try again.").catch();
			if (roleIconInput.first()?.content.toUpperCase() == "CANCEL")
				return message.reply("I Have cancelled the role creation!").catch();
			if (roleIconInput.first()?.attachments.first()) {
				tempRoleURL = roleIconInput.first()?.attachments.first()?.url as string;
			} else if (roleIconInput.first()?.content) {
				//Something wrong with this part
				if (
					!roleIconInput.first()?.content.endsWith(".png") ||
					!roleIconInput.first()?.content.endsWith(".jpg") ||
					!roleIconInput.first()?.content.endsWith(".jpeg")
				) {
					await message
						.reply("Please provide a valid image url! Please try again")
						.catch();
					return roleIconFunction();
				}
				tempRoleURL = roleIconInput.first()?.content as string;
			} else {
				await message.reply("Please provide a valid image! Try again!").catch();
				return roleIconFunction();
			}
			const imageBuffer = await axios
				.request({
					url: tempRoleURL,
					method: "GET",
					responseType: "arraybuffer",
				})
				.catch();
			if (!imageBuffer)
				return message
					.reply(
						"There seems to be a problem creating your role. Please contact an admin or try again later!"
					)
					.catch();
			const newImageBuffer = await resizeImage(imageBuffer.data, {
				width: 64,
			}).catch(async () => {
				await message.reply("Invalid format! Please try again!").catch();
				return roleIconFunction();
			});
			roleicon = newImageBuffer;
			return roleCreation();
		};
		const roleCreation = async (): Promise<any> => {
			const rolePosition: number = message.guild?.roles.cache.get(boostroleid)
				?.position as number;
			const role: Role = (await message.guild?.roles
				.create({
					name: rolename,
					color: rolecolor,
					hoist: false,
					mentionable: false,
					position: rolePosition + 1,
					icon: roleicon,
					reason: `Role Creation by ${message.author.tag}`,
				})
				.catch(() => {
					return message
						.reply(
							"There was an error creating your role! Please make sure the server allows icons for roles!"
						)
						.catch();
				})) as Role;
			if (role) {
				newRoleData = role;
				await message.member?.roles.add(role).catch(async () => {
					await message
						.reply(
							"It seems like i'm not able to give you the role. Please contact an admin to create your custom role."
						)
						.catch();
					return role.delete().catch();
				});
				return roleConfirmation();
			} else {
				return message
					.reply(
						"I'm sorry, but I was unable to create the role! Please try again!"
					)
					.catch();
			}
		};
		const roleConfirmation = async (): Promise<any> => {
			const roleconfirmationmessage = await message.reply({
				embeds: [confirmationEmbed],
			});
			const roleConfirmationInput: Collection<string, Message> = (await channel
				.awaitMessages({
					max: 1,
					filter: (n) => n.author.id == message.member?.id,
					time: 30000,
				})
				.catch(async (err: any) => {
					await newRoleData.delete().catch();
					return message.reply("You have timed out! Please try again.").catch();
				})) as Collection<string, Message>;
			await roleconfirmationmessage.delete().catch();
			if (
				roleConfirmationInput.size == 0 ||
				!roleConfirmationInput.first()?.content
			) {
				await newRoleData.delete().catch();
				return message.reply("You have timed out! Please try again.").catch();
			}
			if (roleConfirmationInput.first()?.content.toUpperCase() == "CANCEL") {
				return roleCancel();
			} else if (
				roleConfirmationInput.first()?.content.toUpperCase() == "CONFIRM"
			) {
				return roleConfirm();
			} else {
				await message
					.reply(
						"Invalid message! Please only type either 'confirm' or 'cancel'!"
					)
					.catch();
				return roleConfirmation();
			}
		};
		const roleConfirm = async (): Promise<any> => {
			await client.ClientDatabase.boosterroles
				.findOneAndUpdate(
					{
						guildID: message.guild?.id,
						memberID: message.member?.id,
					},
					{
						guildID: message.guild?.id,
						memberID: message.member?.id,
						roleID: newRoleData.id,
						roleName: newRoleData.name,
					},
					{
						upsert: true,
					}
				)
				.catch(async (err: any) => {
					await message
						.reply(
							"I'm sorry, but it seems like i am experiencing an error! Please try again."
						)
						.catch();
					return newRoleData.delete().catch();
				});
			await client.ClientDatabase.boostertoken
				.findOneAndDelete({
					guildid: message.guild?.id,
					memberid: message.member?.id,
				})
				.catch();
			return message
				.reply(`I have created the role ${newRoleData.name} for you!`)
				.catch();
		};
		const roleCancel = async (): Promise<any> => {
			await newRoleData.delete().catch();
			return message.reply("I have cancelled the role creation!").catch();
		};
		await roleNameFunction();
	},
};
