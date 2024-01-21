import mongoose from "mongoose"
const boostertoken = new mongoose.Schema({
  guildid: {
    type: String,
    required: true
  },
  memberid: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
})
export default mongoose.model("boostertoken", boostertoken)