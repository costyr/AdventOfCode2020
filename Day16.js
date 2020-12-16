const util = require('./Util.js');

function ParseTicketBoard(aTotal, aElem, aIndex) {
  if (aIndex == 0) {
    aTotal.rules = aElem.split("\r\n").map((aElem) => {
      let rawRules = aElem.split(": ");
      let rawIntervals = rawRules[1].split(' or ');

      let intervals = [];
      for (let i = 0; i < rawIntervals.length; i++) {
        let interval = [];
        let numbers = rawIntervals[i].split("-");
        for (let j = 0; j < numbers.length; j++)
          interval.push(parseInt(numbers[j], 10));
        intervals.push(interval);
      }

      return { ruleName: rawRules[0], rules: intervals };
    });
  }
  else if (aIndex == 1) {
    aTotal.my_ticket = aElem.split(":\r\n")[1].split(",").map((aElem) => { 
      return parseInt(aElem, 10); 
    });
  }
  else {
    aTotal.nearby_tickets = aElem.split(":\r\n")[1].split("\r\n").map((aElem) => {
      return aElem.split(",").map((aElem) => {
        return parseInt(aElem, 10);
      });
    });
  }

  return aTotal;
}

function FindInvalid(aBoard, aValidTickets) {
  let errorRate = 0;
  for (let i = 0; i < aBoard.nearby_tickets.length; i++) {
    let hasErrors = false;
    for (let j = 0; j < aBoard.nearby_tickets[i].length; j++) {
      let field = aBoard.nearby_tickets[i][j];
      let isValid = false;
      for (let k = 0; k < aBoard.rules.length; k++) {
        let first = aBoard.rules[k].rules[0];
        let second = aBoard.rules[k].rules[1];
        if ((field >= first[0] && field <= first[1]) ||
          (field >= second[0] && field <= second[1])) {
          isValid = true;
          break;
        }
      }

      if (!isValid) {
        errorRate += field;
        hasErrors = true;
      }
    }
    if (!hasErrors)
      aValidTickets.push(aBoard.nearby_tickets[i]);
  }

  return errorRate;
}

function FindFieldPosition(aBoard, aValidTickets, aRules) {
  let first = aRules[0];
  let second = aRules[1];
  let allPos = [];
  for (let i = 0; i < aBoard.my_ticket.length; i++) {
    let matchesAll = true;
    for (let j = 0; j < aValidTickets.length; j++) {
      let field = aValidTickets[j][i];
      if ((field < first[0] || field > first[1]) &&
        (field < second[0] || field > second[1])) {
        matchesAll = false;
        break;
      }
    }

    if (matchesAll)
      allPos.push(i);
  }

  return allPos;
}

function RemoveField(aMap, aFieldName, aFieldIndex) {
  for (let [key, value] of aMap)
    if (key != aFieldName) {
      let i = value.indexOf(aFieldIndex);
      if (i >= 0)
        value = value.splice(i, 1);
    }
}

function FindFields(aBoard, aValidTickets) {
  let possibleMap = new Map();
  for (let i = 0; i < aBoard.rules.length; i++) {
    let allPos = FindFieldPosition(aBoard, aValidTickets, aBoard.rules[i].rules);
    possibleMap.set(aBoard.rules[i].ruleName, allPos);
  }

  let idCheck = 1;
  let foundIds = new Map();
  while (true) {
    let found = false;
    for (let [key, value] of possibleMap) {
      let allPossibleFields = value;
      if (allPossibleFields.length == 1) {
        let field = allPossibleFields[0];
        if (!foundIds.has(field)) {
          if (key.startsWith("departure"))
            idCheck *= aBoard.my_ticket[field];
          foundIds.set(field, 1);
          RemoveField(possibleMap, key, field);
          found = true;
        }
      }
    }

    if (!found)
      break;
  }

  return idCheck;
}

let board = { rules: [], my_ticket: [], nearby_tickets: [] };
util.ReduceInput('./Day16Input.txt', ParseTicketBoard, board, '\r\n\r\n');

let validTickets = [];
console.log(FindInvalid(board, validTickets));
console.log(FindFields(board, validTickets));