var 
    // Internal cosnstants.
    POSITIVE = false,
    NEGATIVE = true,
    
    // Comparison constants.
    GT = 0,
    LT = 1,
    EQ = 2;

// The Big constructor.
Big = function(src) {
    // Coalesce numbers to strings.
    if (typeof src == "number") {
        src = "" + src;
    }
    
    // Parse and load the string version.
    if (src.substring) {
        var l = lex(src);
        
        this.sign = l.sign;
        this.exponent = l.exponent;
        this.mantissa = l.mantissa;
    }
    
    // Load by parts.
    else {
        this.sign = arguments[0];
        this.exponent = arguments[1];
        this.mantissa = arguments[2];
    }
};

// Global constants.
Big.POSITIVE = POSITIVE;
Big.NEGATIVE = NEGATIVE;

Big.parse = function(str) {
    return new Big(str);
};

