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

/* Global variables to store operation info */
let operandA, operandB, operator;
let displayNum = "";

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

/* Pressing digits should populate display and set displayNum */
const display = document.querySelector("#display");

const digitButtons = document.querySelectorAll(".digit");
digitButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        displayNum += e.target.textContent;
        display.textContent = displayNum;
    });
});