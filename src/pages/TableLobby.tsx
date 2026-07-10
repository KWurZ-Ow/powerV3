import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function TableLobby({ backUrl: ioUrl, frontUrl: frontUrl, socket: socket, setLogs, setPieces }: childProps) {
    const [isCreatingGame, setIsCreatingGame] = useState(false)
    const [isTableLoaded, setIsTableLoaded] = useState(false)
    const [tableJoining, setTableJoining] = useState("")
    const [tables, setTables] = useState([])
    const [players, setPlayers] = useState<Array<PlayerType>>([])


    useEffect(() => {
        if (!socket) return

        socket.emit("seekTables", (response: any) => {
            setTables(response)
        })
        socket.on("tableUpdated", (response, wipe) => {
            console.log(response.players)
            setPlayers(response.players)
        })
    }, [socket])

    return <div className="home">
        <div className="title">
            <h1>⚡ Power Version 3 !!!</h1>
            <h3>{socket?.connected ? "Bienvenue, rejoignez ou créez une table" : "Connexion au serveur..."}</h3>
        </div>
        {tables.length > 0 && <div className="gamesContainer">
            <div className="gameItem" onClick={() => {
                setIsCreatingGame(true)
                setTableJoining("")
                socket?.emit("createTable", "Test")
            }}>
                <p>Créer une nouvelle table</p>
                <p>{"->"}</p>
            </div>

            {tables.map((table: any) => <div
                key={table._id}
                className="gameItem"
                onClick={() => {
                    setIsTableLoaded(false)
                    setTableJoining(table.name)
                    setIsCreatingGame(false)
                    setPlayers([])
                    socket?.emit("joinTable", table.name, true, (table:any) => { 
                        setIsTableLoaded(true)
                        setPlayers(table.players)
                        setPieces(table.pieces)
                        setLogs(table.logs)
                    })
                }}>
                <p>{table.name}</p>
                <p>{new Date(table.creationDate).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })}</p>
            </div>)}
        </div>}
        {tableJoining !== "" && <div className="gameJoiner">
            <div>
                <h2>{ isTableLoaded ? `Préparation de la table ${tableJoining}` : "Chargement..." }</h2>
                <h3>Reconnectez les téléphones avec le QR code</h3>
            </div>
            {isTableLoaded && <div className="cardsContainer">
                <QRCode className="qrcode" value={`${frontUrl}/#mobile/${tableJoining}`}/>
                {players.map((player, index) => {
                    return <div key={index} className={`playerCard ${player.color}MainBackground ${player.socketId !== "" ? "visible" : ""}`}>
                        <img src={playerIcon} alt="" />
                        {player.name}
                    </div>
                })}
            </div>}
            <Link className="gameItem" style={{width: "fit-content"}} to={`/table/${tableJoining}`}>{`Rejoindre ${tableJoining}`}</Link>
        </div>}
        {isCreatingGame && <div className="gameJoiner"></div>}
    </div>
}