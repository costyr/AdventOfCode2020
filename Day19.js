const util = require('./Util.js');

function PrintRules(aList) {
  for (let i in aList.rules) {

    let rule = aList.rules[i];

    let children = rule.childLeft.toString();
    if (rule.childRight.length > 0) {
      children += " | ";
      children += rule.childRight.toString();
    }

    console.log(i + ": " + ((rule.value != '') ? rule.value : children));
  }
}

function ComputeExpresion(aRules, aIndex) {
  if (aRules[aIndex].value != "")
    return aRules[aIndex].value;
  else if (((aIndex == 8) || (aIndex == 11)) && (aRules[aIndex].childRight.length > 0)) {
    let exp = "";
    for (let i = 0; i < aRules[aIndex].childLeft.length; i++) {
      exp += ComputeExpresion(aRules, aRules[aIndex].childLeft[i]);
      exp += "+";
    }
    return (aIndex == 11) ? exp : "(" + exp + ")";
  }
  else {
    let exp = "";
    for (let i = 0; i < aRules[aIndex].childLeft.length; i++)
      exp += ComputeExpresion(aRules, aRules[aIndex].childLeft[i]);

    if (aRules[aIndex].childRight.length > 0) {
      exp += "|";
      for (let i = 0; i < aRules[aIndex].childRight.length; i++)
        exp += ComputeExpresion(aRules, aRules[aIndex].childRight[i]);
    }

    return (aRules[aIndex].childRight.length == 0) ? exp : "(" + exp + ")";
  }
}

function CountMatch(aList) {
  let regExStr = ComputeExpresion(aList.rules, 0);

  let regex = new RegExp("^" + regExStr + "$");

  let regExStr42 = ComputeExpresion(aList.rules, 42);

  let regex42 = new RegExp("^" + regExStr42, "g");

  let regExStr31 = ComputeExpresion(aList.rules, 31);

  let regex31 = new RegExp("^" + regExStr31, "g");

  let count = 0;
  for (let i = 0; i < aList.messages.length; i++) {
    if (aList.messages[i].match(regex)) {
      let msg = aList.messages[i];

      let count0 = 0;
      while (true) {
        let newMsg = msg.replace(regex42, "");
        if (newMsg == msg)
          break;
        msg = newMsg;
        count0++;
      }

      let count1 = 0;
      while (true) {
        let newMsg = msg.replace(regex31, "");
        if (newMsg == msg)
          break;
        msg = newMsg;
        count1++;
      }

      if (count0 - count1 >= 1)
        count++;
    }
  }

  return count;
}

let list = { rules: [], messages: [] };
util.ReduceInput('./Day19Input.txt', (aTotal, aElem, aIndex) => {
  if (aIndex == 0) {

    aElem.split('\r\n').reduce((aTotal, aElem) => {
      let rawRule = aElem.split(": ");

      let index = parseInt(rawRule[0]);

      let ruleBody = { value: "", childLeft: [], childRight: [] };
      if (rawRule[1].startsWith('"'))
        ruleBody.value = rawRule[1].substr(1, rawRule[1].length - 2);
      else {
        let leftRight = rawRule[1].split(' | ');

        ruleBody.childLeft = leftRight[0].split(' ').map((aElem) => { return parseInt(aElem, 10); });
        if (leftRight.length > 1)
          ruleBody.childRight = leftRight[1].split(' ').map((aElem) => { return parseInt(aElem, 10); });
      }

      aTotal.rules[index] = ruleBody;

      return aTotal;
    }, aTotal);
  }
  else
    aTotal.messages = aElem.split('\r\n');

  return aTotal;
}, list, '\r\n\r\n');

console.log(CountMatch(list));

list.rules[8] = { value: "", childLeft: [42], childRight: [42, 8] };
list.rules[11] = { value: "", childLeft: [42, 31], childRight: [42, 11, 31] };

console.log(CountMatch(list));