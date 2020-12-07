const util = require('./Util.js');

function ParseTree(aTotal, aElem) {
  let rawNode = aElem.split(' contain ');

  let rawContent = rawNode[1].split(', ');

  let content = [];
  if (rawContent != 'no other bags.') {
    rawContent.reduce((aTotal, aElem) => {
      let rawItem = aElem.split(' ');
      let color = rawItem[1] + " " + rawItem[2];
      aTotal.push({ amount: parseInt(rawItem[0]), color: color });
      return aTotal;
    }, content);
  }

  let node = { name: rawNode[0].split('bags')[0].trim(), content: content };

  aTotal[node.name] = node;

  return aTotal;
}

function BFS(aTree, aStart) {
  let stack = [aStart];
  while (stack.length > 0) {
    let current = stack.shift();

    if (current == "shiny gold")
      return 1;

    aTree[current].content.reduce((aTotal, aElem) => { aTotal.push(aElem.color); return aTotal; }, stack);
  }

  return 0;
}

function BFS2(aTree, aStart) {
  let stack = [aStart];

  let totalMap = [];
  while (stack.length > 0) {
    let current = stack.shift();

    totalMap[current] = -1;

    aTree[current].content.reduce((aTotal, aElem) => { aTotal.push(aElem.color); return aTotal; }, stack);
  }

  return totalMap;
}

function CountBags(aTree) {
  let count = 0;
  for (let node in aTree)
    if (node != "shiny gold")
      count += BFS(aTree, node);
  return count;
}

function ComputeShinyGoldSize(aTree) {
  let totalMap = BFS2(tree, "shiny gold");

  while (true) {
    let computedTotal = false;
    for (let node in totalMap) {
      if (totalMap[node] == -1) {
        if (aTree[node].content.length == 0) {
          totalMap[node] = 1;
          computedTotal = true;
        }
        else {
          let allHaveTotal = true;
          let total = 0;
          for (let i = 0; i < aTree[node].content.length; i++) {
            let color = aTree[node].content[i].color;
            let amount = aTree[node].content[i].amount;
            if (totalMap[color] == -1) {
              allHaveTotal = false;
              break;
            }

            total += amount * totalMap[color];
            if (totalMap[color] > 1)
              total += amount;
          }

          if (allHaveTotal) {
            totalMap[node] = total;
            computedTotal = true;
          }
        }
      }
    }

    if (!computedTotal)
      break;
  }
  return totalMap["shiny gold"];
}

let tree = [];
util.ReduceInput('./Day7Input.txt', ParseTree, tree, '\r\n');

console.log(CountBags(tree));
console.log(ComputeShinyGoldSize(tree));