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

/* Global variables to store operation info */
let operandA, operandB, operator;
let displayContent = "";
let resultMode = false;

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
        const updatedNumber = (!resultMode)
            ? +`${displayContent}${digit}` // the + here handles the 0-first case
            : digit; 
        
        resultMode = false;
        updateCurrOperand(updatedNumber);
        setDisplay(String(updatedNumber));
    }); 
});

//
function updateCurrOperand(newNumber) {
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
                setDisplay("");
            }
            else {
                // running calculation
            }
        }
        else {
            if (operandB === undefined) {
                // Either initial state or outcome of an Equals Calculation
                
                // Outcome of an Equals Calculation
                if (resultMode) {
                    operandA = +displayContent; // TODO: handle div-0 case
                    operator = pressedOperator;
                    setDisplay("");
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
    const result = operate(operandA, operandB, operator);
    setDisplay(result);
    resultMode = true;
    
    operandA = operandB = operator = undefined;

    // if (displayContent.length > 0 && operandA !== undefined && operator !== undefined) {
    //     operandB = +displayContent;
    //     const result = operate(operandA, operandB, operator);
    //     setDisplay(result); 
        
    //     resultMode = true;
    //     operandA = operandB = operator = undefined;
    // }
});


