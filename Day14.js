const util = require('./Util.js');
var bigInt = require("big-integer");

function RunProgram(aMemProgram) {
  
  let mask = bigInt(0);
  let value = bigInt(0);
  let memory = [];
  for (let i = 0; i < aMemProgram.length; i++)
  {
    if (aMemProgram[i].addr == -1)
    {
      mask = bigInt(aMemProgram[i].mask);
      value = bigInt(aMemProgram[i].value);
    }
    else
    {
      let addr = aMemProgram[i].addr; 
      memory[addr] = value.or(bigInt(memProgram[i].value).and(mask.not()));
    }
  }

  let memSum = bigInt(0);
  for (let addr in memory)
    memSum = memSum.add(memory[addr]);

  return memSum;
}

function GenerateMask(aAllMasks, aPosArray, aMask, aPos) 
{
  if (aPos == aPosArray.length)
  {
    aAllMasks.push(bigInt(aMask.join(''), 2));
    return;
  }

  let newMask1 = util.CopyObject(aMask);
  newMask1[aPosArray[aPos]] = '0';
  GenerateMask(aAllMasks, aPosArray, newMask1, aPos + 1);

  let newMask2 = util.CopyObject(aMask);
  newMask2[aPosArray[aPos]] = '1';
  GenerateMask(aAllMasks, aPosArray, newMask2, aPos + 1);
}

function ComputeMasks(aMask) {
  let mask = aMask.toString(2).split('');
  let posArray = [];
  for (let i = 0; i < mask.length; i++)
    if (mask[i] == '1')
      posArray.push(i);
  
  let allMasks = [];
  GenerateMask(allMasks, posArray, mask, 0);

  return allMasks;
}

function RunProgram2(aMemProgram) {
  
  let mask = bigInt(0);
  let mask3 = bigInt(0);
  let value = bigInt(0);
  let memory = [];
  for (let i = 0; i < aMemProgram.length; i++)
  {
    if (aMemProgram[i].addr == -1)
    {
      mask = bigInt(aMemProgram[i].mask);
      mask3 = bigInt(aMemProgram[i].mask3);
      value = bigInt(aMemProgram[i].value);
    }
    else
    { 
      let baseAddr = value.or(bigInt(memProgram[i].addr).and(mask3.not()));
      let allMasks = ComputeMasks(mask3);
      for (let j = 0; j < allMasks.length; j++) {
        let addr = baseAddr.add(allMasks[j]);
        memory[addr] = memProgram[i].value;
      }
    }
  }

  let memSum = bigInt(0);
  for (let addr in memory) 
    memSum = memSum.add(memory[addr]);

  return memSum;
}

let memProgram = util.MapInput('./Day14Input.txt', (aElem) => {
  let rawInst = aElem.split(" = ");
  let inst = { mask: -1, mask2: -1, mask3: -1, addr: -1, value: 0 };
  if (rawInst[0] == "mask") {
    inst.mask = bigInt(rawInst[1].replace(/0/g, "1").replace(/X/g, "1"), 2);
    inst.mask3 = bigInt(rawInst[1].replace(/1/g, "0").replace(/X/g, "1"), 2);
    inst.value = bigInt(rawInst[1].replace(/X/g, "0"), 2);
  }
  else 
  {
    inst.addr = parseInt(rawInst[0].substr(4, rawInst[0].length -1));
    inst.value = parseInt(rawInst[1]); 
  }
  return inst;
}, '\r\n');

console.log(RunProgram(memProgram).toString());
console.log(RunProgram2(memProgram).toString());