const util = require('./Util.js');
const pointmap = require('./PointMap.js');
const nthMatrix = require('./NthMatrix.js');

const kNeighbours3DTransform = pointmap.ComputeNthNeighboursTransform(3);
const kNeighbours4DTransform = pointmap.ComputeNthNeighboursTransform(4);

function CountNeighbours3D(a3DMatrix, aX, aY, aZ) {
  let countMap = new Map();
  pointmap.CountNthNeighbours(((a3DMatrix, aPoint) => {
    
    let x = aPoint[0];
    let y = aPoint[1];
    let z = aPoint[2];
    
    if ((z >= 0) && (z < a3DMatrix.length) &&
        (y >= 0) && (y < a3DMatrix[z].length) &&
        (x >= 0) && (x < a3DMatrix[z][y].length))
      return a3DMatrix[z][y][x];
    else
      return '.';

  }).bind(null, a3DMatrix), kNeighbours3DTransform, [aX, aY, aZ], countMap);

 return countMap.get('#');
}

function CountNeighbours4D(a4DMatrix, aX, aY, aZ, aW) {
  let countMap = new Map();
  pointmap.CountNthNeighbours(((a4DMatrix, aPoint) => {
    
    let x = aPoint[0];
    let y = aPoint[1];
    let z = aPoint[2];
    let w = aPoint[3];
    
    if ((w >= 0) && (w < a4DMatrix.length) &&
        (z >= 0) && (z < a4DMatrix[w].length) &&
        (y >= 0) && (y < a4DMatrix[w][z].length) &&
        (x >= 0) && (x < a4DMatrix[w][z][y].length))
      return a4DMatrix[w][z][y][x];
    else
      return '.';

  }).bind(null, a4DMatrix), kNeighbours4DTransform, [aX, aY, aZ, aW], countMap);

 return countMap.get('#');
}

function Transform3D(aMatrix, aCyclesCount) {
  let zMatrix = [];

  let width = aMatrix[0].length + 2;
  let height = aMatrix.length + 2;

  zMatrix.push(nthMatrix.GenerateMatrix(width, height, '.'));
  nthMatrix.Extend2DMatrix(aMatrix, '.');
  zMatrix.push(aMatrix);
  zMatrix.push(nthMatrix.GenerateMatrix(width, height, '.'));

  let i = 0;
  while (i < aCyclesCount) {

    let newZMatrix = [];
    for (let z = 0; z < zMatrix.length; z++) {
      if (newZMatrix[z] == undefined)
        newZMatrix[z] = [];
      for (let y = 0; y < zMatrix[z].length; y++) {
        if (newZMatrix[z][y] == undefined)
          newZMatrix[z][y] = [];
        for (let x = 0; x < zMatrix[z][y].length; x++) {
          let count = CountNeighbours3D(zMatrix, x, y, z);
          if (zMatrix[z][y][x] == '#') {
            if (count == 2 || count == 3)
              newZMatrix[z][y][x] = '#'
            else
              newZMatrix[z][y][x] = '.';
          }
          else {
            if (count == 3)
              newZMatrix[z][y][x] = '#';
            else
              newZMatrix[z][y][x] = '.';
          }
        }
      }
    }

    zMatrix = newZMatrix;

    nthMatrix.ExtendNthMatrix(3, zMatrix, '.');
    i++;
  }
  return nthMatrix.NthCountElement(3, zMatrix, '#');
}

function Transform4D(aMatrix, aCyclesCount) {
  let width = aMatrix[0].length + 2;
  let height = aMatrix.length + 2;

  let wzMatrix = nthMatrix.Generate4DMatrix(width, height, 3, 3);

  nthMatrix.Copy2Dto4D(wzMatrix, aMatrix, 1, 1, 1, 1);

  let i = 0;
  while (i < aCyclesCount) {

    let newWZMatrix = [];
    for (let w = 0; w < wzMatrix.length; w++) {
      if (newWZMatrix[w] == undefined)
        newWZMatrix[w] = [];
      for (let z = 0; z < wzMatrix[w].length; z++) {
        if (newWZMatrix[w][z] == undefined)
          newWZMatrix[w][z] = [];
        for (let y = 0; y < wzMatrix[w][z].length; y++) {
          if (newWZMatrix[w][z][y] == undefined)
            newWZMatrix[w][z][y] = [];
          for (let x = 0; x < wzMatrix[w][z][y].length; x++) {
            let count = CountNeighbours4D(wzMatrix, x, y, z, w);
            if (wzMatrix[w][z][y][x] == '#') {
              if (count == 2 || count == 3)
                newWZMatrix[w][z][y][x] = '#'
              else
                newWZMatrix[w][z][y][x] = '.';
            }
            else {
              if (count == 3)
                newWZMatrix[w][z][y][x] = '#';
              else
                newWZMatrix[w][z][y][x] = '.';
            }
          }
        }
      }
    }

    wzMatrix = newWZMatrix;

    nthMatrix.ExtendNthMatrix(4, wzMatrix, '.');
    i++;
  }
  return nthMatrix.NthCountElement(4, wzMatrix, '#');
}

function ElementTransform(aPoint, aKey, aExtendedValue, aCountMap, aNewPointMap) {

  let value = (aExtendedValue == null) ? '.' : aExtendedValue.value;

  let elemCount = aCountMap.get('#');

  if (value == '#')
  {
    if (elemCount == 2 || elemCount == 3)
      aNewPointMap.Add(aPoint, '#', aKey);
  }
  else 
  { 
    if (elemCount == 3)
      aNewPointMap.Add(aPoint, '#', aKey);
  }
}

function TransformNth(aMatrix, aDimension, aCyclesCount) {
   let pointMap = new pointmap.PointMap(aDimension, '.');
   pointMap.From2DMatrix(aMatrix);

   let i = 0;
   while (i < aCyclesCount)
   {
    pointMap = pointMap.Transform(ElementTransform);
    i++;
   }
   
   return pointMap.CountElement('#');
}

let matrix = util.MapInput('./Day17Input.txt', (aElem) => {
  return aElem.split('');
}, '\r\n');

console.log(TransformNth(matrix, 3, 6));
console.log(TransformNth(matrix, 4, 6));

//console.log(Transform3D(matrix, 6));
//console.log(Transform4D(matrix, 6));