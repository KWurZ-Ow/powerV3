import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { childProps } from "../App";
import { ColorType } from "./Table";
import QRCode from "qrcode.react";
import playerIcon from "../media/playerIcon.svg"

type PlayerType = {
    _id: string,
    socketId: string
    color: ColorType,
    name: string,
    order: Array<any>,
}

export default function Home({ ioUrl }: childProps) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [listTables, setListTables] = useState([])
    const [createGame, setCreateGame] = useState(false)
    const [joinGame, setJoinGame] = useState("")
    const [players, setPlayers] = useState<Array<PlayerType>>([])
    const [joinLoaded, setJoinLoaded] = useState(false)

    useEffect(() => {
        const s = io(ioUrl)
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, [ioUrl])

    useEffect(() => {
        if (!socket) return

        socket.emit("seekTables", (response: any) => {
            setListTables(response)
        })
        socket.on("tableUpdated", (response, wipe) => {
            console.log(response.players)
            setPlayers(response.players)
        })
    }, [socket])

    return <div className="home">
        <div className="title">
            <h1>⚡ Power Version 3 !!!</h1>
            <h3>Bienvenue, rejoignez ou créez une table</h3>
        </div>
        <div className="gamesContainer">
            <div className="gameItem" onClick={() => {
                setCreateGame(true)
                setJoinGame("")
                socket?.emit("createTable", "Test")
            }}>
                <p>Créer une nouvelle table</p>
                <p>{"->"}</p>
            </div>

            {listTables.map((table: any) => <div
                key={table._id}
                className="gameItem"
                onClick={() => {
                    setJoinLoaded(false)
                    setJoinGame(table.name)
                    setCreateGame(false)
                    setPlayers([])
                    socket?.emit("joinTable", table.name, true, (table:any) => { 
                        setJoinLoaded(true)
                        setPlayers(table.players)
                    })
                }}>
                <p>{table.name}</p>
                <p>{new Date(table.creationDate).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })}</p>
            </div>)}
        </div>
        {joinGame !== "" && <div className="gameJoiner">
            <div>
                <h2>{ joinLoaded ? `Préparation de la table ${joinGame}` : "Chargement..." }</h2>
                <h3>Reconnectez les téléphones avec le QR code</h3>
            </div>
            {joinLoaded && <div className="cardsContainer">
                <QRCode className="qrcode" value={`https://kwurz-ow.github.io/powerV3/#mobile/${joinGame}`}/>
                {players.map((player) => {
                    return <div className={`playerCard ${player.color}MainBackground ${player.socketId !== "" ? "visible" : ""}`}>
                        <img src={playerIcon} alt="" />
                        {player.name}
                    </div>
                })}
            </div>}
            <Link className="gameItem" style={{width: "fit-content"}} to={`/table/${joinGame}`}>{`Rejoindre ${joinGame}`}</Link>
        </div>}
        {createGame && <div className="gameJoiner"></div>}
    </div>
}