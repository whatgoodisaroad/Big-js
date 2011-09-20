var RPN;
(function() {
    RPN = { };
    
    RPN.tokenize = function(src) {
        return src.split(/\s/);
    };
    
    RPN.operatorPattern = /^[-+*\/]$/;
    RPN.numberPattern = /^\d+$/;
    
    RPN.eval = function(src) {
        var 
            tokens = RPN.tokenize(src),
            token,
            stack = [];
            
        while (tokens.length) {
            token = tokens.shift();
            
            if (RPN.numberPattern.test(token)) {
                stack.push(new Big(token));
            }
            else if (RPN.operatorPattern.test(token)) {
                if (stack.length < 2) {
                    throw "RPN.eval: Syntax Error, Insufficient Stack";
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
                throw "RPN.eval: Parser Error";
            }
        }
        
        return stack;
    };
    
    RPN.getPrecidence = function(op) {
                if (op == "*") { return 0; }
        else    if (op == "/") { return 1; }
        else    if (op == "+") { return 2; }
        else    if (op == "-") { return 3; }
    };
    
    RPN.fromInfix = function(src) {
        var 
            tokens = src.split(/\b/),
            token,
            opStack = [],
            result = [];
            
        while (tokens.length) {
            token = tokens.shift();
            
            if (RPN.numberPattern.test(token)) {
                result[result.length] = token;
            }
            else if (RPN.operatorPattern.test(token)) {
                if (opStack.length ||
                    RPN.getPrecidence(token) < RPN.getPrecidence(opStack[opStack.length - 1])) {
                    result[result.length] = token;
                }
                else {
                    do {
                        result[result.length] = opStack.pop();
                    }
                    while(
                        opStack.length &&
                        RPN.getPrecidence(token) > RPN.getPrecidence(opStack[opStack.length - 1])
                    );
                }
                
                opStack.push(token);
            }
            else {
                throw "RPN.fromInfix: Parser Error";
            }
        }
        
        while (opStack.length) {
            result[result.length] = opStack.pop();
        }
        
        return result.join(" ");
    };
    
})();
