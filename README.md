# calculator

## Definitions
The following are terms we use in our commits and comments (starting in 
commit afb25e1). Each `*` indicates an arbitrary operator. 
* Equals Calculation: a user input sequence of the form `A * B =`
* Running Calculation: a user input sequence of the form `A * B *` 
* Handoff Calculation: a user input sequence of the form `A * B = *` 
* Current Operand: either `operandA` or `operandB`; the operand to be updated
when the user presses a digit. 
* `resultMode` variable: This variable is set to true only when the = button
is pressed and is used only in the Handoff Calculation case. 