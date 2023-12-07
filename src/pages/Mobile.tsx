import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client'
import "../app.css";
import { useParams } from 'react-router-dom';
import { childProps } from "../App";

export default function Mobile({ ioUrl }: childProps) {
    const { id: tableId } = useParams()
    const [socket, setSocket] = useState<Socket | null>();
    const [table, setTable] = useState<any>()
    const [color, setColor] = useState("")

    useEffect(() => {
        const s = io(ioUrl)
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, [ioUrl])

    useEffect(() => {
        if (!tableId) return

        socket?.on("tableUpdated", updatedTable => {
            console.log('updatedTable', updatedTable)
            setTable(updatedTable)
        })

        socket?.emit("joinTable", tableId, false, (response: any) => {
            setTable(response)
        })
    }, [socket, tableId])

    useEffect(() => {
        if (color === "" || !tableId) return

        socket?.emit("register", tableId, color)
    }, [color, socket, tableId])

    if (!table) return <h1>Scanne le QR code</h1>

    return <div className='mobile'>
        <h1>Power V3</h1>
        <h2>Bienvenue sur la table "{table.name}"</h2>
        {color === "" ? <>
            <p>Quel joueur est-tu ?</p>
            <div className="playersContainer">
                {table.players.map((player: any) => <div
                    className={`playerItem ${player.color}MainBackground ${player.socketId !== "" && "picked"}`}
                    key={player.color}
                    onClick={() => setColor(player.color)}
                >
                    <span>{player.name}</span>
                </div>
                )}
            </div>
        </> :
            <p>Ok, salut {color} !</p>}
    </div>
}