/* Global variables to store operation info */
let operandA, operandB, operator;
let displayContent = "";
let resultMode = false; // Only used in the 'Handoff Calculation' case
const ERR_MSG_DIV0 = "ERROR-DIV-0";
const DECIMAL_PLACES_LIMIT = 3;
const NUM_DIGITS_LIMIT = Number.MAX_SAFE_INTEGER.toString().length - 1; // 15
// This limit is to prevent the user entering unsafe large numbers, since
// a user unaware of the MAX_SAFE_INTEGER limit might find it confusing if 
// their input starts changing (try console logging 9999999999999999, which is
// 9 repeated 16 times). 
// Additionally, any computation containing numbers exceeding 15 digits, that 
// is, potentially unsafe numbers, are rounded to exponential notation in 
// accordance with DECIMAL_PLACES_LIMIT to prevent unexpected results from being 
// displayed. 
const OPERATOR_IDS = {
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide"
}
const DECIMAL = ".";

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
    resultMode = false;
}

// Backspace only supports deleting user-input digits, *not* results: 
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
    const currOperand = getCurrOperand();

    if (currOperand !== undefined && currOperand.includes(DECIMAL)) {
        return;
    }

    const updatedOperand = (currOperand === undefined) 
        ? `0${DECIMAL}` 
        : `${currOperand}${DECIMAL}`;
    
    setCurrOperand(updatedOperand);
    setDisplay(updatedOperand);
    resultMode = false;
}

function handleDigitActivation(evt) {
    const currOperand = getCurrOperand() ?? "";

    if (currOperand.replace(DECIMAL, "").length === NUM_DIGITS_LIMIT) {
        return; 
    }
    
    const digit = evt.target.textContent;
    const updatedOperand = `${currOperand === "0" ? "" : currOperand}${digit}`;

    setCurrOperand(updatedOperand);
    setDisplay(updatedOperand);
    resultMode = false;
}

function handleOperatorActivation(evt) {
    const pressedOperator = evt.target.id; 

    if (operandA !== undefined) {
        if (operandB === undefined) {
            // Equals Calculation. Also handles switching operator
            operator = pressedOperator;
        }
        else {
            // Running Calculation. 
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
        if (operandB === undefined) {
            // Either initial state or a Handoff Calculation
            
            // Handoff Calculation
            if (resultMode) {
                operandA = displayContent; 
                operator = pressedOperator;
                resultMode = false;
            }
        }
        else {
            // Impossible (maybe)
        }
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
    resultMode = true;    
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

function setCurrOperand(newNumber) {
    if (operator === undefined) {
        operandA = newNumber;
    }
    else {
        operandB = newNumber;
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
    else if (result.toString().includes("e+")) {
        result = result.toExponential(DECIMAL_PLACES_LIMIT);       
    }
    else if (Math.trunc(result).toString().length > NUM_DIGITS_LIMIT) { 
        result = result.toExponential(DECIMAL_PLACES_LIMIT);
        // Any large integer result (one exceeding the 15 digit length limit) is 
        // written in exponential notation. The integer function is needed 
        // because without, non-large results with high float precision such as
        // 3.33333333333333 would be written as "3.333+e0" rather than the 
        // desired 3.333. 
    }
    else {
        // The + trims any trailing 0s after the decimal point
        result = +result.toFixed(DECIMAL_PLACES_LIMIT); 
    }
    
    return result;
}

function handleDiv0Error() {
    clearAll();
    setDisplay(ERR_MSG_DIV0);
}

