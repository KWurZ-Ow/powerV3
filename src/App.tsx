import { useEffect, useRef, useState } from "react";
import grille from "./media/grilleCoords.png";
import { createGrid } from "./Pathfinder";
import "./table.css";
import handleOrdre from "./OrdresHandeling";
export interface piece {
  color: colorType;
  type: pieceType;
  case:
    | `${"V" | "B" | "J" | "R" | "S"}${number | "HQ"}`
    | `I${"X" | "N" | "S" | "E" | "W"}`;
}

type colorType = "green" | "blue" | "yellow" | "red";
type pieceType = "S" | "T" | "C" | "D" | "R" | "A" | "B" | "CR";

export default function Table() {
  const [logs, setLogs] = useState([
    `Début de la partie le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}`,
  ]);
  const [pieces, setPieces] = useState<Array<piece>>([
    {
      color: "blue",
      type: "R",
      case: "IN",
    },
  ]);
  const [isMenuToggeled, setIsMenuToggeled] = useState(false);
  useEffect(() => {
    createGrid();
  }, []);

  //debug inputs
  const [debugColor, setDebugColor] = useState("");
  const [debugPiece, setDebugPiece] = useState("");
  const [debugStart, setDebugStart] = useState("");
  const [debugFinish, setDebugFinish] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  function handleDebugOrdre() {
    setDebugPiece("");
    setDebugStart("");
    setDebugFinish("");
    firstInputRef.current!.focus();
    handleOrdre(debugColor, debugPiece, debugStart, debugFinish);
    setLogs(
      logs.concat(
        `Ordre : ${debugColor}, ${debugPiece}, ${debugStart}, ${debugFinish}`
      )
    );
  }

  return (
    <div className="table">
      <div
        className={`menuToggeler ${!isMenuToggeled && "closed"}`}
        onMouseEnter={() => setIsMenuToggeled(!isMenuToggeled)}
      ></div>
      <div className={`menu ${isMenuToggeled && "closed"}`}>
        <h2>Débug</h2>
        <div className="logOrdres">
          <table>
            <thead>
              <tr>
                <th>Couleur</th>
                <th>Pièce</th>
                <th>Départ</th>
                <th>Arrivée</th>
              </tr>
            </thead>
            <tbody>
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
                      setDebugPiece(e.target.value);
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={debugStart}
                    onChange={(e) => {
                      setDebugStart(e.target.value);
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={debugFinish}
                    onChange={(e) => {
                      setDebugFinish(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleDebugOrdre();
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
            {pieces.map((piece) => (
              <tr>
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
      <div className="ordres"></div>
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
