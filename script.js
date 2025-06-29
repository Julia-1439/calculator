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

function operate(a, b, op) {
    switch (op) {
        case ADD: 
            return add(a, b);
        case SUB: 
            return subtract(a, b);
        case MULT: 
            return multiply(a, b);
        case DIV: 
            return divide(a, b);
    }
}

/* Global variables to store operation info */
let operandA, operandB, operator;
let displayContent = "";
const ADD  = "add";
const SUB  = "subtract";
const MULT = "multiply";
const DIV  = "divide";

/* Pressing digits should populate display and set displayContent */
const display = document.querySelector("#display");

const digitButtons = document.querySelectorAll(".digit");
digitButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        displayContent += e.target.textContent;
        displayContent = String(+displayContent); // Handles entering 0 first
        display.textContent = displayContent;
    }); 
});

/**
 * Operator requirements:
 * (1) change the `operator` global variable
 * (2) if the Display is empty, don't do anything else. 
 * (2) if the Display is in Results mode, don't do anything else. 
 * (3) else if Display is not in Results mode (and nonempty):
 *      if A is empty ??gjiourghnriuj
 *      
 * (4) else (Display contains an error message)
 */
const operatorButtons = document.querySelectorAll(".operator");
operatorButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const op = e.target.id; 
        setOperator(op);

        if (displayContent.length > 0) {
            if (operandA === undefined) {
                operandA = +displayContent;
                clearDisplay();
            }
        }
    });
});

function setOperator(op) {
    operator = op;
    console.log("Set to " + op)
}

function clearDisplay() {
    display.textContent = "";
    displayContent = "";
}