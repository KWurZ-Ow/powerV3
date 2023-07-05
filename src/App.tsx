import { useEffect, useState } from 'react';
import grille  from "./media/grille.png";
import {createGrid, handleClickOnTile, PathfindGrid} from './Pathfinder';
import './table.css';

export default function Table() {
  const [grid, setGrid] = useState(Array<PathfindGrid>)
  useEffect(() => {
    setGrid(createGrid())
  }, [])
  return (
    <div className="table">
      <div className='reserves'>
        <div className="rouge"></div>
        <div className="bleu"></div>
        <div className="jaune"></div>
        <div className="vert"></div>
      </div>
      <div className="plateau">
        <img src={grille} alt="grille" />
        <div className="pathTest">
          { grid.map((square) => {
            let style = {backgroundColor: ""}
            switch (square.type) {
              case "cross":
                style.backgroundColor = "red"
                break;
            
              case "blocked":
                style.backgroundColor = "grey"
                break;
            
              case "start":
                style.backgroundColor = "lime"
                break;
            
              case "finish":
                style.backgroundColor = "purple"
                break;
                
              case "path":
                style.backgroundColor = "orange"
                break;
                
                default:
                style.backgroundColor = "cyan"
                break;
            }
            return <div 
              style={style}
              onClick={() => handleClickOnTile(square.id, grid, setGrid)}>
                {square.inside}
            </div>
          }) }
        </div>
      </div>
      <div className="ordres"></div>
      <div className="logs"></div>
    </div>
  );
}
