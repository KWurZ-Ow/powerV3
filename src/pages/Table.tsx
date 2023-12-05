import { useEffect, useRef, useState } from "react";
import grille from "../media/grilleCoords.png";
import "../app.css";
import CheckOrder from "../components/OrdersChecking";
import authorizeOrder from "../components/OrdersAuthorizing";
import names from "../data/names.json"
import gridPoints from "../data/gridPoints.json"
import { io, Socket } from 'socket.io-client'
import { useParams } from "react-router-dom";

type OneToHeight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type NineToTwelve = 9 | 10 | 11 | 12;
export type CaseType =
  | `${"V" | "B" | "J" | "R"}${0 | OneToHeight | "HQ"}`
  | `S${OneToHeight | NineToTwelve}`
  | `I${"X" | "N" | "S" | "E" | "W"}`;

export interface PieceItemType {
  color: ColorType;
  unite: PieceType;
  case: CaseType;
}
export interface LogType {
  color: string,
  content: string,
  _id: string
}

export type ColorType = "green" | "blue" | "yellow" | "red";
export type PieceType = "S" | "T" | "C" | "D" | "R" | "A" | "B" | "CR";
export type NameType = PieceType | ColorType

export function convertName(name: NameType) {
  if (name in names) {
    return names[name]
  } else {
    return name
  }
}
export default function Table() {
  const { id: tableId } = useParams()
  const [logs, setLogs] = useState<Array<LogType>>([{_id: "1", color: "grey", content: "Cette table n'existe pas"}]);
  const [pieces, setPieces] = useState<Array<PieceItemType>>([]);
  const [isMenuToggeled, setIsMenuToggeled] = useState(true);

  const [debugErrorMessage, setDebugErrorMessage] = useState<string | null>();

  //debug inputs
  const [debugColor, setDebugColor] = useState("");
  const [debugPiece, setDebugPiece] = useState("");
  const [debugStart, setDebugStart] = useState("");
  const [debugFinish, setDebugFinish] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  const plateauRef = useRef<HTMLDivElement>(null)
  const [plateauWidth, setPlateauWidth] = useState(0);
  const [trajet, setTrajet] = useState("");
  const [isTrajetDrawing, setIsTrajetDrawing] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    setPlateauWidth(plateauRef.current!.offsetWidth) //todo rework
    
    const s = io('http://localhost:3001')
    setSocket(s)
    
    return () => {
      s.disconnect()
    }
  }, [])
  
  useEffect(() => {
    if (!socket || !tableId) return
    
    socket.once("loadPieces", (pieces: Array<any>, logs: Array<any>) => {
      console.log('logs', logs)
      setPieces(pieces)
      setLogs(logs)
    })

    socket.emit("joinTable", tableId)
  }, [socket, tableId])

  function createTable(name: string) {
    console.log('socket', socket)
    socket?.emit("createTable", name)
  }

  function saveData() {
    socket?.emit("saveData", pieces, logs)
  }

  function handleSectorClick(point: string) {
    setDebugFinish(point)
    handleDebugOrder(debugColor, debugPiece, debugStart, point)
  }

  function generateEpochString() {
    const epoch = String(Date.now());
    const zeros = '0'.repeat(24 - epoch.length);
    return epoch + zeros;
  }

  function handleDebugOrder(debugColor: string, debugPiece: string, debugStart: string, debugFinish: string) {
    setDebugPiece("");
    setDebugStart("");
    setDebugFinish("");
    try {
      console.log(`%c === Ordre de débug envoyé : ${debugColor} | ${debugPiece} | ${debugStart} | ${debugFinish} ===`, 'background: #666')
      const order = CheckOrder(debugColor, debugPiece.trim(), debugStart.trim(), debugFinish.trim());
      let path = authorizeOrder(order, pieces);

      //tracher le cheming
      path.unshift(order.start)
      path.push(order.finish)
      let trajetX = path.map((tile) => gridPoints.find((f) => f.name === tile)!.x)
      let trajetY = path.map((tile) => gridPoints.find((f) => f.name === tile)!.y)

      setTrajet(trajetX.map((x, y) => `${x * (plateauWidth / 18)}, ${trajetY[y] * (plateauWidth / 18)}`).join(" "))
      saveData()
      setIsTrajetDrawing(true)
      setTimeout(() => {
        setIsTrajetDrawing(false)
      }, 0);//todo mettre a 2000

      setLogs(
        [{
          color: `${order.color}`,
          content: `Déplacement d'un ${convertName(order.piece)} ${convertName(order.color)} de ${order.start} à ${order.finish}`,
          _id: generateEpochString()
        }].concat(logs)
      );
    } catch (error: any) {
      if (error.name === "CheckingError") console.log("Ordre incorrect ❌")
      if (error.name === "AuthorizingError") console.log("Ordre révoqué ❌")
      console.error(error.message);
      // console.error(error.stack)
      setDebugErrorMessage(error.message)
      setTimeout(() => {
        setDebugErrorMessage(null)
      }, 3000);
    }
    firstInputRef.current!.focus();
  }

  return (
    <div className="table">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
        {gridPoints.map((point) => <polygon key={point.name} className="gridHover" points={point.hixbox} onClick={() => { handleSectorClick(point.name) }} />)}
        <polyline className={`${isTrajetDrawing && "drawing"}`} points={trajet} />
        {pieces.map((piece) => <circle r={15} fill={piece.color} key={piece.case + piece.color + piece.unite}
          onClick={() => {
            setDebugColor(piece.color)
            setDebugStart(piece.case)
            setDebugPiece(piece.unite)
          }}
          cx={gridPoints.find(f => f.name === piece.case)!.x * (plateauWidth / 18)}
          cy={gridPoints.find(f => f.name === piece.case)!.y * (plateauWidth / 18)} />)}
      </svg>
      <div
        className={`menuToggeler ${!isMenuToggeled && "closed"}`}
        onMouseEnter={() => { setIsMenuToggeled(!isMenuToggeled) }}
      ></div>
      <div className={`menu ${isMenuToggeled && "closed"}`}>
        <h2>Débug</h2>
        <div className="logOrders">
          <div className={`errorBubble ${debugErrorMessage && "active"}`}>{debugErrorMessage}</div>
          <table>
            <tbody>
              <tr>
                <th>Couleur</th>
                <th>Pièce</th>
                <th>Départ</th>
                <th>Arrivée</th>
              </tr>
              <tr>
                <td
                  className="radio"
                  onClick={() => firstInputRef.current!.focus()}
                >
                  <input type="radio" id="green" name="color" />
                  <label
                    htmlFor="green"
                    onClick={() => setDebugColor("green")}
                  ></label>
                  <input type="radio" id="blue" name="color" />
                  <label
                    htmlFor="blue"
                    onClick={() => setDebugColor("blue")}
                  ></label>
                  <input type="radio" id="yellow" name="color" />
                  <label
                    htmlFor="yellow"
                    onClick={() => setDebugColor("yellow")}
                  ></label>
                  <input type="radio" id="red" name="color" />
                  <label
                    htmlFor="red"
                    onClick={() => setDebugColor("red")}
                  ></label>
                </td>
                <td>
                  <input
                    type="text"
                    value={debugPiece}
                    ref={firstInputRef}
                    onChange={(e) => {
                      setDebugPiece(e.target.value.toUpperCase());
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={debugStart}
                    onChange={(e) => {
                      setDebugStart(e.target.value.toUpperCase());
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={debugFinish}
                    onChange={(e) => {
                      setDebugFinish(e.target.value.toUpperCase());
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleDebugOrder(debugColor, debugPiece, debugStart, debugFinish);
                      if (e.key === "Tab") {
                        e.preventDefault();
                        firstInputRef.current!.focus();
                      }
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3>Pièces</h3>
        <table>
          <tbody>
            <tr>
              <th>Couleur</th>
              <th>Type</th>
              <th>Case</th>
            </tr>
            {pieces.map((piece, i) => (
              <tr key={i}>
                <td>{piece.color}</td>
                <td>{piece.unite}</td>
                <td>{piece.case}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="reserves">
        <div className="rouge"></div>
        <div className="bleu"></div>
        <div className="jaune"></div>
        <div className="vert"></div>
      </div>
      <div className="plateau" ref={plateauRef}>
        <img src={grille} alt="grille" />
      </div>
      <div className="orders">
        <div className={`errorBubble ${debugErrorMessage && "active"}`} style={{ backgroundColor: "red" }}>{debugErrorMessage}</div>
      </div>
      <div className="logContainer">
        {logs.length === 0 && <div className="log grey">Pas de logs</div>}
        {logs.map((log) => (
          <div key={log._id} className="log grey">
            {log.content}
          </div>
        ))}
      </div>
    </div>
  );
}
