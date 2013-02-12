(function() {
    Big.expression = { };
    
    // Break the string into tokens.
    Big.expression.tokenize = function(src) {
        return src.split(/\s/);
    };
    
    // Tokenize in terms of infix notation.
    Big.expression.tokenizeInfix = function(src) {
        var 
            rawTokens = src
                .replace(/(\()|(\))|(\d+(\.\d*)?)|(\+)|(\-)|(\*)|(\/)|(.*)/g, " $&")
                .split(/\s/)
                .slice(1),
            result = [];
            
        while (rawTokens.length) {
            var temp = rawTokens.shift();
            
            if (temp.length) {
                result.push(temp);
            }
        }
        
        return result;
    };
    
    // Matching pattern for an operator.
    Big.expression.operatorPattern = /^[-+*\/]$/;   
    
    // Matching pattern for a parseable number.
    Big.expression.numberPattern = /^\d+(\.\d*)?$/;
    
    // Eval the parameter as an rpn expression string 
    //  and return the resulting stack.
    Big.expression.evalRpn = function(src) {
        var 
            tokens = Big.expression.tokenize(src),
            token,
            stack = [];
        
        // Loop through tokens:
        while (tokens.length) {
            token = tokens.shift();
            
            // If the token represents a number,
            //  parse as a big and push.
            if (Big.expression.numberPattern.test(token)) {
                stack.push(new Big(token));
            }
            
            // If it's an operator,
            //  transform the top of the stack.
            else if (Big.expression.operatorPattern.test(token)) {
                if (stack.length < 2) {
                    throw "Big.expression.eval: Syntax Error, Insufficient Stack";
                }
                
                var 
                    op2 = stack.pop(),
                    op1 = stack.pop();
                
                // Switch on the operator type:
                if (token == "+") {
                    stack.push(op1.plus(op2));
                }
                else if (token == "-") {
                    stack.push(op1.minus(op2));
                }
                else if (token == "*") {
                    stack.push(op1.times(op2));
                }
                else if (token == "/") {
                    stack.push(op1.over(op2));
                }
            }
            else {
                throw "Big.expression.eval: unrecognized token \"" + token + "\"";
            }
        }
        
        return stack;
    };
    
    // Map operators to their precidence.
    Big.expression.getPrecidence = function(op) {
                if (op == "*") { return 3; }
        else    if (op == "/") { return 2; }
        else    if (op == "+") { return 1; }
        else    if (op == "-") { return 0; }
    };
    
    // Convert an infix expression string to RPN expression string.
    Big.expression.fromInfixToRpn = function(src) {
        var 
            tokens = Big.expression.tokenizeInfix(src),
            token,
            opStack = [],
            result = [];
            
        // Loop through tokens.
        while (tokens.length) {
            token = tokens.shift();
            
            // If it's an open paren, 
            //  push a marker to the operator stack.
            if (token == "(") {
                opStack.push(token);
            }
            
            // If it's a number, 
            //  push the token to the result stack.
            else if (Big.expression.numberPattern.test(token)) {
                result.push(token);
            }
            
            // If it's an operator,
            else if (Big.expression.operatorPattern.test(token)) {
                
                var 
                    topOperator = opStack[opStack.length - 1],
                    currentPrecidence = Big.expression.getPrecidence(token);
                
                // If the operator stack is empty, 
                //  or the top of the operator stack is an open paren marker,
                //  or the top of the operator stack has a lower precidence than the token,
                //  then push the token to the operator stack.
                if (!opStack.length ||
                    topOperator == "(" ||
                    currentPrecidence > Big.expression.getPrecidence(topOperator)) {
                    opStack.push(token);
                }
                
                // Else pop operators from the operator stack and push them to the result stack,
                //  while there are operators in the stack,
                //  and an open paren marker has not been found,
                //  and the current precidence is less than the new top operator.
                // Finally push the token to the operator stack.
                else {
                    do {
                        result.push(opStack.pop());
                    }
                    while(
                        opStack.length &&
                        opStack[opStack.length - 1] != "(" &&
                        currentPrecidence < Big.expression.getPrecidence(opStack[opStack.length - 1])
                    );
                    
                    opStack.push(token);
                }
            }
            
            // If a close paren has been found,
            //  then pop the entire operator stack into the result stack,
            //  while the top of the stack is not an open paren marker.
            else if (token == ")") {
                while (opStack[opStack.length - 1] != "(") 
                {
                    result.push(opStack.pop());
                    
                    if (!opStack.length) {
                        throw "Big.expression.fromInfix: No matching open paren.";
                    }
                }
                
                opStack.pop();
            }
            
            // The token didn't match any pattern.
            else {
                throw "Big.expression.fromInfix: unrecognized token \"" + token + "\"";
            }
        }
        
        // After all of the tokens have been processed, 
        //  pop the operator stack to the result stack.
        while (opStack.length) {
            result.push(opStack.pop());
        }
        
        // 
        return result.join(" ");
    };
    
    Big.expression.evalInfix = function(src) {
        return Big.expression.evalRpn(
            Big.expression.fromInfixToRpn(src)
        );
    }
    
})();
