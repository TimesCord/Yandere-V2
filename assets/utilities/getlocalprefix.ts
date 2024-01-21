import { ClientExtensionInterface } from "../../types"
export default async(client:ClientExtensionInterface, guildid:string) => {
  var error:undefined;
  const prefix = await client.ClientDatabase.getAsync(`prefix:${guildid}`).catch((err:Error|null)=> {
    return error
  })
  return prefix
}