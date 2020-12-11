const util = require('./Util.js');

function GetNeighbours(aSeatMap, aX, aY) {
  const neighboursTransform = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

  let neighbours = neighboursTransform.map((aElem) => {
    let x = aX + aElem[0];
    let y = aY + aElem[1];

    if ((y >= 0) && (y < aSeatMap.length) && (x >= 0) && (x < aSeatMap[y].length))
      return aSeatMap[y][x];
    else
      return '.';
  });

  return neighbours;
}

function GetNeighbours2(aSeatMap, aX, aY) {
  const neighboursTransform = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

  let neighbours = [];
  neighboursTransform.reduce((aTotal, aElem) => {
    let x = aX + aElem[0];
    let y = aY + aElem[1];

    while ((y >= 0) && (y < aSeatMap.length) && (x >= 0) && (x < aSeatMap[y].length)) {
      aTotal.push(aSeatMap[y][x]);

      if (aSeatMap[y][x] == '#' || aSeatMap[y][x] == 'L')
        break;

      x += aElem[0];
      y += aElem[1];
    }
    return aTotal;
  }, neighbours);

  return neighbours;
}

function MapsAreEqual(aMap1, aMap2) {
  if (aMap1.length != aMap2.length)
    return false;

  for (let i = 0; i < aMap1.length; i++)
    for (let j = 0; j < aMap1[i].length; j++)
      if (aMap1[i][j] != aMap2[i][j])
        return false;

  return true;
}

function CountOccupied(aSeatMap) {
  let count = aSeatMap.reduce((aTotal, aElem) => {
    return aElem.reduce((aTotal, aElem) => {
      return (aElem == '#') ? aTotal + 1 : aTotal;
    }, aTotal);
  }, 0);

  return count;
}

function Transform(aSeatMap, aNeighboursFunc, aOccupiedMax) {
  let newSeatMap = aSeatMap.map((aElem, aY) => {
    return aElem.map((aElem, aX) => {
      if (aElem == 'L') {
        let empty = { count: 0 };
        let neighbours = aNeighboursFunc(aSeatMap, aX, aY);
        neighbours.reduce((aTotal, aElem) => {
          if ((aElem == 'L') || (aElem == '.'))
            aTotal.count++;
          return aTotal;
        }, empty);
        return (empty.count == neighbours.length) ? '#' : aElem;
      }
      else if (aElem == '#') {
        let occupied = { count: 0 };
        aNeighboursFunc(aSeatMap, aX, aY).reduce((aTotal, aElem) => {
          if (aElem == '#') aTotal.count++; return aTotal;
        }, occupied);
        return (occupied.count >= aOccupiedMax) ? 'L' : aElem;
      }
      else
        return aElem;
    });
  });

  return newSeatMap;
}

function AnalizeSeats(aSeatMap, aNeighboursFunc, aOccupiedMax) {
  let seatMap = util.CopyObject(aSeatMap);
  while (true) {
    let newSeatMap = Transform(seatMap, aNeighboursFunc, aOccupiedMax);

    if (MapsAreEqual(newSeatMap, seatMap))
      return CountOccupied(newSeatMap);

    seatMap = newSeatMap;
  }

  return 0;
}

let seatMap = util.MapInput('./Day11Input.txt', (aElem) => {
  return aElem.split('');
}, '\r\n');

console.log(AnalizeSeats(seatMap, GetNeighbours, 4));
console.log(AnalizeSeats(seatMap, GetNeighbours2, 5));
