function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(str) {
  if (/[()]/.test(str)) {
    let brackets = str.match(/[()]/g).join("");
    while (brackets.includes("()") === true) {
      brackets = brackets.replace("()", "");
    }
    if (brackets.length !== 0) {
      throw new Error("ExpressionError: Brackets must be paired");
    }
  }

  str = str.match(/[[0-9]+|[+\-*/()]/g);

  let Expression = transformInPostfix(str);

  let result = Expression
    .reduce((acc, element) => {
      let ints;
      switch (true) {
        case !isNaN(element):
          acc.push(element);
          break;
        case /[+\-*/]/.test(element):
          switch (element) {
            case "+":
              ints = acc.splice(-2);
              acc.push(Number(ints[0]) + Number(ints[1]));
              break;
            case "-":
              ints = acc.splice(-2);
              acc.push(Number(ints[0]) - Number(ints[1]));
              break;
            case "*":
              ints = acc.splice(-2);
              acc.push(Number(ints[0]) * Number(ints[1]));
              break;
            case "/":
              ints = acc.splice(-2);
              if (Number(ints[1]) === 0) {
                throw new TypeError("TypeError: Division by zero.");
              } else {
                acc.push(Number(ints[0]) / Number(ints[1]));
              }
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      return acc;
    }, [])[0];
    return result;
}

function transformInPostfix(str) {
  let stack = [];
  let Expression = str.reduce((acc, element) => {
    switch (true) {
    case !isNaN(element):
      acc.push(element);
      break;
    case /[+-]/.test(element):
      if (stack.length === 0 || stack[stack.length - 1] === "(") {
        stack.push(element);
      } else {
        let i = stack.length - 1;
        while (i >= 0) {
          if (/[(]/.test(stack[i])) {
            break;
          } else {
            acc.push(stack[i]);
            stack.pop();
          }
          i -= 1;
        }
        stack.push(element);
      }
      break;
    case /[/*]/.test(element):
      if (stack.length === 0 || /[-+(]/.test(stack[stack.length - 1])) {
        stack.push(element);
      } else {
        let i = stack.length - 1;
        while (i >= 0) {
          if (!/[-+(]/.test(stack[i])) {
            acc.push(stack[i]);
            stack.pop();
            break;
          }
          i -= 1;
        }
        stack.push(element);
      }
      break;
    case /[(]/.test(element):
      stack.push(element);
      break;
    case /[)]/.test(element):
      let i = stack.length - 1;
      while (i >= 0) {
        if (stack[i] === "(") {
          stack.splice(i, 1);
          break;
        } else {
          acc.push(stack[i]);
          stack.pop();
        }
        i -= 1;
      }
      break;
    default:
      break;
    }
    return acc;
  }, []);
  stack.reverse().forEach((element) => Expression.push(element));
  return Expression;
}    

module.exports = {
    expressionCalculator
}
