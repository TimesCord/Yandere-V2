import { Message, Collection } from "discord.js"
import { ClientExtensionInterface, messageEditHeader } from "../types"
import fs from "fs"
module.exports = {
  name: "edithandler",
  eventName: "messageUpdate",
  async execute(oldMessage:Message, newMessage:Message,  client:ClientExtensionInterface){
    const wordList = fs.readFileSync(__dirname + "/../assets/JSON/words.json")
    const wordListJSON:string[] = JSON.parse(wordList.toString())
    for(const words of wordListJSON){
      const regexExpression = new RegExp(words, "i")
      if(regexExpression.test(oldMessage.content)){
        return
      }
    }
    const channelid = oldMessage.channel.id
    const author = oldMessage.author.tag
    const member = oldMessage.member
    const oldMessageContent = oldMessage.content
    const newMessageContent = newMessage.content
    const editedMessageObject:messageEditHeader = {
      messageid: oldMessage.id,
      data: {
        messageAuthor: author,
        oldMessageContent: oldMessageContent,
        newMessageContent: newMessageContent,
        oldMessage,
        newMessage,
        member
      }
    }
    const editSnipe = client.ClientCollection.editSnipes as Collection<string, messageEditHeader[]>
    if(!editSnipe.has(channelid)) client.ClientCollection.editSnipes.set(channelid, [])
    const channelEditData = editSnipe.get(channelid) as messageEditHeader[]
    channelEditData.unshift(editedMessageObject)
    setTimeout(async () => {
      for(var i = 0; i < channelEditData.length; i++ ){
        if(channelEditData[i].messageid == oldMessage.id){
          channelEditData.splice(i, 1)
        }
      }
    }, 30000)
  }
}