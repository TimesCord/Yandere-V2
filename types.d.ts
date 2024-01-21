import { Message, Client, Collection, GuildMember } from 'discord.js';
import { Model, Mongoose, Schema } from "mongoose"
import { RedisClient } from 'redis';
import { EventEmitter } from 'events';
export interface Command {
  name: string
  description: string
  usage: string
  args: "single" | "multiple"
  commandGroup: string
  commandGroupName: string
  execute(message: Message, args: string[]|string, client: Client):Promise<any>
}
export interface Events {
  name: string
  eventName: string
  description: string
  execute:Function
}
export interface messageDeleteContent {
  content:string
  author:string
  member:GuildMember | null
  image?:string
}
export interface messageDeleteHeader {
  messageid:string
  data:messageDeleteContent
}

export interface messageEditContent{
  messageAuthor:string,
  oldMessageContent:string,
  newMessageContent:string,
  oldMessage:Message,
  newMessage:Message,
  member:GuildMember | null
}

export interface messageEditHeader{
  messageid: string
  data: messageEditContent
}

export interface ClientFunctionInterface {
  generateColor:Function
  getprefix:Function
}
export interface ClientCollectionsInterface {
  deleteSnipes:Collection<string, messageDeleteHeader[]>
  editSnipes:Collection<string, messageEditHeader[]>
  activeCommand:Collection<string, GuildMember>
}
export interface ClientDatabaseInterface {
  guildData:Model
  messageReaction:Model
  boostertoken:Model
  boosterroles:Model
  RedisClient:RedisClient
  getAsync:Function
  setAsync:function
}
// export interface ClientAPIInterface extends EventEmitter {
//   client:Express
// }
export interface ClientExtensionInterface extends Client{
  MessageCommands:Collection<string, Command>
  MessageCommandGroups:Collection<string, Collection<string, Command>>
  EventCollection:Collection<string, Events>
  PREFIX:string
  ClientFunction:ClientFunctionInterface
  ClientCollection:ClientCollectionsInterface
  ClientDatabase:ClientDatabaseInterface
  // ClientAPI:any
  INVITE_LINK:string
}