const util = require('./Util.js');

function RunProgram(aInst) {

  let i = 0;
  let acc = 0;
  let instMap = [];
  while (i < aInst.length) {
    if (instMap[i] !== undefined)
      return { acc: acc, exitCode: -1 };
    else
      instMap[i] = 1;

    if (aInst[i].inst == "acc") {
      acc += aInst[i].param;
      i++;
    }
    else if (aInst[i].inst == "jmp")
      i += aInst[i].param;
    else if (aInst[i].inst == "nop")
      i++;
  }

  return { acc: acc, exitCode: 0 };
}

function RepairProgram(aInst) {
  for (let i = 0; i < aInst.length; i++) {
    if (aInst[i].inst == "jmp") {
      aInst[i].inst = "nop";

      let ret = RunProgram(aInst);

      if (ret.exitCode != -1)
        return ret.acc;
      else
        aInst[i].inst = "jmp";
    }
    else if (aInst[i].inst == "nop") {
      aInst[i].inst = "jmp";

      let ret = RunProgram(aInst);
      if (ret.exitCode != -1)
        return ret.acc;
      else
        aInst[i].inst = "nop";
    }
  }

  return 0;
}

let instructions = [];
util.ReduceInput('./Day8Input.txt', (aTotal, aElem) => {
  let rawInst = aElem.split(' ');

  aTotal.push({ inst: rawInst[0], param: parseInt(rawInst[1]) });

  return aTotal;
}, instructions, '\r\n');

console.log(RunProgram(instructions).acc);
console.log(RepairProgram(instructions));