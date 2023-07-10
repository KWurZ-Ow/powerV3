/* eslint-disable no-loop-func */
import gridCoords from "./grid.json";
export interface PathfindGrid {
    id: number
    x: number
    y: number
    type: tileType
    inside: string
    distTo: number
    distFrom: number
    parent: PathfindGrid | null
    case: string
}
type tileType = "normal" | "start" | "finish" | "path" | "explored"

export function createGrid(){
    let grid:Array<PathfindGrid> = []
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let id = i*9+j
            grid.push({id , x: j, y:i, type: "normal", inside: gridCoords[id], distTo: 0, distFrom: 999, parent: null, case: gridCoords[id]})
        }
    }
    return grid
}

export function computePath(startTile:PathfindGrid, finishTile:PathfindGrid, grid:Array<PathfindGrid>){
    startTile.distTo = getDistance(startTile, finishTile)
    startTile.distFrom = 0
    let tilesToCalculate:Array<PathfindGrid> = [startTile!]
    let tilesCalculated:Array<PathfindGrid> = []
    while (true) {
        //trouver la tuile avec le plus petit coût
        let currentTile:PathfindGrid = tilesToCalculate[0]
        tilesToCalculate.forEach((tile) => {
            if (tile.distTo + tile.distFrom < currentTile.distFrom + currentTile.distTo){
                currentTile = tile
            }
        })
        
        //changer current de liste
        tilesToCalculate.splice(tilesToCalculate.indexOf(currentTile), 1)
        tilesCalculated.push(currentTile)
    
        //check si on a fini
        if (currentTile.type === "finish"){
    
            //highlight la recherche
            // tilesCalculated.forEach((tile) => {
            //     tile.type = "explored"
            // })

            //highlight le path et l'enregistrer
            let tileBacktracker = finishTile
            let caseCrossed = [finishTile.parent?.case]
            while (tileBacktracker.parent && tileBacktracker.parent.type !== "start") {
                tileBacktracker.parent.type = "path"
                tileBacktracker = tileBacktracker.parent
                if (tileBacktracker.case !== caseCrossed[caseCrossed.length-1] && tileBacktracker.case !== "xx" && tileBacktracker.case !== startTile.case){
                    caseCrossed.unshift(tileBacktracker.case)
                }
            }
            return caseCrossed
        }
    
        //loop sur les voisins
        let neighbours = getneighbours(currentTile.x, currentTile.y, grid)
        neighbours.forEach((neighbour) => {
    
            //check si la tile bloquée ou deja calculée
            if ((neighbour.case.includes("s") && !neighbour.case.includes("i")) || tilesCalculated.includes(neighbour)) return
    
            //set les valeurs de la tile
            grid[neighbour.id].distTo = getDistance(neighbour, finishTile)
            let newDistFrom = getDistance(currentTile, neighbour) + currentTile.distFrom
    
            //check si on la prends
            if (newDistFrom < neighbour.distFrom || !tilesToCalculate.includes(neighbour)){
                grid[neighbour.id].distFrom = newDistFrom
                grid[neighbour.id].parent = currentTile
                if (!tilesToCalculate.includes(neighbour)) tilesToCalculate.push(neighbour)
            }
        })
    }
}

function getDistance(start:any, finish:any){
    const dx = finish.x - start.x;
    const dy = finish.y - start.y;
    return Math.round(Math.sqrt(dx * dx + dy * dy)*10)
}

function getneighbours(x:number, y:number, grid:Array<PathfindGrid>){
    let coords = [
        {x: x-1, y: y+1}, {x: x, y: y+1}, {x: x+1, y: y+1},
        {x: x-1, y: y},                   {x: x+1, y: y},
        {x: x-1, y: y-1}, {x: x, y: y-1}, {x: x+1, y: y-1}
    ]

    let rez:Array<PathfindGrid> = []
    coords.forEach((coord) => {
        let item = grid.find(item => item.x === coord.x && item.y === coord.y)
        if (item) rez.push(item)
    })
    return rez
}