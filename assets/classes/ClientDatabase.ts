import mongoose, { Model } from "mongoose"
import redis from "redis"
import { ClientDatabaseInterface } from "../../types";
import guildschema from "../schema/guildschema"
import messagereaction from "../schema/messagereaction"
import boostertoken from "../schema/boostertoken"
import boosterrole from "../schema/boostroles"
import { promisify } from "util"
export default class DatabasesClass implements ClientDatabaseInterface {
  public guildData:Model<any> = guildschema
  public messageReaction:Model<any> = messagereaction
  public boostertoken:Model<any> = boostertoken
  public boosterroles:Model<any> = boosterrole
  public RedisClient
  public getAsync
  public setAsync
  constructor(URI:string, REDIS_URI:string){
    mongoose.connect(URI)
    mongoose.connection.on("connecting", () => {
      console.log("Connecting to MongoDB Database")
    })
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB Database")
    })
    mongoose.connection.on("error", (err) => {
      console.error(err)
      throw err
    })
    this.RedisClient = redis.createClient({
      url: REDIS_URI,
      no_ready_check: true,
      disable_resubscribing: false
    })
    this.RedisClient.on("connect", () => {
      console.log("Established stream to Redis Database server")
    })
    this.RedisClient.on("error", (err:any) => {
      console.error(err)
      throw err
    })
    this.RedisClient.on("end", () => {
      console.log("Connection to Redis Database Server has ended")
      this.RedisClient = redis.createClient({
        url: REDIS_URI,
        no_ready_check: true,
        disable_resubscribing: false
      })
    })
    this.RedisClient.on("reconnecting", () => {
      console.log("Reconnecting to Redis Database Server")
    })
    this.getAsync = promisify(this.RedisClient.get).bind(this.RedisClient)
    this.setAsync = promisify(this.RedisClient.set).bind(this.RedisClient)
  }
}