# calculator

## Definitions
The following are terms we use in our commits and comments (starting in 
commit afb25e1). Each `*` indicates an arbitrary operator. 
* Equals Calculation: a user input sequence of the form `A * B =`
* Running Calculation: a user input sequence of the form `A * B *` 
* Handoff Calculation: a user input sequence of the form `A * B = *` 
* Current Operand: either `operandA` or `operandB`; the operand to be updated
when the user presses a digit. 
* `resultMode` variable: This variable is set to true only when the = button is pressed and is used only in the Handoff Calculation case. 

## Sources of Help
These are forum sources I consulted for help over the course of developing this project. Note that code documentation is omitted from this due to how many I look at. 
* [StackOverflow: Two ways to round a number in JS and cases of error due to float imprecision:](https://stackoverflow.com/a/12830454/22151685) 

* [StackOverflow: Buttons & Inheritance](https://stackoverflow.com/questions/76109685/why-do-input-and-button-not-inherit-in-css)