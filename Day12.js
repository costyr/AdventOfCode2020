const util = require('./Util.js');

const kNorth = 0;
const kEast = 1;
const kSouth = 2;
const kWest = 3;

function Navigate(aDirections, aStart) {

  let pos = aStart;
  let map = [0, 0, 0, 0];

  for (let i = 0; i < aDirections.length; i++)
    if (aDirections[i].dir == 'N')
      map[kNorth] += aDirections[i].units;
    else if (aDirections[i].dir == 'S')
      map[kSouth] += aDirections[i].units;
    else if (aDirections[i].dir == 'E')
      map[kEast] += aDirections[i].units;
    else if (aDirections[i].dir == 'W')
      map[kWest] += aDirections[i].units;
    else if (aDirections[i].dir == 'F') 
    {
      let opositeDir = (pos + 2) % 4;
      let units = aDirections[i].units - map[opositeDir];
      if (units < 0)
        map[opositeDir] = Math.abs(units); 
      else
      {
        map[opositeDir] = 0;
        map[pos] += units;
      }
    }
    else if (aDirections[i].dir == 'R')
    {
      let units = aDirections[i].units;    
      pos = (pos + (units / 90)) % 4;
    }
    else if (aDirections[i].dir == 'L')
    {
      let units = aDirections[i].units;
      pos = pos - units / 90;
      if (pos < 0)
        pos = 4 + pos;
    }

  return Math.abs(map[kNorth] - map[kSouth]) + Math.abs(map[kWest] - map[kEast]); 
}

function Navigate3(aDirections) {
  let x = 10;
  let y = 1;

  let shipX = 0;
  let shipY = 0;

  let rotations = [[1, -1], [-1, -1], [-1, 1]];

  for (let i = 0; i < aDirections.length; i++) {
    if (aDirections[i].dir == 'N')
      y += aDirections[i].units;
    else if (aDirections[i].dir == 'S')
      y -= aDirections[i].units;
    else if (aDirections[i].dir == 'E')
      x += aDirections[i].units;
    else if (aDirections[i].dir == 'W')
      x -= aDirections[i].units;
    else if (aDirections[i].dir == 'F') 
    {
      shipX += x * aDirections[i].units;
      shipY += y * aDirections[i].units;
    }
    else if ((aDirections[i].dir == 'R') || (aDirections[i].dir == 'L'))
    {
      let rotationIndex = (aDirections[i].dir == 'R') ? aDirections[i].units / 90 - 1 : 3 - aDirections[i].units / 90;
      let rotation = rotations[rotationIndex];

      if (rotationIndex != 1) {
        let tmp = x;
        x = y;
        y = tmp;
      }
      
      x *= rotation[0];
      y *= rotation[1];
    }
  }

   return Math.abs(shipX) + Math.abs(shipY); 
}

let directions = util.MapInput('./Day12Input.txt', (aElem) => {
  return { dir: aElem.substring(0, 1), units: parseInt(aElem.substring(1)) };
}, '\r\n');

console.log(Navigate(directions, 1));
console.log(Navigate3(directions));
