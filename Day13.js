const util = require('./Util.js');

function FindBus(aBusSchedule) {

  let min = Number.MAX_SAFE_INTEGER;
  let bestBusId = 0;
  let minutesToWait = 0;
  for (let i = 0; i < aBusSchedule.buses.length; i++) {
    if (aBusSchedule.buses[i] == -1)
      continue;

    let busId = aBusSchedule.buses[i];
    let start = aBusSchedule.timeStamp;
    while ((start % busId) != 0)
      start++;

    let timeSpan = start - aBusSchedule.timeStamp;
    if (timeSpan < min) {
      min = timeSpan;
      minutesToWait = timeSpan;
      bestBusId = busId;
    }
  }

  return bestBusId * minutesToWait;
}

function FindSeq(aBusSchedule) {
  let i = 0;
  let prev = 0;

  let busPos = [];
  let step = 1;
  for (let j = 0; j < aBusSchedule.buses.length; j++)
    if (aBusSchedule.buses[j] != -1)
      busPos.push(j);

  let timeSynch = [];
  let lastPos = 1;
  while (true) {
    let found = true;
    for (let j = 0; j < busPos[lastPos] + 1; j++) {
      let busID = aBusSchedule.buses[j];

      if (busID == -1)
        continue;

      let remainder = (i + j) % busID;
      if (remainder != 0) {
        found = false;
        break;
      }
    }

    if (found) {
      timeSynch.push([i - prev, i]);
      prev = i;

      if ((timeSynch.length == 3) && (timeSynch[2][0] == timeSynch[1][0])) {
        step = timeSynch[1][0];
        lastPos++;

        if (lastPos == busPos.length)
          return timeSynch[0][1];

        timeSynch = [];
      }
    }

    i += step;
  }
}

let busSchedule = { timeStamp: 0, buses: [] };
util.ReduceInput('./Day13Input.txt', (aTotal, aElem, aIndex) => {
  if (aIndex == 0)
    aTotal.timeStamp = parseInt(aElem);
  else {
    aTotal.buses = aElem.split(',').map((aElem) => {
      if (aElem == 'x')
        return -1;
      else
        return parseInt(aElem);
    });
  }
  return aTotal;
}, busSchedule, '\r\n');

console.log(FindBus(busSchedule));
console.log(FindSeq(busSchedule));
