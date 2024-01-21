import Collection from "@discordjs/collection";
import { GuildMember } from "discord.js";
import { ClientCollectionsInterface, messageDeleteHeader, messageEditHeader } from "../../types";
export default class ClientCollection implements ClientCollectionsInterface {
  public deleteSnipes:Collection<string, messageDeleteHeader[]>
  public editSnipes:Collection<string, messageEditHeader[]>
  public activeCommand:Collection<string, GuildMember>
  constructor(){
    this.deleteSnipes = new Collection()
    this.editSnipes = new Collection()
    this.activeCommand = new Collection()
  }
} 