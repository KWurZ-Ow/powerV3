import { PieceItemType, convertName } from "./App";
import { OrderType } from "./OrdersChecking";
import { computePath } from "./Pathfinder";

class HandelingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'HandelingError';
    }
}

export default function executeOrder(order:OrderType, pieces:Array<PieceItemType>){
    //check l'existence de la pièce
    let currentPiece = pieces.find(objet => objet.color === order.color && objet.case === order.start)
    if (!currentPiece) throw new HandelingError(`Pas de ${convertName(order.piece)} ${convertName(order.color)} sur ${order.start}`)

    //😱 pathfinding
    console.log(computePath(order.start, order.finish, ["D", "CR"].includes(order.piece)))

    //todo: checker les cases d'arrivée
    //todo: pour les cross : iles interdites

    console.log("Ordre executé ✅")
    currentPiece!.case = order.finish
}