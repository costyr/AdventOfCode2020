const util = require('./Util.js');

function PrintLine(aLine) {
  let line = "";
  for (let i = 0; i < aLine.length; i++)
    line += aLine[i];

  return line;
}

function Print(aMatix) {
  for (let i = 0; i < aMatix.length; i++)
    console.log(PrintLine(aMatix[i]));
}

function Print3DMatrix(aZMatrix) {
  for (let i = 0; i < aZMatrix.length; i++) {
    console.log("z: " + i);
    Print(aZMatrix[i]);
    console.log("\n");
  }
}

function Print4DMatrix(aWZMatrix) {
  for (let i = 0; i < aWZMatrix.length; i++) {
    console.log("w: " + i);
    Print3DMatrix(aWZMatrix[i]);
    console.log("\n");
  }
}

function GetNeighbours3D(aZMatrix, aX, aY, aZ) {
  const neighboursTransform = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const zNeighboursTransform = [-1, 0, 1];

  let neighbours = [];
  for (let j = 0; j < zNeighboursTransform.length; j++)
    for (let i = 0; i < neighboursTransform.length; i++) {
      let x = aX + neighboursTransform[i][0];
      let y = aY + neighboursTransform[i][1];
      let z = aZ + zNeighboursTransform[j];

      if ((x == aX) && (y == aY) && (aZ == z))
        continue;

      if ((z >= 0) && (z < aZMatrix.length) && (y >= 0) && (y < aZMatrix[z].length) && (x >= 0) && (x < aZMatrix[z][y].length))
        neighbours.push(aZMatrix[z][y][x]);
      else
        neighbours.push('.');
    }

  return neighbours;
}

function GetNeighbours4D(aZMatrix, aX, aY, aZ, aW) {
  const neighbours3DTransform = [[0, 0, -1], [1, 0, -1], [1, 1, -1], [0, 1, -1], [-1, 1, -1], [-1, 0, -1], [-1, -1, -1], [0, -1, -1], [1, -1, -1],
                                 [0, 0,  0], [1, 0,  0], [1, 1,  0], [0, 1,  0], [-1, 1,  0], [-1, 0,  0], [-1, -1,  0], [0, -1,  0], [1, -1,  0],
                                 [0, 0,  1], [1, 0,  1], [1, 1,  1], [0, 1,  1], [-1, 1,  1], [-1, 0,  1], [-1, -1,  1], [0, -1,  1], [1, -1,  1]];
  const wNeighboursTransform = [-1, 0, 1];

  let neighbours = [];
  for (let j = 0; j < wNeighboursTransform.length; j++)
    for (let i = 0; i < neighbours3DTransform.length; i++) {
      let x = aX + neighbours3DTransform[i][0];
      let y = aY + neighbours3DTransform[i][1];
      let z = aZ + neighbours3DTransform[i][2];
      let w = aW + wNeighboursTransform[j];

      if ((x == aX) && 
          (y == aY) && 
          (z == aZ) && 
          (w == aW))
        continue;

      if ((w >= 0) && (w < aZMatrix.length) &&
          (z >= 0) && (z < aZMatrix[w].length) &&
          (y >= 0) && (y < aZMatrix[w][z].length) &&
          (x >= 0) && (x < aZMatrix[w][z][y].length))
        neighbours.push(aZMatrix[w][z][y][x]);
      else
        neighbours.push('.');
    }

  return neighbours;
}

function GenerateMatrix(aWidth, aHeight) {
  let matrix = [];
  for (let y = 0; y < aHeight; y++) {
    if (matrix[y] == undefined)
      matrix[y] = [];
    for (let x = 0; x < aWidth; x++)
      matrix[y][x] = '.';
  }

  return matrix;
}

function Generate3DMatrix(aWidth, aHeight, aDepth) {
  let matrix = [];
  for (let i = 0; i < aDepth; i++)
    matrix[i] = GenerateMatrix(aWidth, aHeight);

  return matrix;
}

function Generate4DMatrix(aWidth, aHeight, aDepth, aTime) {
  let matrix = [];
  for (let i = 0; i < aTime; i++)
    matrix[i] = Generate3DMatrix(aWidth, aHeight, aDepth);

  return matrix;
}

function Copy2Dto4D(a4DMatrix, a2DMatrix, aX, aY, aZ, aW) {
  for (let y = 0, j = aY; y < a2DMatrix.length; y++, j++) 
    for (let x = 0, i = aX; x < a2DMatrix[y].length; x++, i++) {
      a4DMatrix[aW][aZ][j][i] = a2DMatrix[y][x];
    }
}

function ExtendMatrix(aMatrix) {

  let newRow = [];
  for (let x = 0; x < aMatrix[0].length; x++)
    newRow.push('.');

  aMatrix.unshift(newRow);

  for (let y = 0; y < aMatrix.length; y++) {
    aMatrix[y].unshift('.');
    aMatrix[y].push('.');
  }

  aMatrix.push(newRow);
}

function CountActive3D(aZMatrix) {
  let count = 0;
  for (let z = 0; z < aZMatrix.length; z++)
    for (let y = 0; y < aZMatrix[z].length; y++)
      for (let x = 0; x < aZMatrix[z][y].length; x++)
        if (aZMatrix[z][y][x] == '#')
          count++;
  return count;
}

function CountActive4D(aWZMatrix) {
  let count = 0;
  for (let w = 0; w < aWZMatrix.length; w++)
    count += CountActive3D(aWZMatrix[w]);
  return count;
}

function Extend3DMatrix(aZMatrix) {
  let width = aZMatrix[0].length;
  let height = aZMatrix[0][0].length;

  aZMatrix.unshift(GenerateMatrix(width, height));
  for (let i = 0; i < aZMatrix.length; i++)
    ExtendMatrix(aZMatrix[i]);
  aZMatrix.push(GenerateMatrix(width + 2, height + 2));
}

function Extend4DMatrix(aWZMatrix) {
  let depth = aWZMatrix[0].length;
  let width = aWZMatrix[0][0].length;
  let height = aWZMatrix[0][0][0].length;

  aWZMatrix.unshift(Generate3DMatrix(width, height, depth));
  for (let i = 0; i < aWZMatrix.length; i++)
    Extend3DMatrix(aWZMatrix[i]);
  aWZMatrix.push(Generate3DMatrix(width + 2, height + 2, depth + 2));
}

function Transform3D(aMatrix, aCyclesCount) {
  let zMatrix = [];

  let width = aMatrix[0].length + 2;
  let height = aMatrix.length + 2;

  zMatrix.push(GenerateMatrix(width, height));
  ExtendMatrix(aMatrix);
  zMatrix.push(aMatrix);
  zMatrix.push(GenerateMatrix(width, height));

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
          let neighbours = GetNeighbours3D(zMatrix, x, y, z);
          let count = neighbours.reduce((aTotal, aElem) => {
            if (aElem == '#')
              aTotal++;
            return aTotal;
          }, 0);
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

    Extend3DMatrix(zMatrix);
    i++;
  }
  return CountActive3D(zMatrix);
}

function Transform4D(aMatrix, aCyclesCount) {
  let width = aMatrix[0].length + 2;
  let height = aMatrix.length + 2;

  let wzMatrix = Generate4DMatrix(width, height, 3, 3);

  Copy2Dto4D(wzMatrix, aMatrix, 1, 1, 1, 1);

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
            let neighbours = GetNeighbours4D(wzMatrix, x, y, z, w);
            let count = neighbours.reduce((aTotal, aElem) => {
              if (aElem == '#')
                aTotal++;
              return aTotal;
            }, 0);
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

    Extend4DMatrix(wzMatrix);
    i++;
  }
  return CountActive4D(wzMatrix);
}

let matrix = util.MapInput('./Day17Input.txt', (aElem) => {
  return aElem.split('');
}, '\r\n');

console.log(Transform3D(matrix, 6));
console.log(Transform4D(matrix, 6));