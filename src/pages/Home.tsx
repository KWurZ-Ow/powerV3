import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io, Socket } from "socket.io-client";

export default function Home() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [listTables, setListTables] = useState([])
    useEffect(() => {
        const s = io('https://powerdatabase.adaptable.app/')
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        if (!socket) return

        socket.emit("seekTables", (response: any) => {
            setListTables(response)
        })
    }, [socket])


    function createTable(name: string) {
        console.log('socket', socket)
        socket?.emit("createTable", name)
    }


    return <div className="home">
        <h1>Power Version 3 avec gh-pages</h1>
        <ul>
            {listTables.map((table: any) => <li key={table._id}>
                <Link to={`../powerV3/table/${table.name}`}>{table.name}</Link>
            </li>)}
        </ul>
    </div>
}