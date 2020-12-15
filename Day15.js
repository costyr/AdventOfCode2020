const util = require('./Util.js');

function FindNumber(aNumberMap, aStopTurn) {
  let startTurn = aNumberMap.size + 1;
  let i = startTurn;
  let lastNumber = 0;

  let last = aNumberMap.get(lastNumber);
  if (last == undefined)
    aNumberMap.set(lastNumber, [i - 1, i - 1]);
  else {
    last[0] = last[1];
    last[1] = i;
  }

  while (i < aStopTurn) {
    i++;
    last = aNumberMap.get(lastNumber);
    if (last == undefined) {
      aNumberMap.set(lastNumber, [i - 1, i - 1]);
      lastNumber = 0;
    }
    else
      lastNumber = last[1] - last[0];

    last = aNumberMap.get(lastNumber);
    if (last != undefined) {
      last[0] = last[1];
      last[1] = i;
    }
  }

  return lastNumber;
}

function ParseInput(aStartNumbers, aNumberMap) {
  aStartNumbers.split(",").reduce((aTotal, aElem, aIndex) => {
    aTotal.set(parseInt(aElem, 10), [aIndex + 1, aIndex + 1]);
    return aTotal;
  }, aNumberMap);
}

const kStartNumbers = "20,9,11,0,1,2";

let numberMap = new Map();
ParseInput(kStartNumbers, numberMap);
console.log(FindNumber(numberMap, 2020));

numberMap.clear();
ParseInput(kStartNumbers, numberMap);
console.log(FindNumber(numberMap, 30000000));