(function() {
    Big.expression = { };
    
    Big.expression.tokenize = function(src) {
        return src.split(/\s/);
    };
    
    Big.expression.tokenizeInfix = function(src) {
        var 
            rawTokens = src
                .replace(/(\()|(\))|(\d+(\.\d*)?)|(\+)|(\-)|(\*)|(\/)/g, " $&")
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
    
    Big.expression.operatorPattern = /^[-+*\/]$/;
    Big.expression.numberPattern = /^\d+(\.\d*)?$/;
    
    Big.expression.evalRpn = function(src) {
        var 
            tokens = Big.expression.tokenize(src),
            token,
            stack = [];
            
        while (tokens.length) {
            token = tokens.shift();
            
            if (Big.expression.numberPattern.test(token)) {
                stack.push(new Big(token));
            }
            else if (Big.expression.operatorPattern.test(token)) {
                if (stack.length < 2) {
                    throw "Big.expression.eval: Syntax Error, Insufficient Stack";
                }
                
                var 
                    op2 = stack.pop(),
                    op1 = stack.pop();
                
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
                throw "Big.expression.eval: Parser Error";
            }
        }
        
        return stack;
    };
    
    Big.expression.getPrecidence = function(op) {
                if (op == "*") { return 3; }
        else    if (op == "/") { return 2; }
        else    if (op == "+") { return 1; }
        else    if (op == "-") { return 0; }
    };
    
    Big.expression.fromInfixToRpn = function(src) {
        var 
            tokens = Big.expression.tokenizeInfix(src),
            token,
            opStack = [],
            result = [];
            
        while (tokens.length) {
            token = tokens.shift();
            
            if (token == "(") {
                opStack.push(token);
            }
            else if (Big.expression.numberPattern.test(token)) {
                result.push(token);
            }
            else if (Big.expression.operatorPattern.test(token)) {
                if (!opStack.length ||
                    opStack[opStack.length - 1] == "(" ||
                    Big.expression.getPrecidence(token) > Big.expression.getPrecidence(opStack[opStack.length - 1])) {
                    opStack.push(token);
                }
                else {
                    do {
                        result.push(opStack.pop());
                    }
                    while(
                        opStack.length &&
                        opStack[opStack.length - 1] != "(" &&
                        Big.expression.getPrecidence(token) < Big.expression.getPrecidence(opStack[opStack.length - 1])
                    );
                    
                    opStack.push(token);
                }
            }
            else if (token == ")") {
                while (opStack[opStack.length - 1] != "(") 
                {
                    result.push(opStack.pop());
                }
                
                opStack.pop();
            }
            else {
                throw "Big.expression.fromInfix: Parser Error";
            }
        }
        
        while (opStack.length) {
            result.push(opStack.pop());
        }
        
        return result.join(" ");
    };
    
    Big.expression.evalInfix = function(src) {
        return Big.expression.evalRpn(
            Big.expression.fromInfixToRpn(src)
        );
    }
    
})();
