const util = require('./Util.js');

function ParseMap(aTotal, aElem) 
{
  let line = aElem.split('');

  aTotal.push(line);

  return aTotal;
}

function CountTrees(aMap, aSlopeX, aSlopeY) 
{
  let i = 0;
  let j = 0;
  let treeCount = 0;
  while (true)
  {
    let x = i % aMap[0].length;
    if (aMap[j][x] == '#')
      treeCount ++;

    i += aSlopeX;
    j += aSlopeY;

    if (j >= aMap.length)
      return treeCount;
  }

  return 0;
}

function ComputeTotal(aMap) 
{
  let slopes = [{x: 1, y: 1 }, { x: 3, y :1}, { x: 5, y: 1}, {x: 7, y: 1}, {x: 1, y: 2}];

  let total = 1;
  for (let i = 0; i < slopes.length; i++) 
  {
    let treeCount = CountTrees(aMap, slopes[i].x, slopes[i].y);
    total *= treeCount;
  }

  return total;
}

let map = [];
util.ReduceInput('./Day3Input.txt', ParseMap, map, '\r\n');

console.log(CountTrees(map, 3, 1));
console.log(ComputeTotal(map));