import { Message, VoiceChannel } from 'discord.js';
import {ClientExtensionInterface } from "../../types"
module.exports = {
  name: "setbitrate",
  description: "Sets the bitrate for a voice channel.",
  usage: "setbitrate {bit}",
  args: "multiple",
  commandGroup: "Utils",
  commandGroupName: "setbitrate",
  async execute(message:Message, args:string[] | string, client:ClientExtensionInterface) {
    if(args.length == 0) return message.reply("Please provide the new bitrate for your channel.").catch()
    if(message.member?.voice.channel === null) return message.reply("You need to be in a voice channel to use this command!").catch()
    const VoiceChannel = message.member?.voice.channel as VoiceChannel
    if(isNaN(parseInt(args[0])) || parseInt(args[0]) < 8 || parseInt(args[0]) > 384) return message.reply("The bitrate you provide must be a number and betweeen 8 and 384").catch()
    const setregion = await VoiceChannel.setBitrate(parseInt(args[0]) * 1000).catch(err => {
      return undefined
    })
    if(!setregion) return message.reply("There seems to be a problem setting the bitrate to your channel. It may be that the provided number is larger than allowed in this server.").catch()
    return message.reply("I Have set the bitrate to your voice channel to " + "`" + parseInt(args[0]) + "kbps`").catch()
  }
}