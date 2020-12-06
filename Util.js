const fs = require('fs');

function ComputeMapFilePath(aFilePath) {
  let index = aFilePath.lastIndexOf('.');
  let mapFilePath = aFilePath.substr(0, index);
  mapFilePath += "Map.txt";

  return mapFilePath;
}

function CopyObject(aObject) {
  return JSON.parse(JSON.stringify(aObject));
}

function ParseCoordElem(aMax, aElem) {
  let coords = aElem.split(', ');

  let x = parseInt(coords[0]);
  let y = parseInt(coords[1]);

  if (x > aMax.x)
    aMax.x = x;

  if (y > aMax.y)
    aMax.y = y;

  return { "x": x, "y": y };
}

function ParseInt(aElem) {
  return parseInt(aElem);
}

function SplitInput(aFilePath, aSep) {
  let rawInput = fs.readFileSync(aFilePath);

  return rawInput.toString().split(aSep);
}

function ReduceInput(aFilePath, aElemFunc, aTotal, aSep) {
  let inputArray = SplitInput(aFilePath, aSep);

  return inputArray.reduce(aElemFunc, aTotal);
}

function MapInput(aFilePath, aElemFunc, aSep) {
  let inputArray = SplitInput(aFilePath, aSep);

  return inputArray.map(aElemFunc);
}

function ComputeMax(aMax, aValue) {
  if (aValue > aMax)
    return aValue;
  return aMax;
}

function ComputeMapSize(aMap) {
  let size = 0;
  for (let key in aMap)
    size++;

  return size;
}

function IntersectMaps() {
  let intersection = [];
  if (arguments.length == 1) {
    for (let key in arguments[0])
      if (intersection.indexOf(key) == -1)
        intersection.push(key);

    return intersection;
  }

  for (let key in arguments[0]) {
    let found = true;
    for (let j = 1; j < arguments.length; j++)
      if (arguments[j][key] === undefined) {
        found = false;
        break;
      }
    if (found)
      intersection.push(key);
  }
  return intersection;
}

function IntersectArrays() {
  if (arguments.length == 1) {
    return CopyObject(arguments[0]);
  }

  let intersection = [];
  arguments[0].split('').reduce((aIntersection, aElem) => {
    let found = true;
    for (let j = 1; j < arguments.length; j++)
      if (arguments[j].indexOf(aElem) == -1) {
        found = false;
        break;
      }
    if (found)
      aIntersection.push(aElem);

    return aIntersection;
  }, intersection);
  return intersection;
}

module.exports = {
  ComputeMapFilePath,
  CopyObject,
  ParseCoordElem,
  ParseInt,
  SplitInput,
  ReduceInput,
  MapInput,
  ComputeMax,
  ComputeMapSize,
  IntersectMaps,
  IntersectArrays
}
