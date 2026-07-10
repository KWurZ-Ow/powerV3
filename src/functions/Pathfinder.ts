import { CaseType } from "../pages/Table";
import gridCoords from "../data/grid.json";
export interface PathfinderGridTile {
    id: number
    x: number
    y: number
    type: TileType
    distTo: number
    distFrom: number
    parent: PathfinderGridTile | null
    case: string
}
type TileType = "normal" | "path" | "explored" | "forbidden"
let grid: Array<PathfinderGridTile> = []

function createGrid() {
    grid = []
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let id = i * 9 + j
            let type: TileType = "normal"
            if (gridCoords[id].match(/^S/)) type = "forbidden"
            grid.push({ id, x: j, y: i, type: type, distTo: 0, distFrom: 999, parent: null, case: gridCoords[id] })
        }
    }
}

function convertCaseToPathfinerGridTiles(tile: CaseType): Array<PathfinderGridTile> {
    return grid.filter(object => object.case === tile)!
}

export function computePath(start: CaseType, finish: CaseType) {
    createGrid()
    let startTile: PathfinderGridTile = convertCaseToPathfinerGridTiles(start)[0]
    let finishTile: PathfinderGridTile = convertCaseToPathfinerGridTiles(finish)[0]
    startTile.distTo = getDistance(startTile, finishTile)
    startTile.distFrom = 0
    let tilesToCalculate: Array<PathfinderGridTile> = [startTile!]
    let tilesCalculated: Array<PathfinderGridTile> = []
    while (true) {
        //trouver la tuile avec le plus petit coût
        let currentTile: PathfinderGridTile = tilesToCalculate.find(f => f.type !== "forbidden")!
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
            return caseCrossed as Array<CaseType>
        }
        
        //loop sur les voisins
        let neighbours = getAdjacentTiles(currentTile.x, currentTile.y, grid)
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

function getDistance(start: PathfinderGridTile, finish: PathfinderGridTile) {
    const dx = finish.x - start.x;
    const dy = finish.y - start.y;
    return Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 10)
}

function getAdjacentTiles(x: number, y: number, grid: Array<PathfinderGridTile>) {
    let coords = [
        { x: x - 1, y: y + 1 }, { x: x, y: y + 1 }, { x: x + 1, y: y + 1 },
        { x: x - 1, y: y }, { x: x + 1, y: y },
        { x: x - 1, y: y - 1 }, { x: x, y: y - 1 }, { x: x + 1, y: y - 1 }
    ]
    
    let rez: Array<PathfinderGridTile> = []
    coords.forEach((coord) => {
        let item = grid.find(item => item.x === coord.x && item.y === coord.y)
        if (item) rez.push(item)
        })
    return rez
}

export function getNeighbours(center:CaseType){
    createGrid()
    let centerTiles = convertCaseToPathfinerGridTiles(center)
    let neighbours:Array<PathfinderGridTile> = []
    centerTiles.forEach(tile => {
        neighbours = neighbours.concat(
            getAdjacentTiles(tile.x, tile.y, grid)
            .filter(item => !neighbours.includes(item) && item.case !== tile.case)
        )
    });
    return neighbours.map((tile) => {
        return(tile.case);  
    })
}