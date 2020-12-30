const util = require('./Util.js');
const matrix = require('./Matrix.js');

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

function PrintImages(aImages) {
  for (let i = 0; i < aImages.length; i++) {
    console.log(aImages[i].id);
    Print(aImages[i].img);
    console.log("\r\n");
  }
}

function PrintIds(aMatrix) {
  for (let i = 0; i < aMatrix.mMatix.length; i++) {
    let line = "";
    for (let j = 0; j < aMatrix.mMatix.length; j++) {
      if (line.length > 0)
        line += ",";
      line += aMatrix.mMatix[i][j].id.toString();
    }
    console.log(line);
  }
}

function ExtractChecksum(aImg, aX, aY, aStartX, aStartY) {
  let str = "";
  for (let j = aStartY; j < aImg.length; j++) {
    for (let i = aStartX; i < aImg[j].length; i++) {
      str += aImg[aY * j][aX * i];
      if (aX == 0)
        break;
    }
    if (aY == 0)
      break;
  }
  //console.log(str);
  let gg = str.replace(/\./g, "0").replace(/\#/g, "1");
  //console.log(gg);
  return parseInt(gg, 2);
}

function ExtractBorder(aImg) {
  let sums = [];
  sums.push(ExtractChecksum(aImg, 1, 0, 0, 0));
  sums.push(ExtractChecksum(aImg, 1, 1, aImg[0].length - 1, 0));
  sums.push(ExtractChecksum(aImg, 1, 1, 0, aImg.length - 1));
  sums.push(ExtractChecksum(aImg, 0, 1, 0, 0));
  return sums;
}

function ExtractChecksums(aImages) {
  let checksums = new Map();
  for (let i = 0; i < aImages.length; i++) {
    let img = aImages[i].img;
    let sums = ExtractBorder(img);

    checksums.set(aImages[i].id, sums);
  }

  return checksums;
}

function Flip(aImgChecksum, aUp) {
  let newImgChecksum = [];
  for (let i = 0; i < aImgChecksum.length; i++)
    newImgChecksum[i] = aImgChecksum[i];

  if (aUp) {
    newImgChecksum[0] = aImgChecksum[2];
    newImgChecksum[2] = aImgChecksum[0];
    newImgChecksum[1] = ReverseNumber(newImgChecksum[1]);
    newImgChecksum[3] = ReverseNumber(newImgChecksum[3]);
  }
  else {
    newImgChecksum[3] = aImgChecksum[1];
    newImgChecksum[1] = aImgChecksum[3];
    newImgChecksum[0] = ReverseNumber(newImgChecksum[0]);
    newImgChecksum[2] = ReverseNumber(newImgChecksum[2]);
  }

  return newImgChecksum;
}

function ReverseNumber(aNumber) {
  let pp = aNumber.toString(2).split('').reverse().join('');
  while (pp.length < 10)
    pp += '0';
  return parseInt(pp, 2);
}

function Rotate(aImgChecksum) {
  let newImgChecksum = [];
  for (let i = 0; i < aImgChecksum.length; i++) {
    let j = (i + 1) % 4;
    newImgChecksum[j] = aImgChecksum[i];
    if ((j == 0) || (j == 2))
      newImgChecksum[j] = ReverseNumber(newImgChecksum[j]);
  }

  return newImgChecksum;
}

function GenerateTransforms(aImgChecksum) {
  let newCheckSums = [];
  newCheckSums.push(aImgChecksum);
  newCheckSums.push(Flip(aImgChecksum, true));

  let newCheckSums2 = [];
  for (let i = 0; i < newCheckSums.length; i++)
    newCheckSums2.push(Flip(newCheckSums[i], false));

  newCheckSums2 = newCheckSums.concat(newCheckSums2);

  let newCheckSums3 = [];
  for (let i = 0; i < newCheckSums2.length; i++) {
    let checkSum = newCheckSums2[i];
    for (let j = 0; j < 3; j++) {
      checkSum = Rotate(checkSum);
      newCheckSums3.push(checkSum);
    }
  }

  return newCheckSums2.concat(newCheckSums3);
}

function GenerateAllTransforms(aImages) {
  let firstCheckSums = ExtractChecksums(aImages);

  let transforms = new Map();
  for (let [key, value] of firstCheckSums) {
    transforms.set(key, GenerateTransforms(value));
  }

  return transforms;
}

function FindCorners(aTransforms, aMid, aBorders, aCorners) {
  let checkSum = 1;
  for (let [key, value] of aTransforms) {
    let count = 0;
    for (let j = 0; j < 4; j++) {
      let found = true;
      for (let [key2, value2] of aTransforms) {

        if (key == key2)
          continue;

        for (let k = 0; k < value2.length; k++)
          for (let l = 0; l < 4; l++) {
            if (value[0][j] == value2[k][l]) {
              found = false;
              break;
            }

          }
      }
      if (found) {
        count++;
      }
    }
    if (count > 0) {
      aBorders.add(key);
      if (count > 1) {
        aCorners.add(key);
        checkSum *= key;
      }
    }
    else
      aMid.add(key);
  }

  return checkSum;
}

function GetMargins(aTransform, aMargins) {

  for (let i = 0; i < aTransform.length; i++) {
    let found = true;
    for (let j = 0; j < 4; j++)
      if ((aMargins[j] != -1) && (aMargins[j] != aTransform[i][j])) {
        found = false;
        break;
      }
    if (found)
      return { t: i, m: aTransform[i] };
  }
  return undefined;
}

function FindPieces(aTransforms, aFilter, aMatrix, aX, aY) {
  
  const kNeighbours = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const width = aMatrix.mMatix.length;

  let margins = [-1, -1, -1, -1];
  for (let i = 0; i < kNeighbours.length; i++) {
    let x = aX + kNeighbours[i][0];
    let y = aY + kNeighbours[i][1];

    if ((x >= 0) && (x < width) && (y >= 0) && (y < width)) {
      let mm = aMatrix.GetValue(y, x);
      margins[i] = mm.m[(i + 2) % 4];
    }
  }
  
  let pieces = [];
  for (let id of aFilter.keys()) {
    let values = aTransforms.get(id);

    let ret = GetMargins(values, margins);
    if (ret !== undefined)
      pieces.push({ id: id, t: ret.t, m: ret.m });
  }

  return pieces;
}

function AssembleBorderElement(aCorner, aTrans, aImagesMap, aTransfromMap, aTransforms, aMid, aBorders, aMatrix, aX, aY) {

  let width = aMatrix.mMatix.length;
  if (aY >= width) {
    //console.log(aCorner + " " + aTrans);
    //PrintBigPicture(aMatrix);
    //console.log("\n");
    SearchBigPicture(aMatrix, aImagesMap, aTransfromMap);
    return;
  }

  let x = aX;
  let y = aY;
  x++;

  let isMid = false;
  if ((aX > 0) && (aX < width - 1) && (aY > 0) && (aY < width - 1)) {
    isMid = true;
  }

  if (x >= width) {
    x = 0;
    y++;
  }

  let pieces = FindPieces(aTransforms, isMid ? aMid : aBorders, aMatrix, aX, aY);

  /*if (pieces.length == 0) {
    console.log("Piece not found on position: " + aX + " " + aY + " " + aCorner + " " + aTrans);
    PrintIds(aMatrix);
    console.log("\n");
  }*/

  for (let i = 0; i < pieces.length; i++) {

    let newMatrix = aMatrix.Copy();

    //console.log(aY + " " + aX);
    newMatrix.SetValue(aY, aX, { id: pieces[i].id, t: pieces[i].t, m: pieces[i].m });

    let newMid = new Set(aMid);
    newMid.delete(pieces[i].id);

    let newBorders = new Set(aBorders);
    newBorders.delete(pieces[i].id);
    AssembleBorderElement(aCorner, aTrans, aImagesMap, aTransfromMap, aTransforms, newMid, newBorders, newMatrix, x, y);
  }
}

function AssembleBorder(aImagesMap, aTransfromMap, aTransforms, aMid, aBorders, aCorners) {
  let width = Math.sqrt(aTransforms.size);

  for (let corner of aCorners.keys()) {
    let transform = aTransforms.get(corner);
    for (let i = 0; i < transform.length; i++) {
      let bigPicture = new matrix.Matrix(width, width, { id: 0, t: -1, m: [-1, -1, -1, -1] });
      bigPicture.SetValue(0, 0, { id: corner, t: i, m: transform[i] });
      let newBorders = new Set(aBorders);
      newBorders.delete(corner);
      AssembleBorderElement(corner, i, aImagesMap, aTransfromMap, aTransforms, aMid, newBorders, bigPicture, 1, 0);
    }
  }
}

function PrintTransform(aImg, aTransform, aX, aY) {
  for (let j = 0; j < 4; j++) {

    if (aTransform[j] == -1)
      continue;

    let border = aTransform[j].toString(2).replace(/0/g, ".").replace(/1/g, "#");

    while (border.length < 10)
      border = "." + border;

    if (j == 0) {
      for (let k = 0; k < border.length; k++)
        aImg.SetValue(aY, aX + k, border[k]);
    }
    else if (j == 1)
      for (let k = 0; k < border.length; k++)
        aImg.SetValue(aY + k, aX + 9, border[k]);
    else if (j == 2)
      for (let k = 0; k < border.length; k++)
        aImg.SetValue(aY + 9, aX + k, border[k]);
    else
      for (let k = 0; k < border.length; k++)
        aImg.SetValue(aY + k, aX, border[k]);
  }
}

function PrintTransforms(aTransforms) {
  for (let i = 0; i < aTransforms.length; i++) {
    let img = new matrix.Matrix(10, 10, " ");

    PrintTransform(img, aTransforms[i], 0, 0);

    console.log(i + ":\n");
    img.Print();
    console.log("\n");
  }
}

function PrintBigPicture(aMatrix) {

  let width = aMatrix.mMatix.length * 10;
  let bigPicture = new matrix.Matrix(width, width, " ");

  for (let i = 0; i < aMatrix.mMatix.length; i++)
    for (let j = 0; j < aMatrix.mMatix.length; j++)
      PrintTransform(bigPicture, aMatrix.mMatix[i][j].m, j * 10, i * 10);
  bigPicture.Print();
}

function GenerateImagesMap(aImages) {
  let imageMap = new Map();
  for (let i = 0; i < aImages.length; i++)
    imageMap.set(aImages[i].id, aImages[i].img);
  return imageMap;
}

function TransformImage(aImage, aTransfromMap, aTransIndex) {
  let image = matrix.CreateMatrix(aImage);

  let transforms = aTransfromMap.get(aTransIndex);
  
  return image.ApplyTransforms(transforms);
}

function CountHash(aImage) {
  let count = 0;
  for (let i = 0; i < aImage.length; i++)
    for (let j = 0; j < aImage[i].length; j++)
      if (aImage[i][j] == '#')
        count ++;

  return count;
}

function SearchBigPicture(aBigPicture, aImagesMap, aTransfromMap) {
  let width = aBigPicture.mMatix.length;
  let pieceWidth = 8;
  let bigImage = new matrix.Matrix(width * pieceWidth, width * pieceWidth, " ");
  
  for (let i = 0; i < width; i++)
    for (let j = 0; j < width; j++) {

      let cell = aBigPicture.GetValue(i,j);

      let initialImage = aImagesMap.get(cell.id);

      let imagePiece = TransformImage(initialImage, aTransfromMap, cell.t);

      //imagePiece.Print();
      //console.log("\n");

      bigImage.AddPattern(imagePiece.GetMatrix(), j * pieceWidth, i * pieceWidth, 1, 1, pieceWidth, pieceWidth);
    }

  //bigImage.Print();

  let searchPattern = [[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','#',' '],
                       ['#',' ',' ',' ',' ','#','#',' ',' ',' ',' ','#','#',' ',' ',' ',' ','#','#','#'],
                       [' ','#',' ',' ','#',' ',' ','#',' ',' ','#',' ',' ','#',' ',' ','#',' ',' ',' ']];

  let count = bigImage.FindPattern(searchPattern);

  if (count > 0)
    console.log(CountHash(bigImage.mMatix) - count * CountHash(searchPattern));
}

function GenerateTransformMap() {
  let kvArray = [[0, []], 
                 [1, [matrix.kFlipUp]],
                 [2, [matrix.kFlipLeft]],
                 [3, [matrix.kFlipUp, matrix.kFlipLeft]],
                 [4, [matrix.kRotate]],
                 [5, [matrix.kRotate, matrix.kRotate]],
                 [6, [matrix.kRotate, matrix.kRotate, matrix.kRotate]],
                 [7, [matrix.kFlipUp, matrix.kRotate]],
                 [8, [matrix.kFlipUp, matrix.kRotate, matrix.kRotate]],
                 [9, [matrix.kFlipUp, matrix.kRotate, matrix.kRotate, matrix.kRotate]],
                 [10, [matrix.kFlipLeft, matrix.kRotate]],
                 [11, [matrix.kFlipLeft, matrix.kRotate, matrix.kRotate]],
                 [12, [matrix.kFlipLeft, matrix.kRotate, matrix.kRotate, matrix.kRotate]],
                 [13, [matrix.kFlipUp, matrix.kFlipLeft, matrix.kRotate]],
                 [14, [matrix.kFlipUp, matrix.kFlipLeft, matrix.kRotate, matrix.kRotate]],
                 [15, [matrix.kFlipUp, matrix.kFlipLeft, matrix.kRotate, matrix.kRotate, matrix.kRotate]]];

  let transfromMap = new Map(kvArray);
  
  return transfromMap;
}

let images = util.MapInput('./Day20Input.txt', (aElem) => {
  let rawElem = aElem.split(':\r\n');

  let id = parseInt(rawElem[0].split(" ")[1], 10);

  let img = rawElem[1].split("\r\n").map((aElem) => {
    return aElem.split('');
  });

  return { id: id, img: img };
}, '\r\n\r\n');

let imagesMap = GenerateImagesMap(images);

let transfromMap = GenerateTransformMap();

//PrintImages(images);
//let ff = ExtractBorder(images[2].img);
//console.log(ff);
//console.log(GenerateTransforms(ff));
//console.log(FindCorners(images));
let corners = new Set();
let borders = new Set();
let mid = new Set();

let transforms = GenerateAllTransforms(images)
console.log(FindCorners(transforms, mid, borders, corners));
//console.log(corners);
//console.log(borders);
//console.log(mid);

AssembleBorder(imagesMap, transfromMap, transforms, mid, borders, corners);
/*let img = new matrix.Matrix(10, 10, " ");
PrintTransform(img, transforms.get(2473)[0], 0, 0);
img.Print();

let flipUpImg = img.Flip(true);
flipUpImg.Print();
let rotated = img.Rotate();
rotated.Print();*/