import { CaseType, ColorType, PieceType } from "./App";
export type OrderType = {
    color: ColorType,
    piece: PieceType,
    start: CaseType,
    finish: CaseType
}
class CheckingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CheckingError';
    }
}

const isPiece = (item: string): boolean => ["S", "T", "C", "D", "R", "A", "B", "CR"].includes(item)
const isCase = (item: string) => item.match(/^(([VJBR]([0-8]||HQ))||(S([1-9]|1[0-2]))||(I[XNSEW]))$/)

export default function CheckOrder(color: string, piece: string, start: string, finish: string): OrderType {
    if (!piece || !start || !finish) throw new CheckingError(`Un des champs n'est pas renseigné`)
    if (start.charAt(0) === "E") {
        //type d'ordre = échange de pièces

        throw new CheckingError("Chaipafaire")

    } else {
        //type d'ordre = déplacement de pièces

        if (!isPiece(piece)) throw new CheckingError(`Piece inexistante "${piece}"`)
        if (!isCase(start)) throw new CheckingError(`Case inexistante "${start}"`)
        if (!isCase(finish)) throw new CheckingError(`Case inexistante "${finish}"`)

        console.log("Ordre correct ✅")
        return { color: color as ColorType, piece: piece as PieceType, start: start as CaseType, finish: finish as CaseType }
    }
}