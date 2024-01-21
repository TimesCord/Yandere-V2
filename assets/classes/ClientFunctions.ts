import generateColor from "../utilities/randomColor"
import getprefix from "../utilities/getlocalprefix"
import { ClientFunctionInterface } from "../../types"
export default class ClientFunction implements ClientFunctionInterface{
  public generateColor:Function
  public getprefix:Function
  constructor(){
    this.generateColor = generateColor
    this.getprefix = getprefix
    console.log("Client Functions loaded!")
  }
}