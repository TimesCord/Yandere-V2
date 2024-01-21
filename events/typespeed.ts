// import { ClientExtensionInterface } from "../types"
// import { Typing, Message } from "discord.js"
// module.exports = {
//   name: "typingStart",
//   eventName: "typingStart",
//   async execute(typing:Typing, client:ClientExtensionInterface){
//     console.log(`${typing.user.tag} is typing...`)
//     const memberid = typing.member?.id
//     const channel = typing.channel
//     const typestart = typing.startedTimestamp
//     const message = await channel.awaitMessages({
//       filter: (message:Message):boolean => {
//         return message.author.id === memberid
//       },
//       max: 1,
//       time: 60000,
//       errors: ["time"]
//     }).catch((err:Error) => {
//       console.error(err)
//       return undefined
//     })
//     if(message === undefined || message.first() === undefined) return

//     //Count the WPM
//     const messagecontent = message.first()?.content as string
//     const messagecontentarray = messagecontent.split(" ") as string[]
//     const messagecontentarraylength = messagecontentarray.length as number
//     const time = message.first()?.createdTimestamp as number- typestart
//     const wpm = messagecontentarraylength / (time / 60000)

//     return channel.send(`${message.first()?.author.tag} has been typing for ${time/1000} seconds. With the speed of ${wpm} words per minute.`)
//   }
// };
