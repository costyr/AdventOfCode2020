const util = require('./Util.js');

function ConsumeJolts(aOutput) 
{
  let start = 0;
  let map = [];
  let count1 = 0;
  let count3 = 0;
  let stack = [];
  let combsCount = 1;
  while (true)
  {
    let stepOptions = [];
    for (let i = 0; i < aOutput.length; i++)
      if ((map[aOutput[i]] == undefined) && (aOutput[i] - start <= 3))
      stepOptions.push(aOutput[i]);
    
    if (stepOptions.length == 0) {
      count3++;
      return { multiplier: count1 * count3, combs: combsCount };
    }

    stepOptions.sort((a, b)=>{ return a - b; });

    if (stepOptions.length > 1)
      stack.push(stepOptions.length);
    else 
    {
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
    
    map[stepOptions[0]] = 1;

    if (stepOptions[0] - start == 1) {
      count1 ++;
      start += 1;
    }
    else if (stepOptions[0] - start == 3) {
      count3 ++;
     start += 3;
    }
  }

  return 0;
}

let outputJoltage = util.MapInput('./Day10Input.txt', (aElem) => {
  return parseInt(aElem);
}, '\r\n');

let joltage = ConsumeJolts(outputJoltage);
console.log(joltage.multiplier);
console.log(joltage.combs);