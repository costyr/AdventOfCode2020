const util = require('./Util.js');

function ConsumeJolts(aAdapters) {
  let start = 0;
  let usedAdapters = [];
  let count1 = 0;
  let count3 = 0;
  let stack = [];
  let combsCount = 1;
  while (true) {
    let stepAdapters = [];
    for (let i = 0; i < aAdapters.length; i++)
      if ((usedAdapters[aAdapters[i]] == undefined) && (aAdapters[i] - start <= 3)) {
        stepAdapters.push(aAdapters[i]);
        if (stepAdapters.length == 3)
          break;
      }

    if (stepAdapters.length == 0) {
      count3++;
      return { multiplier: count1 * count3, combs: combsCount };
    }

    stepAdapters.sort((a, b) => { return a - b; });

    if (stepAdapters.length > 1)
      stack.push(stepAdapters.length);
    else {
      let checkSum = 0;
      while (stack.length > 0)
        checkSum += stack.pop();

      let chunkCombs = 1;
      if (checkSum == 2)
        chunkCombs = 2;
      else if (checkSum == 5)
        chunkCombs = 4;
      else if (checkSum == 8)
        chunkCombs = 7;

      combsCount *= chunkCombs;
    }

    usedAdapters[stepAdapters[0]] = 1;

    if (stepAdapters[0] - start == 1) {
      count1++;
      start += 1;
    }
    else if (stepAdapters[0] - start == 3) {
      count3++;
      start += 3;
    }
  }

  return 0;
}

let adapters = util.MapInput('./Day10Input.txt', (aElem) => {
  return parseInt(aElem);
}, '\r\n');

let joltage = ConsumeJolts(adapters);
console.log(joltage.multiplier);
console.log(joltage.combs);