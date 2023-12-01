/* eslint-disable no-loop-func */
import { CaseType } from "./App";
import gridCoords from "./grid.json";
export interface PathfindGrid {
    id: number
    x: number
    y: number
    type: TileType
    distTo: number
    distFrom: number
    parent: PathfindGrid | null
    case: string
}
type TileType = "normal" | "start" | "finish" | "path" | "explored" | "forbidden"
let grid: Array<PathfindGrid> = []

function createGrid(isWaterType: boolean) {
    grid = []
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let id = i * 9 + j
            let type: TileType = "normal"
            if (isWaterType) {
                if (gridCoords[id].match(/[VBJR]4/)) type = "forbidden"
            } else {
                if (gridCoords[id].match(/^S/)) type = "forbidden"
            }
            grid.push({ id, x: j, y: i, type: type, distTo: 0, distFrom: 999, parent: null, case: gridCoords[id] })
        }
    }
}

function caseToGridTile(tile: CaseType): Array<PathfindGrid> {
    return grid.filter(object => object.case === tile)!
}

export function computePath(start: CaseType, finish: CaseType, isWaterType: boolean) {
    createGrid(isWaterType)
    let startTile: PathfindGrid = caseToGridTile(start)[0]
    let finishTile: PathfindGrid = caseToGridTile(finish)[0]
    // grid[finishTile.id].type = "finish"
    // grid[startTile.id].type = "start"
    startTile.distTo = getDistance(startTile, finishTile)
    startTile.distFrom = 0
    let tilesToCalculate: Array<PathfindGrid> = [startTile!]
    let tilesCalculated: Array<PathfindGrid> = []
    while (true) {
        //trouver la tuile avec le plus petit coût
        let currentTile: PathfindGrid = tilesToCalculate[0]
        tilesToCalculate.forEach((tile) => {
            if (tile.distTo + tile.distFrom < currentTile.distFrom + currentTile.distTo && tile.type !== "forbidden") {
                currentTile = tile
            }
        })

        //changer current de liste
        tilesToCalculate.splice(tilesToCalculate.indexOf(currentTile), 1)
        tilesCalculated.push(currentTile)

        //check si on a fini
        if (currentTile.case === finishTile.case) {
            //highlight le path et l'enregistrer
            let tileBacktracker = finishTile
            let caseCrossed: Array<string> = []
            while (tileBacktracker.parent && tileBacktracker.parent.case !== startTile.case) {
                tileBacktracker = tileBacktracker.parent
                caseCrossed.unshift(tileBacktracker.case)
            }
            return caseCrossed
        }

        //loop sur les voisins
        let neighbours = getNeighbours(currentTile.x, currentTile.y, grid)
        neighbours.forEach((neighbour) => {

            //check si la tile bloquée ou deja calculée
            if ((neighbour.case.includes("s") && !neighbour.case.includes("i")) || tilesCalculated.includes(neighbour)) return

            //set les valeurs de la tile
            grid[neighbour.id].distTo = getDistance(neighbour, finishTile)
            let newDistFrom = getDistance(currentTile, neighbour) + currentTile.distFrom

            //check si on la prends
            if (newDistFrom < neighbour.distFrom || !tilesToCalculate.includes(neighbour)) {
                grid[neighbour.id].distFrom = newDistFrom
                grid[neighbour.id].parent = currentTile
                if (!tilesToCalculate.includes(neighbour)) tilesToCalculate.push(neighbour)
            }
        })
    }
}

function getDistance(start: PathfindGrid, finish: PathfindGrid) {
    const dx = finish.x - start.x;
    const dy = finish.y - start.y;
    return Math.round(Math.sqrt(dx * dx + dy * dy) * 10)
}

function getNeighbours(x: number, y: number, grid: Array<PathfindGrid>) {
    let coords = [
        { x: x - 1, y: y + 1 }, { x: x, y: y + 1 }, { x: x + 1, y: y + 1 },
        { x: x - 1, y: y }, { x: x + 1, y: y },
        { x: x - 1, y: y - 1 }, { x: x, y: y - 1 }, { x: x + 1, y: y - 1 }
    ]

    let rez: Array<PathfindGrid> = []
    coords.forEach((coord) => {
        let item = grid.find(item => item.x === coord.x && item.y === coord.y)
        if (item) rez.push(item)
    })
    return rez
}

export function getAllNeighbours(center:CaseType){
    let centerTiles = caseToGridTile(center)
    createGrid(true)
    let neighbours:Array<PathfindGrid> = []
    centerTiles.forEach(tile => {
        neighbours = neighbours.concat(getNeighbours(tile.x, tile.y, grid).filter(item => !neighbours.includes(item)))
    });
    return neighbours.map((tile) => {
        return(tile.case);  
    })
}