import mongoose from "mongoose"
const guildRoles = new mongoose.Schema({
  guildID: {
    type: String,
    required:true
  },
  memberID: {
    type: String,
    required:true
  },
  roleID: {
    type: String,
    required:true
  },
  roleName: {
    type: String,
    required:true
  },

})
export default mongoose.model("guild_roles", guildRoles)