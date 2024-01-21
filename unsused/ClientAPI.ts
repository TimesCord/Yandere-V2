// import express from "express"
// import { Request, Response, Express } from "express"
// import EventEmitter from "events"
// import { ClientAPIInterface } from "../types"
// import bodyParser from "body-parser"
// import dotenv from "dotenv"
// import ngrok from "ngrok"
// dotenv.config()
// const PORT = process.env.PORT as string
// const NGROKTOKEN = process.env.NGROK_TOKEN as string

// export default class ClientAPI extends EventEmitter implements ClientAPIInterface{
//   public client:Express
//   constructor(){
//     super()
//     this.client = express()
//     this.client.use(express.json())
//     this.client.use(bodyParser.json())
//     this.client.post("/donation", (req:Request, res:Response) => {
//       this.emit("donation", req.body)
//       console.log(req.body)
//       return res.send("Success")
//     })
//     this.client.listen(PORT, async() =>{
//       const ngrokURL = await ngrok.connect({
//         addr: PORT,
//         authtoken: NGROKTOKEN,
//       })
//       console.log("Connected to NGROK at: ")
//       console.log(ngrokURL)
//     })
//   }
// }