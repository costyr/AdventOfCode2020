const util = require('./Util.js');

function ParseList(aTotal, aElem) {
  let rawNode = aElem.split(': ');

  let details = rawNode[0].split(' ');

  let minMax = details[0].split('-');

  let node = { min: parseInt(minMax[0]), max: parseInt(minMax[1]), ch: details[1], pass: rawNode[1] };

  aTotal.push(node);

  return aTotal;
}

function CheckPasswords(aList) {
  let valid = 0;
  for (let i = 0; i < aList.length; i++) {
    let count = 0;
    for (let j = 0; j < aList[i].pass.length; j++)
      if (aList[i].ch == aList[i].pass[j])
        count++;

    if ((count >= aList[i].min) && (count <= aList[i].max))
      valid++;
  }

  return valid;
}

function CheckPasswords2(aList) {
  let valid = 0;
  for (let i = 0; i < aList.length; i++) {
    let password = aList[i].pass;
    let min = aList[i].min;
    let max = aList[i].max;
    let ch = aList[i].ch;

    if (((password[min - 1] == ch) && (password[max - 1] != ch)) ||
      ((password[min - 1] != ch) && (password[max - 1] == ch)))
      valid++;
  }

  return valid;
}

let list = util.MapInput('./Day2Input.txt', (aElem) => {
  let rawNode = aElem.split(': ');

  let details = rawNode[0].split(' ');

  let minMax = details[0].split('-');

  return { min: parseInt(minMax[0]), max: parseInt(minMax[1]), ch: details[1], pass: rawNode[1] };
}, '\r\n');

console.log(CheckPasswords(list));
console.log(CheckPasswords2(list));