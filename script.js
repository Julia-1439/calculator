/* Global variables to store operation info */
let operandA, operandB, operator;
let displayContent = "";
let resultMode = false;
const ERR_MSG_DIV0 = "ERROR-DIV-0";
const DECIMALS_LIMIT = 3;

/* Global variables for DOM elements to add event listeners to */
const digitButtons = document.querySelectorAll(".digit");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector("#equals"); 
const clearButton = document.querySelector("#clear-all");
const display = document.querySelector("#display");

/* Add event listeners to buttons and page */
clearButton.addEventListener("click", clearAll);

digitButtons.forEach((button) => {
    button.addEventListener("click", handleDigitActivation);
});

operatorButtons.forEach((button) => {
    button.addEventListener("click", handleOperatorActivation);
});

equalsButton.addEventListener("click", handleEqualsActivation);

/* Functions called directly by event handlers */

function clearAll() {
    operandA = operandB = operator = undefined;
    setDisplay("");
    resultMode = false;
}

function handleDigitActivation(evt) {
    const digit = +evt.target.textContent;
    // The + here handles the 0-first case
    const updatedNumber = +`${getCurrOperand() ?? ""}${digit}` 
    
    setCurrOperand(updatedNumber);
    setDisplay(updatedNumber);
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

function handleEqualsActivation(evt) {
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
        result = +result.toPrecision(DECIMALS_LIMIT + 1); 
        // The + trims trailing 0s
        // +1 is added to DECIMALS_LIMIT since toPrecision() accepts # of 
        // significant figures rather than decimal places like toFixed()
    }
    else {
        result = +result.toFixed(DECIMALS_LIMIT); // The + trims trailing 0s
    }
    
    return result;
}

function handleDiv0Error() {
    clearAll();
    setDisplay(ERR_MSG_DIV0);
}

