import { CaseType, PieceItemType, convertName } from "../pages/Table";
import { OrderType } from "./OrdersChecking";
import { computePath, getAllNeighbours } from "./Pathfinder";
import piecesValues from "../data/piecesValues.json"

class AuthorizingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthorizingError';
    }
}

export default function authorizeOrder(order: OrderType, pieces: Array<PieceItemType>) {
    let isWaterType: boolean = ["D", "CR"].includes(order.piece)
    let isGroundType: boolean = ["S", "R", "T", "A"].includes(order.piece)

    //check l'existence de la pièce
    let currentPiece = pieces.find(objet => objet.color === order.color && objet.case === order.start)
    if (!currentPiece) throw new AuthorizingError(`Pas de ${convertName(order.piece)} ${convertName(order.color)} sur ${order.start}`)

    //finish autorisé
    if (isWaterType) {
        if (order.finish.match(/[VBJR]4/)) throw new AuthorizingError(`Un ${convertName(order.piece)} ne peut pas aller sur une tuile 4`)
    } else {
        if (order.finish.match(/^S/)) throw new AuthorizingError(`Un ${convertName(order.piece)} ne peut pas aller sur une tuile S`)
    }
    if (order.start === order.finish) throw new AuthorizingError(`On ne peut pas se déplacer de 0 cases !`)

    //😱 pathfinding
    let path:Array<CaseType> = []
    if (isWaterType) {
        if (
            !getAllNeighbours(order.start).includes(order.finish) //au dela des voisins
            || (order.start[0] === "S" && order.finish[0] === "S") //si on tente d'aller d'un secteur à l'autre
        ) throw new AuthorizingError(`Hors de la portée de la pièce (>1)`)
    } else {
        path = computePath(order.start, order.finish, isWaterType)
        console.log('path', path)

        //check de la portée
        let portée = piecesValues[order.piece].range
        if (path.length >= portée) throw new AuthorizingError(`Hors de la portée de la pièce (${path.length + 1}/${portée})`)

        //check traversée
        if (isGroundType && path.find(f => f.includes("I"))) throw new AuthorizingError(`Une seule traversée par manche`)
    }

    console.log("Ordre autorisé ✅")
    currentPiece!.case = order.finish
    return path
}