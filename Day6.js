const util = require('./Util.js');

function ComputeYes(aTotal, aElem) {
  
  let lines = aElem.split('\r\n');

  lines.reduce((aTotal, aElem) => {
    for (let j = 0; j < aElem.length; j++) {
      aElem.split('').reduce((aTotal, aElem) => {
        if (aTotal.map[aElem] === undefined) {
          aTotal.count++;
          aTotal.map[aElem] = 1;
        }
        return aTotal;
      }, aTotal);

    }
    return aTotal;
  }, aTotal);

  aTotal.count2 += util.IntersectArrays(...lines).length;

  aTotal.map = [];
  return aTotal;
}

let total = { map: [], count: 0, count2: 0 };
util.ReduceInput('./Day6Input.txt', ComputeYes, total, '\r\n\r\n');

console.log(total.count);
console.log(total.count2);