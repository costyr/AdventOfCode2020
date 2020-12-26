const list = require('./LinkedList.js');

function GetMax(aCircle, aPicket) {
  let max = 0;
  for (let i = 0; i < aCircle.length; i++)
    if ((aCircle[i] > max) && (aPicket.indexOf(aCircle[i]) == -1))
      max = aCircle[i];
  return max;
}

function GetMin(aCircle) {
  let min = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < aCircle.length; i++)
    if (aCircle[i] < min)
      min = aCircle[i];
  return min;
}

function GetMax2(aCircle, aExtraMax, aPicked) {

  if (aExtraMax <= 0)
  {
    let max = 0;
    for (let i = 0; i < aCircle.length; i++)
      if ((aCircle[i] > max) && !aPicked.find((aElem)=>{ return (aElem.mValue == aCircle[i]); }))
        max = aCircle[i];
    return max;
  }

  let max = aExtraMax;
  while (aPicked.find((aElem)=>{ return (aElem.mValue == max); }))
    max--;
  return max;
}

function ComputeDestination(aCircle, aMin, aExtraMax, aCurrent, aPicked) {
  let dest = aCurrent - 1;

  if (dest < aMin) {
    dest =  GetMax2(aCircle, aExtraMax, aPicked);
    return dest;
  }
  while (aPicked.find((aElem)=>{ return (aElem.mValue == dest); })) {
    dest -= 1;
    if (dest < aMin) {
      dest = GetMax2(aCircle, aExtraMax, aPicked);
      break;
    }
  }
    
  return dest;
}

function ComputePicked(aFirst, aCurrent) {
  let picked = [];
  let i = 0;
  let node = aCurrent;
  while (i < 3) {
    node = node.mNext;
    
    if (node == null)
      node = aFirst;

    picked.push(node);
    i++;
  }
  return picked;
}

function RemovePicked(aCircle, aCurrent) {
  let node = aCurrent;
  let i = 0; 
  let removeList = [];
  while (i < 3) {

    node = node.mNext;
    if (node == null)
      node = aCircle.GetHead();

    removeList.push(node);
    i++;
  }

  for (let i = 0; i < removeList.length; i++)
    aCircle.RemoveNode(removeList[i]);
}

function InsertPicked(aCircle, aDest, aPicked, aCache) {
  let node = aCache.get(aDest);

  for (let i = 0; i < aPicked.length; i++)
    node = aCircle.AddNodeAfter(node, aPicked[i]);
}

function PlayCrabGame(aInput, aNumberOfMoves, aMaxExtra) {

  let initCircle =  aInput.toString().split('').map((aElem)=>{ 
    return parseInt(aElem, 10);
  });

  let min = GetMin(initCircle);

  let circle = new list.LinkedList();

  initCircle.reduce((aTotal, aElem)=>{ 
    aTotal.AddTail(aElem);
    return aTotal;
  }, circle);

  let initMax = GetMax(initCircle, []) + 1;
  let additionalCupsCount = aMaxExtra - initCircle.length;
  if (additionalCupsCount > 0)
  {
    let extraCup = initMax;
    for (let i = 0; i < additionalCupsCount; i++)
      circle.AddTail(extraCup++);
  }

  let cache = new Map();

  let node = circle.GetHead();
  while (node != null)
  {
    cache.set(node.mValue, node);
    node = node.mNext;
  }

  let current = circle.GetHead();
  let i = 0;
  while (i < aNumberOfMoves)
  {
    let picked = ComputePicked(circle.GetHead(), current);
    let dest = ComputeDestination(initCircle, min, aMaxExtra, current.mValue, picked);

    RemovePicked(circle, current);
    InsertPicked(circle, dest, picked, cache);

    current = current.mNext;
    if (current == null)
      current = circle.GetHead();

    i++;
  }

  node = cache.get(1);

  let finalOrder = [];

  i = 0;
  while (i < (initCircle.length - 1))
  {
    node = node.mNext;
    if (node == null)
      node = circle.GetHead();
    finalOrder.push(node.mValue);
    i++;
  }

  if (aMaxExtra > 0)
    return finalOrder[0] * finalOrder[1];
  else
  {
    let result = finalOrder.reduce((aTotal, aElem)=>{ 
      aTotal += aElem.toString(); 
      return aTotal; 
    }, "");
     
    return result;
  }
}

const kTestInput = 389125467;
const kTestInput2 = 54321;
const kInput = 685974213;

console.log(PlayCrabGame(kInput, 100, 0));

const kMaxExtra = 1000000;

console.log("Part 2 will take some seconds...");
console.log(PlayCrabGame(kInput, kMaxExtra * 10, kMaxExtra));
