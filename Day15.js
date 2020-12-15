const util = require('./Util.js');

function FindNumber(aNumberMap, aStartNumber, aStopTurn) {
  let startTurn = util.ComputeMapSize(aNumberMap) + 1;
  let i = startTurn;
  let lastNumber = aStartNumber;
  while (true) {

    i++;

    if ((aNumberMap[lastNumber] === undefined) || (i == startTurn)) {
      aNumberMap[lastNumber] = { last: i - 1, prev: i - 1 };

      lastNumber = 0;
      if (aNumberMap[lastNumber] === undefined)
        aNumberMap[lastNumber] = { last: i, prev: i };
      else {
        aNumberMap[lastNumber].prev = aNumberMap[lastNumber].last;
        aNumberMap[lastNumber].last = i;
      }
    }
    else {
      lastNumber = (aNumberMap[lastNumber].last - aNumberMap[lastNumber].prev);

      if (aNumberMap[lastNumber] !== undefined) {
        aNumberMap[lastNumber].prev = aNumberMap[lastNumber].last;
        aNumberMap[lastNumber].last = i;
      }
    }

    if (i == aStopTurn)
      return lastNumber;
  }
}

function ParseInput(aStartNumbers, aNumberMap) {
  let numbers = aStartNumbers.split(",");
  for (let i = 0; i < numbers.length - 1; i++)
    aNumberMap[numbers[i]] = { last: i + 1, prev: i + 1 };
  return numbers[numbers.length - 1];
}

const kStartNumbers = "20,9,11,0,1,2";

let numberMap = [];
let startNumber = ParseInput(kStartNumbers, numberMap);
console.log(FindNumber(numberMap, startNumber, 2020));

numberMap = [];
ParseInput(kStartNumbers, numberMap);
console.log("For part 2 it will take ~30 minutes to compute solution...");
console.log(FindNumber(numberMap, startNumber, 30000000));