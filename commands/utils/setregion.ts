import { Message, VoiceChannel } from 'discord.js';
import {ClientExtensionInterface } from "../../types"
module.exports = {
  name: "setregion",
  description: "Sets region for a voice channel.",
  usage: "setregion {region name}",
  args: "multiple",
  commandGroup: "Utils",
  commandGroupName: "setregion",
  async execute(message:Message, args:string[] | string, client:ClientExtensionInterface) {
    if(args.length == 0) return message.reply("Please provide a new region for your channel.").catch()
    if(message.member?.voice.channel === null) return message.reply("You need to be in a voice channel to use this command!").catch()
    const VoiceChannel = message.member?.voice.channel as VoiceChannel
    const setregion = await VoiceChannel.setRTCRegion(args[0]).catch(err => {return undefined})
    if(!setregion) return message.reply("There seems to be a problem setting the region to your channel. Please make sure the region you provided exists.").catch()
    return message.channel.send({
      content: "I Have set the RTC region to your voice channel to " + "`" + args[0] + "`"
    }).catch()
  }
}