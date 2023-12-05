import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client'
import "../app.css";

export default function Mobile() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [color, setColor] = useState("")

    useEffect(() => {
        const s = io('http://localhost:3001')
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        if (color === "") return

        socket?.emit("register", color)
    }, [color, socket])

    return <div className='mobile'>
        <h1>Power Mobile</h1>
        {color === "" ? <>

            <p>Quelle couleur es-tu ?</p>
            <div className="radio">
                <input type="radio" id="green" name="color" />
                <label
                    htmlFor="green"
                    onClick={() => setColor("green")}
                ></label>
                <input type="radio" id="blue" name="color" />
                <label
                    htmlFor="blue"
                    onClick={() => setColor("blue")}
                ></label>
                <input type="radio" id="yellow" name="color" />
                <label
                    htmlFor="yellow"
                    onClick={() => setColor("yellow")}
                ></label>
                <input type="radio" id="red" name="color" />
                <label
                    htmlFor="red"
                    onClick={() => setColor("red")}
                ></label>
            </div>
        </> :
            <p>Ok, salut {color} !</p>}
    </div>
}