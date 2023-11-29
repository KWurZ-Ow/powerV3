import { useRef, useState } from "react";
import grille from "./media/grilleCoords.png";
import "./table.css";
import CheckOrder from "./OrdersChecking";
import executeOrder from "./OrdersHandeling";
import names from "./names.json"

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
  ]);
  const [isMenuToggeled, setIsMenuToggeled] = useState(false);

  const [debugErrorMessage, setDebugErrorMessage] = useState<string | null>();

  //debug inputs
  const [debugColor, setDebugColor] = useState("");
  const [debugPiece, setDebugPiece] = useState("");
  const [debugStart, setDebugStart] = useState("");
  const [debugFinish, setDebugFinish] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  function handleDebugOrder() {
    setDebugPiece("");
    setDebugStart("");
    setDebugFinish("");
    try {
      console.log(`=== Ordre de débug envoyé : ${debugColor} | ${debugPiece} | ${debugStart} | ${debugFinish} ===`)
      const order = CheckOrder(debugColor, debugPiece.trim(), debugStart.trim(), debugFinish.trim());
      executeOrder(order, pieces);

      setLogs(
        [
          `Déplacement d'un ${convertName(order.piece)} ${convertName(order.color)} de ${order.start} à ${order.finish}`,
        ].concat(logs)
      );
    } catch (error: any) {
      if (error.name === "CheckingError") console.log("Ordre incorrect ❌")
      if (error.name === "HandelingError") console.log("Ordre refusé ❌")
      console.error(error.message);
      console.error(error.stack)
      setDebugErrorMessage(error.message)
      setTimeout(() => {
        setDebugErrorMessage(null)
      }, 3000);
    }
    firstInputRef.current!.focus();
  }

  return (
    <div className="table">
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
      <div className="plateau">
        <img src={grille} alt="grille" />
      </div>
      <div className="orders"></div>
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
