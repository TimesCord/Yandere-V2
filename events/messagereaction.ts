import { Message } from "discord.js"
import { ClientExtensionInterface } from "../types"
module.exports = {
  name: "messagereaction",
  eventName: "messageCreate",
  async execute(message:Message, client:ClientExtensionInterface){
    if(message.member?.user.bot) return 
    const reactionList = await client.ClientDatabase.messageReaction.find({guildid: message.guild?.id})
    if(reactionList.length == 0) return
    for(const reactions of reactionList){
      const testExpression = reactions.trigger
      const regex = new RegExp(testExpression,"i")
      if(regex.test(message.content)) return message.channel.send(reactions.reaction).catch()
    }
  }
};