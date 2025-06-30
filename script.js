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
let resultMode = false;

const ADD  = "add";
const SUB  = "subtract";
const MULT = "multiply";
const DIV  = "divide";

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
        // This case allows free switching of operator after a first number is 
        // in memory but while display is empty.  
        if (operandA !== undefined) {
            const op = e.target.id; 
            setOperator(op);
        }

        // This case puts the display into operandA and clears the display to
        // ready for operandB to be entered. 
        else if (displayContent.length > 0) {
            const op = e.target.id; 
            setOperator(op);
            
            operandA = +displayContent;
            clearDisplay();
            
            // To handle the case of being on a result screen and using its 
            // contents as operandA in a running calculation
            resultMode = false;
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