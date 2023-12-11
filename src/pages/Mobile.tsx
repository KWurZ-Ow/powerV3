import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client'
import "../app.css";
import { useParams } from 'react-router-dom';
import { childProps } from "../App";
import playerIcon from "../media/playerIcon.svg"
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

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

        socket?.on("tableUpdated", (updatedTable, wipe) => {
            setTable(updatedTable)
            console.log('players', updatedTable.players)
            if (wipe) {
                console.log("reset state color")
                setColor("")
            }
        })
        socket?.emit("joinTable", tableId, false, (response: any) => {
            console.log("connected")
            setTable(response)
        })
    }, [socket, tableId])

    useEffect(() => {
        if (color === "" || !tableId) return

        socket?.emit("register", tableId, color)
    }, [color, socket, tableId])

    type inputsType = {
        [cle: string]: string | number;
    }

    // Keyboard

    const [inputs, setInputs] = useState<inputsType>({});
    const [inputName, setInputName] = useState(0);

    const onChangeAll = (inputs: any) => {
        const upperCased: any = {};
        Object.keys(inputs).forEach((cle) => {
            upperCased[cle] = inputs[cle].toUpperCase();
        });

        setInputs({ ...upperCased });
    };
    const onChangeInput = (event: any) => {
        const inputVal = event.target.value;
        setInputs({
            ...inputs,
            [inputName]: inputVal.toUpperCase()
        });
    };
    const getInputValue = (inputName: number) => {
        return inputs[inputName] || ""
    };
    const onKeyPress = (button: any) => {
        if (button === "{nxt}") {
            if (inputName > 13) {
                setInputName(0)
            } else {
                setInputName(inputName + 1)
            }
        }
        if (button === "{prev}") {
            if (inputName < 1) {
                setInputName(14)
            } else {
                setInputName(inputName - 1)
            }
        }
    };
    const customLayout = {
        'default': [
            'S R E 0 1 2',
            'C B M 3 4 5',
            'D C R 6 7 8',
            'P H Q s I {bksp}',
            'V b J r {prev} {nxt}'
        ]
    }
    let customDisplay = {
        '{bksp}': '←',
        '{prev}': '⇦',
        '{nxt}': '⇨',
        's': 'S',
        'b': 'B',
        'r': 'R'
    }
    let buttonTheme = [
        {
            class: "keyGrey",
            buttons: "S R C B D C R"
        },
        {
            class: "keyLightgrey",
            buttons: "0 1 2 3 4 5 6 7 8"
        }
    ]

    if (!table) return <h1>Scanne le QR code</h1>

    return <div className={`mobile ${color}`}>
        <h1>Power V3 !!!</h1>
        {color === "" ? <>
            <h2>Bienvenue sur la table "{table.name}"</h2>
            <p>Quel joueur est-tu ?</p>
            <div className="playersContainer">
                {table.players.map((player: any) => <div
                    className={`playerItem ${player.color}MainBackground ${player.socketId !== "" && "picked"}`}
                    key={player.color}
                    onClick={() => { if (player.socketId === "") setColor(player.color) }}
                >
                    <img src={playerIcon} alt="" />
                    <span>{player.name}</span>
                </div>
                )}
            </div>
        </> :
            <>
                <h2>Sur la table "{table.name}"</h2>
                {[...Array(15)].map((_, i) => (
                    <input
                        key={i}
                        value={getInputValue(i)}
                        onFocus={() => setInputName(i)}
                        className={inputName === i ? "focus" : ""}
                        onChange={onChangeInput}
                    />
                ))}
                <button onClick={() => { 
                    socket?.emit("unRegister", tableId, color, (table:any) => {
                        setTable(table)
                    })
                    setColor("")
                 }}>Retour</button>

            </>}
        <Keyboard
            layoutName={"default"}
            onChangeAll={onChangeAll}
            layout={customLayout}
            display={customDisplay}
            theme={`hg-theme-default myTheme1 ${color === "" ? "" : "active"}`}
            inputName={String(inputName)}
            onKeyPress={onKeyPress}
            buttonTheme={buttonTheme}
        />
    </div>
}