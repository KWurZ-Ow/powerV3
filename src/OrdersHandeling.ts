import { PieceItemType } from "./App";
import { OrderType } from "./OrdersChecking";

export default function handleOrder(order:OrderType, pieces:Array<PieceItemType>){
    let currentPiece = pieces.find(objet => objet.color === order.color && objet.case === order.start)
    currentPiece!.case = order.finish
}