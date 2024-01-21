import mongoose from "mongoose"
const guildSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required:true
  },
  boosterRoleID:{
    type: String
  },
  boostRoleLimit:{
    type: Number
  },
  logChannelID: {
    type: String
  }
})
export default mongoose.model("guild_data", guildSchema)