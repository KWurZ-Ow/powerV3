import { CaseType, ColorType, PieceType } from "./App";
export type OrderType = {
    color: ColorType,
    piece: PieceType,
    start: CaseType,
    finish: CaseType
}
type Error = `Case inexistante "${string}"` | `Piece inexistante "${string}"` | "Chaipafaire"

const isPiece = (item:string):PieceType => item === ("S" || "T" || "C" || "D" || "R" || "A" || "B" || "CR") ? item : "A"
const isCase = (item:string) => item.match(/^(([VJBR]([0-8]||HQ))||(S([1-9]|1[0-2]))||(I[XNSEW]))$/)

export default function CheckOrder(color:string, piece:string, start:string, finish:string):Error | OrderType{
    if(start.charAt(0) === "E"){//type d'order = échange de pièces
        return "Chaipafaire"

    }else{//type d'order = déplacement de pièces
        if (!isPiece(piece)) return `Piece inexistante "${piece}"`
        if (!isCase(start)) return `Case inexistante "${start}"`
        if (!isCase(finish)) return `Case inexistante "${finish}"`

        return {color: color as ColorType, piece: piece as PieceType, start: start as CaseType, finish: finish as CaseType}
    }
}