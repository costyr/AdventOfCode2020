const util = require('./Util.js');

function ReduceStack(aStack, aElem) {
  let op = aStack.pop();
  let param1 = parseInt(aStack.pop(), 10);
  let param2 = parseInt(aElem, 10);

  let result = (op == '+') ? param1 + param2 :
    param1 * param2;
  aStack.push(result.toString());
}

function EvaluateExpresion(aExpresion) {
  let stack = [];
  for (let i = 0; i < aExpresion.length; i++) {
    let elem = aExpresion[i];
    if (elem == ' ')
      continue;
    else if ((elem == '+') || (elem == '*') || (elem == '('))
      stack.push(elem);
    else if (elem == ')') {
      let param2 = stack.pop();
      stack.pop();

      let top = (stack.length > 0) ? stack[stack.length - 1] : '';
      if ((stack.length == 0) || top == '(')
        stack.push(param2.toString());
      else
        ReduceStack(stack, param2)
    }
    else {
      let top = (stack.length > 0) ? stack[stack.length - 1] : '';
      if ((stack.length == 0) || top == '(')
        stack.push(elem);
      else
        ReduceStack(stack, elem);
    }
  }

  return parseInt(stack.pop(), 10);
}

function ReduceStackAdvanced(aStack) {

  let i = 0;
  let reduced = false;
  do {
    reduced = false;
    while (i < aStack.length) {
      let param1 = aStack[i];
      let op = aStack[i + 1];
      let param2 = aStack[i + 2];

      if (op == '+') {
        let result = parseInt(param1, 10) + parseInt(param2, 10);
        aStack[i + 2] = result.toString();
        aStack.splice(i, 2);
        reduced = true;
        i = 0;
        break;
      }
      else
        i++;
    }
  } while (reduced);

  let total = 1;
  for (let i = 0; i < aStack.length; i++) {
    if (aStack[i] == '*')
      continue;

    total *= parseInt(aStack[i], 10);
  }

  return total;
}

function EvaluateExpresionAdvanced(aExpresion) {
  let stack = [];
  for (let i = 0; i < aExpresion.length; i++) {
    let elem = aExpresion[i];
    if (elem == ' ')
      continue;
    else if (elem == '+' || elem == '*')
      stack.push(elem);
    else if (elem == '(')
      stack.push(elem);
    else if (elem == ')') {
      let pos = stack.lastIndexOf('(');
      let total = ReduceStackAdvanced(stack.slice(pos + 1));

      stack.splice(pos, stack.length - pos);
      stack.push(total.toString());
    }
    else
      stack.push(elem);
  }

  return ReduceStackAdvanced(stack, 0);
}

function EvaluateExpresions(aExpresions, aAdvanced) {
  let total = 0;
  for (let i = 0; i < aExpresions.length; i++) {
    let sum = aAdvanced ? EvaluateExpresionAdvanced(aExpresions[i]) : EvaluateExpresion(aExpresions[i]);
    total += sum;
  }

  return total;
}

let expresions = util.MapInput('./Day18Input.txt', (aElem) => {
  return aElem;
}, '\r\n');

console.log(EvaluateExpresions(expresions, false));
console.log(EvaluateExpresions(expresions, true));