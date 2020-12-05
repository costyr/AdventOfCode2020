const util = require('./Util.js');

function ScanTicket(aTotal, aElem) {
  let line = aElem.split('');

  let min = 0;
  let max = 127;
  for (let i = 0; i < 7; i++) {
    if (line[i] == 'F') {
      if (max - min > 1)
        max = Math.floor((min + max) / 2);
      else {
        rowId = min;
        break;
      }
    }
    else if (line[i] == 'B') {
      if (max - min > 1)
        min = Math.ceil((min + max) / 2);
      else {
        rowId = max;
        break;
      }
    }
  }

  min = 0;
  max = 7;
  for (let i = 7; i < line.length; i++) {
    if (line[i] == 'L') {
      if (max - min > 1) 
        max = Math.floor((min + max) / 2);
      else {
        comlumnId = min;
        break;
      }
    }
    else if (line[i] == 'R') {
      if (max - min > 1) 
        min = Math.ceil((min + max) / 2);
      else {
        comlumnId = max;
        break;
      }
    }
  }

  let seatId = rowId * 8 + comlumnId;

  if (seatId > aTotal.highestId)
    aTotal.highestId = seatId;

  aTotal.seats.push({ row: rowId, comlumn: comlumnId, id: seatId });

  return aTotal;
}

function SortById(aSeat1, aSeat2) {
  if (aSeat1.id > aSeat2.id)
    return 1;
  else if (aSeat1.id == aSeat2.id)
    return 0;

  return -1;
}

function ComputeMyTicketId(aTickets) {

  let tickets = util.CopyObject(aTickets);

  tickets.seats.sort(SortById);

  let seatMap = [];
  for (let i = 0; i < tickets.seats.length; i++)
    seatMap[tickets.seats[i].id] = tickets.seats[i];

  for (let i = tickets.seats[0].id + 1; i < tickets.seats[tickets.seats.length - 1].id - 1; i++)
    if ((seatMap[i] === undefined) && (seatMap[i - 1] !== undefined) && (seatMap[i + 1] !== undefined))
      return i;

  return 0;
}

let tickets = { seats: [], highestId: 0 };
util.ReduceInput('./Day5Input.txt', ScanTicket, tickets, '\r\n');

console.log(tickets.highestId);

let myTicketId = ComputeMyTicketId(tickets);
console.log(myTicketId);
