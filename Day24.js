const util = require('./Util.js');

const kNeighboursTransform = new Map([["e" , [1, 0]],
                                      ["se", [0, 1]],
                                      ["sw", [-1,1]],
                                      ["w",  [-1,0]],
                                      ["ne", [1,-1]],
                                      ["nw", [0,-1]]]);


function GetKey0(aX, aY) {
  return aX + "#" + aY;
}  

function GetKey(aObject) {
  return GetKey0(aObject.x, aObject.y);
}    

function CountBlack(aTilesState) {
  let blackTilesCount = 0;
  for (let [key, value] of aTilesState)
    if (value.color == 1)
      blackTilesCount++;
  return blackTilesCount;
}

function FlipTiles(aTiles, aTilesState) {

  for (let i = 0; i < aTiles.length; i++) {

    let tile = aTilesState.get(GetKey(aTiles[i]));
    
    if (tile !== undefined)
        tile.color = (tile.color == 0) ? 1 : 0;
    else {
      let entry =  { x: aTiles[i].x, y: aTiles[i].y, color: 1 };
      aTilesState.set(GetKey(entry), entry);
    }
  }

  return CountBlack(aTilesState);
}

function GetTile(aX, aY, aTilesState) {
   return aTilesState.get(GetKey0(aX, aY));
}

function GetTileColor(aX, aY, aTilesState) {

  let tile = GetTile(aX, aY, aTilesState);

  if (tile === undefined)
    return -1;

  return tile.color;
}

function ComputeNeighboursColorCount(aX, aY, aTilesState, aExtra) {
  let blackCount = 0;

  for (let [key, value] of kNeighboursTransform) {
    let x = aX + value[0];
    let y = aY + value[1];

    let color = GetTileColor(x, y, aTilesState);

    if (color == 1)
      blackCount++;

      if ((aExtra !== undefined) && (color == -1))
        aExtra.set(GetKey0(x, y), { x: x, y: y, color: 0 });
  }

  return blackCount;
}

function FlipTile(aTile, aTilesState, aNewTilesState, aExtra) {
  let blackCount = ComputeNeighboursColorCount(aTile.x, aTile.y, aTilesState, aExtra);

  let newColor = 0;
  if (aTile.color == 1)
    newColor = ((blackCount == 0) || (blackCount > 2)) ? 0 : 1;
  else
    newColor = (blackCount == 2) ? 1 : 0;

  if (!aNewTilesState.has(GetKey(aTile)))
    aNewTilesState.set(GetKey(aTile), { x: aTile.x, y: aTile.y, color: newColor });
}

function TransformTiles(aTilesState, aNewTilesState) {
  for (let [key, tile] of aTilesState) {

    let extra = new Map();
    FlipTile(tile, aTilesState, aNewTilesState, extra);

    for (let [keyExtra, tileExtra] of extra)
      FlipTile(tileExtra, aTilesState, aNewTilesState);      
  }
}

function RunFloorExhibit(aTilesState) {
  let i = 0;
  let tilesState = aTilesState;
  while (i < 100) {

    let newTilesState = new Map();
    TransformTiles(tilesState, newTilesState);

    tilesState = newTilesState;
    i++;
  }

  return CountBlack(tilesState);
}

let tiles = util.MapInput('./Day24Input.txt', (aElem) => {
  let rawElem = aElem.split('');

  let x = 0;
  let y = 0;
  for (let i = 0; i < rawElem.length; i++) {
    let ch = rawElem[i];
    let dir = ch;
    if ((ch == 's') || (ch == 'n')) {
      let next = ((i + 1) < rawElem.length) ? rawElem[i + 1] : '';
      dir += next;
      i++;
    }

    let transform = kNeighboursTransform.get(dir);

    x += transform[0];
    y += transform[1];
  }

  return { x: x, y: y };
}, '\r\n');

let tileState = new Map();
console.log(FlipTiles(tiles, tileState));
console.log(RunFloorExhibit(tileState));
