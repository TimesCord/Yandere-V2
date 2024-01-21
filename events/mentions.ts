import { ClientExtensionInterface } from "../types"
import { Message } from "discord.js"
module.exports = {
  name: "mentioned",
  eventName: "messageCreate",
  async execute(message:Message, client:ClientExtensionInterface){
    if(message.mentions.repliedUser != null) return
    if(message.mentions.members?.has(client.user?.id as string)){
      const prefix = await client.ClientFunction.getprefix(client, message.guild?.id) || client.PREFIX
      return message.reply(`Hi! My prefix is ` + "`" + prefix + "`.").catch()
    }
  }
};