const util = require('./Util.js');

function FindError(aOutput, aPreamble) {
  for (let i = aPreamble; i < aOutput.length;i++)
  {
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
  for (let i = 0; i < aOutput.length; i++) {
    let total = 0;
    let min = Number.MAX_SAFE_INTEGER;
    let max = 0;
    for (let j = i; j < aOutput.length; j++) {
      total += aOutput[j];
      
      if (aOutput[j] > max)
        max = aOutput[j];
      if (aOutput[j] < min)
        min = aOutput[j];

      if (total == aErrorNumber)
        return min + max;
    }
  }
  return 0;
}

let output = [];
util.ReduceInput('./Day9Input.txt', (aTotal, aElem) => {
  aTotal.push(parseInt(aElem));
  return aTotal;
}, output, '\r\n');


let errorNumber = FindError(output, 25);
console.log(errorNumber);
console.log(FindWeekness(output, errorNumber));