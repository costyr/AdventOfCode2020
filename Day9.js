const util = require('./Util.js');

function FindError(aOutput, aPreamble) {
  for (let i = aPreamble; i < aOutput.length; i++) {
    let found = false;
    for (let j = (i - aPreamble); j < i; j++) {
      for (let k = j + 1; k < i; k++) {
        if (((aOutput[j] + aOutput[k]) == aOutput[i])) {
          found = true;
          break;
        }
      }
      if (found)
        break;
    }
    if (!found)
      return aOutput[i];
  }
  return 0;
}

function FindWeekness(aOutput, aErrorNumber) {

  let sumMap = [];
  aOutput.reduce((aTotal, aElem, aIndex) => {
    aTotal[aIndex] = (aIndex == 0) ? aElem :
      aTotal[aIndex - 1] + aElem;
    return aTotal;
  }, sumMap);

  for (let i = 0; i < sumMap.length; i++)
    for (let j = i + 1; j < sumMap.length; j++)
      if ((sumMap[j] - sumMap[i]) == aErrorNumber) {
        let gg = aOutput.slice(i + 1, j + 1).sort((a, b) => { return a - b; });
        return gg[0] + gg[gg.length - 1];
      }

  return 0;
}

let preamble = 25;
let output = util.MapInput('./Day9Input.txt', (aElem) => {
  return parseInt(aElem);
}, '\r\n');

let errorNumber = FindError(output, preamble);

console.log(errorNumber);
console.log(FindWeekness(output, errorNumber));