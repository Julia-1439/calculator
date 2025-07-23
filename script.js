/* Global variables to store operation info */
let operandA, operandB, operator;
let displayContent = "";
let equalsMode = false; 
// This flag is only used in the 'Handoff Calculation' case - see README for 
// definition.

/* Global constants */
const ERR_MSG_DIV0 = "ERROR-DIV-0";
const DECIMAL_PLACES_LIMIT = 3;
const DECIMAL = ".";
const NUM_DIGITS_LIMIT = Number.MAX_SAFE_INTEGER.toString().length - 1; // 15
// This limit is to prevent the user from entering unsafe large numbers. 
// Any *result* containing numbers exceeding 15 digits are rounded to 
// exponential notation to prevent unexpected results from being displayed. 
const OPERATOR_IDS = {
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide"
}; // Utilized in detecting keyboard input for operators

/* Global variables for DOM elements to add event listeners to */
const decimalButton = document.querySelector("#decimal");
const digitButtons = document.querySelectorAll(".digit");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector("#equals"); 
const clearButton = document.querySelector("#clear-all");
const backspaceButton = document.querySelector("#backspace");
const display = document.querySelector("#display");

/* Add event listeners to buttons and page */
clearButton.addEventListener("click", clearAll);
backspaceButton.addEventListener("click", backspace);
decimalButton.addEventListener("click", handleDecimalActivation);
digitButtons.forEach((button) => {
    button.addEventListener("click", handleDigitActivation);
});
operatorButtons.forEach((button) => {
    button.addEventListener("click", handleOperatorActivation);
});
equalsButton.addEventListener("click", handleEqualsActivation);
window.addEventListener("keydown", handleKeydown);


/* Functions called directly by event handlers */
function clearAll() {
    operandA = operandB = operator = undefined;
    setDisplay("");
    equalsMode = false;
}

// Backspace only supports deleting user-input digits, *not* results since:
// (1) user should start a new query if they wish to use a truncation of result
// (2) results in exponential notation would be unwieldy to make compatible
function backspace() {
    const currOperand = getCurrOperand();

    if (currOperand === undefined) {
        return;
    }

    const revisedOperand = currOperand.slice(0, -1) || undefined;
    setCurrOperand(revisedOperand);
    setDisplay(revisedOperand);
}

function handleDecimalActivation() {
    const currOperand = getCurrOperand() ?? "";
    // if currOperand is undefined, it is treated as a string "" be consistent
    // with how handleDigitActivation() handles undefined values.

    if (currOperand.includes(DECIMAL)) {
        return;
    }

    const updatedOperand = (currOperand === "") 
        ? `0${DECIMAL}` 
        : `${currOperand}${DECIMAL}`;
    
    setCurrOperand(updatedOperand);
    setDisplay(updatedOperand);
    equalsMode = false;
}

function handleDigitActivation(evt) {
    const currOperand = getCurrOperand() ?? ""; 
    // if currOperand is undefined, it is treated as a string "" so the 
    // conditional checks in this function apply more cleanly

    if (currOperand.replace(DECIMAL, "").length === NUM_DIGITS_LIMIT) {
        return; 
    }
    
    const digit = evt.target.textContent;
    const updatedOperand = `${currOperand === "0" ? "" : currOperand}${digit}`;

    setCurrOperand(updatedOperand);
    setDisplay(updatedOperand);
    equalsMode = false;
}

// See README for definitions of the cases handled in this function
function handleOperatorActivation(evt) {
    const pressedOperator = evt.target.id; 

    if (operandA !== undefined) {

        // Handles the 'Equals Calculation' case and switching operators
        if (operandB === undefined) {
            operator = pressedOperator;
        }

        // Handles the 'Running Calculation' case.  
        else {
            const prevOperator = operator;

            const intermediateResult = operate(operandA, operandB, prevOperator);
            if (intermediateResult === ERR_MSG_DIV0) {
                handleDiv0Error();
                return;
            }
            setDisplay(intermediateResult);

            operandA = intermediateResult;
            operandB = undefined; 
            operator = pressedOperator; 
        }
    }
    else {
        // Handles the 'Handoff Calculation' case. 
        if (equalsMode) {
            operandA = displayContent; 
            operator = pressedOperator;
            equalsMode = false;
        }
        
        // Initial state of the calculator also reaches here (nothing happens)
    }
}

function handleEqualsActivation() {
    // Equals button should only do something if both operands & the operator
    // are defined
    if (operandA === undefined 
        || operandB === undefined 
        || operator === undefined) {
        return; 
    }

    const result = operate(operandA, operandB, operator);
    if (result === ERR_MSG_DIV0) {
        handleDiv0Error();
        return;
    }
    setDisplay(result);
    equalsMode = true;    
    operandA = operandB = operator = undefined;
}

function handleKeydown(evt) {
    const keyPressed = evt.key;
    
    if (isNaN(keyPressed)) {
        switch (keyPressed) {
            case ".": 
                handleDecimalActivation();
                break; 
            case "+": 
            case "-":
            case "*": 
            case "/": 
                const operatorId = OPERATOR_IDS[keyPressed];
                const dummyEvt = {target: {id: operatorId}};
                handleOperatorActivation(dummyEvt);
                break;
            case "=":
                handleEqualsActivation();
                break;
            case "c":
                clearAll();
                break;
            case "Backspace":
            case "Delete":
                backspace(); 
                break; 
        }
    }
    else {
        const dummyEvt = {target: {textContent: +keyPressed}};
        handleDigitActivation(dummyEvt);
    }
}

/* Helper functions */

function setDisplay(newContent) {
    displayContent = newContent;
    display.textContent = newContent;
}

function getCurrOperand() {
    return (operator === undefined) ? operandA : operandB; 
}

function setCurrOperand(newOperand) {
    if (operator === undefined) {
        operandA = newOperand;
    }
    else {
        operandB = newOperand;
    }
}

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
    if (q === 0) return ERR_MSG_DIV0;
    return p / q;
}

function operate(a, b, operator) {
    let result;
    a = +a;
    b = +b;
    
    switch (operator) {
        case "add": 
            result = add(a, b);
            break;
        case "subtract": 
            result = subtract(a, b);
            break;
        case "multiply": 
            result = multiply(a, b);
            break;
        case "divide": 
            result = divide(a, b);
            break;
    }
    
    if (result === ERR_MSG_DIV0){
        return result; 
    }
    // Perform rounding
    else if (result.toString().includes("e+")) {
        result = result.toExponential(DECIMAL_PLACES_LIMIT);       
    }
    else if (Math.trunc(result).toString().length > NUM_DIGITS_LIMIT) { 
        result = result.toExponential(DECIMAL_PLACES_LIMIT);
        // Any result with large integer part (one exceeding the 15 digit length
        // limit) is written in exponential notation to prevent the result
        // overflowing the display or showing precision errors
    }
    else {
        result = +result.toFixed(DECIMAL_PLACES_LIMIT); 
        // Rounding a standard number
        // (the + trims any trailing 0s after the decimal point)
    }
    
    return result;
}

function handleDiv0Error() {
    clearAll();
    setDisplay(ERR_MSG_DIV0);
}

