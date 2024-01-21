// import { MessageEmbed, Message, MessageActionRow, MessageButton } from "discord.js"
// import { ClientExtensionInterface } from "../types"
// module.exports = {
//   name: "listmessage",
//   description: "Lists the custom reaction message in this server",
//   usage: "listmessage",
//   args: "single",
//   commandGroup: "Setups",
//   commandGroupName: "listmessage",
//   async execute(message:Message, args:string, client:ClientExtensionInterface){
//     var page = 0
//     const wholeList = await client.ClientDatabase.messageReaction.find({guildid: message.guild?.id})
//     const list = wholeList.splice(page, 5)
//     const listEmbed = new MessageEmbed()
//     for(const reactions of list){
//       listEmbed.addField(reactions.trigger, reactions.reaction)
//     }
//     const actionRow = new MessageActionRow()
//       .addComponents(
//         new MessageButton()
//           .setCustomId('forward')
//           .setLabel("forward")
//           .setStyle("PRIMARY")
//       )
//     const newMessage = await message.channel.send({
//       embeds: [listEmbed],
//       components: [actionRow]
//     }) 
//     const reaction = await newMessage.awaitMessageComponent({
//       filter : (n) => message.member?.user.id == n.member.user.id,
//       time: 30000,
//       componentType: "ACTION_ROW"
//     }).catch(err => {
//       return message.reply("Timed out!")
//     })
//     if(reaction.id == "back"){
//       page = page - 5
//     }
//     if(reaction.id == "forward"){
//       page = page + 5
//     }
//     const editMessage = async():Promise<void> => {
//       const newActionRow = new MessageActionRow()
//         .addComponents(
//           new MessageButton()
//             .setCustomId('back')
//             .setLabel("back")
//             .setStyle("PRIMARY")
//         )
//         .addComponents(
//           new MessageButton()
//             .setCustomId('forward')
//             .setLabel("forward")
//             .setStyle("PRIMARY")
//         )
      



//       const newEmbed = new MessageEmbed()
//       const pageList = wholeList.splice(page, 5)
//       for(const reactions of pageList){
//         newEmbed.addField(reactions.trigger, reactions.reaction)
//       }
//       await newMessage.edit({
//         embeds: [newEmbed],
//         components: [newActionRow]
//       })
//       const newReaction = await newMessage.awaitMessageComponent({
//         filter : (n) => message.member?.user.id == n.member.user.id,
//         time: 30000,
//         componentType: "ACTION_ROW"
//       }).catch(err => {
//         return message.reply("You have timed out!")
//       })
//       if(newReaction.id == "back"){
//         page = page - 5
//         return editMessage()
//       }
//       if(newReaction.id == "forward"){
//         page = page + 5
//         return editMessage()
//       }
//       editMessage()
//     }
//   }
// }