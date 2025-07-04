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

function operate(a, b, operator) {
    switch (operator) {
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

function clearAll() {
    operandA = operandB = operator = undefined;
    
    display.textContent = "";
    displayContent = "";
    
    resultMode = false;
}

/* Global variables to store operation info */
let operandA, operandB, operator;
let displayContent = "";
let resultMode = false;

const ADD  = "add";
const SUB  = "subtract";
const MULT = "multiply";
const DIV  = "divide";

/* Clear button */
const clearButton = document.querySelector("#clear-all");
clearButton.addEventListener("click", clearAll);

/* Pressing digits should populate display and set displayContent */
const display = document.querySelector("#display");

const digitButtons = document.querySelectorAll(".digit");
digitButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const digit = e.target.textContent;
        const newDisplayContent = (!resultMode)
            ? +`${displayContent}${digit}`
            : digit;

        setDisplay(newDisplayContent);
        resultMode = false;
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
        const newOperator = e.target.id; // not used in case 3 :/
        if (displayContent.length > 0) {
            // Case (1) Set operator after first number entered or on result screen of =
            if (operandA === undefined) {
                operandA = +displayContent; 
                setOperator(newOperator);
                clearDisplay();
            }
            // Case (2) User starts a running calculation after second number
            // is in the display
            else {
                operandB = +displayContent;
                const oldOperator = operator;
                const result = operate(operandA, operandB, oldOperator);
                
                operandA = result;
                setDisplay(result); 
                resultMode = true;

                setOperator(newOperator);
                operandB = undefined;
            }
        }
        else {
            // Case (3) Initial state - do nothing
            if (operandA === undefined) {
                return;
            }
            // Case (4) Freely switch operator before a second number is entered
            // into the display
            else {
                setOperator(newOperator);
            }
        }
        
    });
});

function setOperator(op) {
    operator = op;
}

/* Functionality for equals sign */
const equalsButton = document.querySelector("#equals"); 
equalsButton.addEventListener("click", (e) => {
    if (displayContent.length > 0 && operandA !== undefined && operator !== undefined) {
        operandB = +displayContent;
        const result = operate(operandA, operandB, operator);
        setDisplay(result); 
        
        resultMode = true;
        operandA = operandB = operator = undefined;
    }
});

function clearDisplay() {
    display.textContent = "";
    displayContent = "";
}

function setDisplay(content) {
    content = String(content);
    display.textContent = content;
    displayContent = content;
}