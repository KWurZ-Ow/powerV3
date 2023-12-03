import { useEffect, useRef, useState } from "react";
import grille from "./media/grilleCoords.png";
import "./table.css";
import CheckOrder, { isCase } from "./OrdersChecking";
import authorizeOrder from "./OrdersAuthorizing";
import names from "./names.json"
import gridPoints from "./gridPoints.json"

type OneToHeight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type NineToTwelve = 9 | 10 | 11 | 12;
export type CaseType =
  | `${"V" | "B" | "J" | "R"}${0 | OneToHeight | "HQ"}`
  | `S${OneToHeight | NineToTwelve}`
  | `I${"X" | "N" | "S" | "E" | "W"}`;

export interface PieceItemType {
  color: ColorType;
  type: PieceType;
  case: CaseType;
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
  const [logs, setLogs] = useState([
    `Début de la partie le ${new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })} à ${new Date().toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}`,
  ]);
  const [pieces] = useState<Array<PieceItemType>>([
    {
      color: "blue",
      type: "R",
      case: "J0",
    },
    {
      color: "red",
      type: "A",
      case: "J4",
    },
    {
      color: "red",
      type: "CR",
      case: "S12",
    },
    {
      color: "green",
      type: "C",
      case: "VHQ",
    },
  ]);
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

  useEffect(() => {
    setPlateauWidth(plateauRef.current!.offsetWidth)
  }, [])

  useEffect(() => {
    if (isCase(debugFinish)) handleDebugOrder()
  }, [debugFinish])

  function handleDebugOrder() {
    if (!debugColor || !debugPiece || !debugStart || !debugFinish) return
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
      setIsTrajetDrawing(true)
      setIsTrajetDrawing(false)

      setLogs(
        [
          `Déplacement d'un ${convertName(order.piece)} ${convertName(order.color)} de ${order.start} à ${order.finish}`,
        ].concat(logs)
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
        {gridPoints.map((point) => <polygon className="gridHover" points={point.hixbox} onClick={() => { setDebugFinish(point.name) }} />)}
        <polyline className={`${isTrajetDrawing && "drawing"}`} points={trajet} />
        {pieces.map((piece) => <circle r={15} fill={piece.color} key={piece.case + piece.color + piece.type}
          onClick={() => {
            setDebugColor(piece.color)
            setDebugStart(piece.case)
            setDebugPiece(piece.type)
          }}
          cx={gridPoints.find(f => f.name === piece.case)!.x * (plateauWidth / 18)}
          cy={gridPoints.find(f => f.name === piece.case)!.y * (plateauWidth / 18)} />)}
      </svg>
      <div
        className={`menuToggeler ${!isMenuToggeled && "closed"}`}
        onMouseEnter={() => setIsMenuToggeled(!isMenuToggeled)}
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
                      if (e.key === "Enter") handleDebugOrder();
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
                <td>{piece.type}</td>
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
        <div className={`errorBubble ${debugErrorMessage && "active"}`} style={{backgroundColor: "red"}}>{debugErrorMessage}</div>
      </div>
      <div className="logContainer">
        {logs.length === 0 && <div className="log grey">Pas de logs</div>}
        {logs.map((log) => (
          <div key={log} className="log grey">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
