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
    if (q === 0) return ERR_MSG_DIV0;
    return p / q;
}

function operate(a, b, operator) {
    switch (operator) {
        case "add": 
            return add(a, b);
        case "subtract": 
            return subtract(a, b);
        case "multiply": 
            return multiply(a, b);
        case "divide": 
            return divide(a, b);
    }
}

function clearAll() {
    operandA = operandB = operator = undefined;
    setDisplay("");
    resultMode = false;
}

function handleDiv0Error() {
    clearAll();
    setDisplay(ERR_MSG_DIV0);
}

/* Global variables to store operation info */
let operandA, operandB, operator;
let displayContent = "";
let resultMode = false;
const ERR_MSG_DIV0 = "ERROR-DIV-0";

/* Global variables for DOM elements */
const digitButtons = document.querySelectorAll(".digit");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector("#equals"); 
const clearButton = document.querySelector("#clear-all");
const display = document.querySelector("#display");

/*  */
clearButton.addEventListener("click", clearAll);

/*  */
digitButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const digit = +e.target.textContent;
        // The + here handles the 0-first case
        const updatedNumber = +`${getCurrOperand() ?? ""}${digit}` 
        
        setCurrOperand(updatedNumber);
        setDisplay(updatedNumber);
        resultMode = false;
    }); 
});


// 
function getCurrOperand() {
    return (operator === undefined) ? operandA : operandB; 
}


//
function setCurrOperand(newNumber) {
    if (operator === undefined) {
        operandA = newNumber;
    }
    else {
        operandB = newNumber;
    }
}

// 
function setDisplay(newContent) {
    displayContent = newContent;
    display.textContent = newContent;
}

operatorButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const pressedOperator = e.target.id; 

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
        
    });
});

equalsButton.addEventListener("click", (e) => {

    // Equals button should only do something if both operands & the operator
    // are defined
    if (!(operandA !== undefined 
        && operandB !== undefined 
        && operator !== undefined)) {
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
});


