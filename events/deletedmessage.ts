import { Message } from 'discord.js';
import { ClientExtensionInterface, messageDeleteHeader } from '../types';
import fs from "fs"
module.exports = {
  name: "snipehandler",
  eventName: "messageDelete",
  async execute(message:Message, client:ClientExtensionInterface) {
    if(!message.member) return
    const wordList = fs.readFileSync(__dirname + "/../assets/JSON/words.json")
    const wordListJSON:string[] = JSON.parse(wordList.toString())
    for(const words of wordListJSON){
      const regexExpression = new RegExp(words, "i")
      if(regexExpression.test(message.content)){
        return
      }
    }
    const memberInfo = message.member
    //Check if member joined server within the last 1 week
    const memberJoined = memberInfo?.joinedAt as Date
    const memberJoinedDate = new Date(memberJoined)
    const currentDate = new Date()
    const timeDifference = currentDate.getTime() - memberJoinedDate.getTime()
    const timeDifferenceInDays = timeDifference / (1000 * 3600 * 24)
    if(timeDifferenceInDays < 4){
      if(message.attachments.size > 0 || message.content.endsWith(".jpg" || ".png" || ".jpeg" || ".heic")){
        return
      }
    }
    const snipeCollection = client.ClientCollection.deleteSnipes
    const channelid = message.channel.id
    if(!snipeCollection.has(channelid)) snipeCollection.set(channelid, [])
    const channelData = snipeCollection.get(channelid) as messageDeleteHeader[]
    const deletedMessageData:messageDeleteHeader = {
      messageid: message.id,
      data: {
        content: message.content,
        author: message.author.tag,
        member: message.member,
        image: message.attachments.first()?.proxyURL
      }
    }
    channelData?.unshift(deletedMessageData)
    setTimeout(async () => {
      for(var i = 0; i < channelData.length; i++){
        if(channelData[i].messageid == message.id){
          channelData.splice(i, 1)
        }
      }
    }, 30000)
  }
}