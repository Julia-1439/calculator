/* The four basic math functions */

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(p, q) {
    return p * q;
}

function divide(p, q) {
    if (q === 0) return null;
    return p / q;
}

/* (Step 2) Variables to store operation info */
let opA, opB, operator;
let displayNumber;

/* (Step 3) */
function operate(operandA, operandB, operator) {
    switch (operator) {
        case "add": 
            return add(operandA, operandB);
        case "subtract": 
            return subtract(operandA, operandB);
        case "multiply": 
            return multiply(operandA, operandB);
        case "divide": 
            return divide(operandA, operandB);
    }
}