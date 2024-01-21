import mongoose from "mongoose"
const messagereaction = new mongoose.Schema({
  reactionid: {
    type: String,
    required: true
  },
  guildid: {
    type: String,
    required: true
  },
  trigger: {
    type: String,
    required: true
  },
  reaction : {
    type: String,
    required: true
  }
})
export default mongoose.model("messageReaction", messagereaction)