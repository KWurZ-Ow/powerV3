/* eslint-disable no-loop-func */
export interface PathfindGrid {
    id: number
    x: number
    y: number
    type: tileType
    inside: string
    distTo: number
    distFrom: number
    parent: PathfindGrid | null
}
type tileType = "normal" | "cross" | "blocked" | "start" | "finish" | "path"

let startTile:PathfindGrid | null
let finishTile:PathfindGrid | null
let crossCoords = [2, 7, 10, 15]
let isInVertCol = (x:number) => ((x > 2 && x < 7) || (x > 10 && x < 15))
let isInHoriCol = (x:number) => !((x > 1 && x < 8) || (x > 9 && x < 16))

export function createGrid(){
    let grid:Array<PathfindGrid> = []
    
    for (let i = 0; i < 18; i++) {
        for (let j = 0; j < 18; j++) {
            let type:tileType = (crossCoords.includes(j) && crossCoords.includes(i)) ? "cross" : "normal"
            if (isInVertCol(j) && isInHoriCol(i)) type = "blocked"
            if (isInVertCol(i) && isInHoriCol(j)) type = "blocked"
            grid.push({id: i*18+j, x: j, y:i, type: type, inside: "", distTo: 0, distFrom: 999, parent: null})
        }
    }
    console.log('grid', grid)
    return grid
}

export function handleClickOnTile(id: number, grid:Array<PathfindGrid>, setGrid:any) {
    if (!finishTile){
        grid[id].type = !startTile ? "start" : "finish"
        !startTile ? startTile = grid[id] : finishTile = grid[id]
        if (finishTile){
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
                    console.log("trouvé !")
                    console.log(tilesCalculated)

                    //highlight le path
                    let tileBacktracker = finishTile
                    while (tileBacktracker.parent) {
                        tileBacktracker.parent.type = "path"
                        tileBacktracker = tileBacktracker.parent
                    }
                    break
                }

                //loop sur les voisins
                let neighbours = getneighbours(currentTile.x, currentTile.y, grid)
                neighbours.forEach((neighbour) => {

                    //check si la tile bloquée ou deja calculée
                    if (neighbour.type === "blocked" || tilesCalculated.includes(neighbour)) return

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
        setGrid([...grid])
    }else{
        startTile = finishTile = null
        setGrid(createGrid())
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