///////////////////////////////////////////////////////////////
//  Big.js
//  v0.10.0 (beta)
///////////////////////////////////////////////////////////////
//  http://github.com/whatgoodisaroad/Big-js
//  By Wyatt Allen
//  MIT Licensed
//  Tuesday, July 27 2010
///////////////////////////////////////////////////////////////
var Big;

//(function() { 
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
    
    // Prototype Methods;
    ///////////////////////////////////////////////////////

    Big.prototype.toString = function() {
        if (mantissaIsZero(this.mantissa)) { return "0"; }
        
        return (
            (this.sign == NEGATIVE ? "-" : "") +
                wholeString(this) +
                fractionalString(this)
        );
    };
    
    Big.prototype.lessThan = function(right) {
        return compare(this, right) == LT;
    };

    Big.prototype.greaterThan = function(right) {
        return compare(this, right) == GT;
    };

    Big.prototype.equals = function(right) {
        return compare(this, right) == EQ;
    };

    Big.prototype.lessThanOrEqualTo = function(right) {
        var c = compare(this, right);
        return c == LT || c == EQ;
    };

    Big.prototype.greaterThanOrEqualTo = function(right) {
        var c = compare(this, right);
        return c == GT || c == EQ;
    };

    Big.prototype.plus = function(right) { 
        return normalize(add(this, right));
    };

    Big.prototype.minus = function(right) { 
        
    };

    Big.prototype.times = function(right) { };

    Big.prototype.over = function(divisor) { };

    Big.prototype.isZero = function() { };

    Big.prototype.clone = function() {
        return new Big(
            this.sign,
            this.exponent,
            this.mantissa
        );
    };

    // Negate does not modify.
    Big.prototype.negate = function() {
        var ret = this.clone();

        ret.sign = !ret.sign;

        return ret;
    };
    
    function lex(src) {
        var 
            hasSign = /^[+-]/.test(src),
            hasDecimal = /^[+-]?\d*\.\d*$/.test(src);
        
        return normalize(
            new Big(
                hasSign && src[0] == "-" ? 
                    NEGATIVE : 
                    POSITIVE,
                    
                hasDecimal ? 
                    src.indexOf(".") :
                    src.length,
                    
                stringToMantissa(
                    hasSign ?
                        src.slice(1).replace(".", "") :
                        src.replace(".", "")
                )
            )
        );
    }
    
    var zero = new Big(POSITIVE, 1, []);
    
    function compare(bl, br) {
        if (bl.sign > br.sign)              { return GT; }
        else if (bl.sign < br.sign)         { return LT; }
        
        if (bl.exponent > br.exponent)      { return GT; }
        else if (bl.exponent < br.exponent) { return LT; }
        
        return compareMantissae(bl.mantissa, br.mantissa);
    }
    
    function compareMantissae(m1, m2) {
        if (!m2.length) {
            if (mantissaIsZero(m1)) { return EQ; }
            else                    { return GT; }
        }
        else if (!m1.length) {
            if (mantissaIsZero(m2)) { return EQ; }
            else                    { return LT; }
        }
        
        if (m1[0] > m2[0])          { return GT; }
        else if (m1[0] < m2[0])     { return LT; }
        
        return compareMantissae(m1.splice(1), m2.splice(1));
    }
    
    function mantissaIsZero(m) { 
        return /^0*$/.test(mantissaToString(m));
    }

    function wholeString(b) {
        if (b.exponent <= 0) { return "0"; }
        else {
            return padR(
                b.exponent, 
                take(
                    b.exponent, 
                    b.mantissa
                )
            ).join("");
        }
    }
    
    function fractionalString(b) {
        var frac = trimR(drop(b.exponent, b.mantissa));
        
        if (!frac.length)   { return ""; }
        else                { return "." + 
                                repeat(-b.exponent, "0").join("") + 
                                frac.join(""); }
    }
    
    function trimL(m) {
        return stringToMantissa(
            mantissaToString(m).replace(/0^+/, "")
        );
    }
    
    function trimR(m) {
        return stringToMantissa(
            mantissaToString(m).replace(/0+$/, "")
        );
    }
    
    function take(len, m) { return m.slice(0, len); }
    
    function drop(len, m) { return m.slice(len); }
    
    function last(m) { return m[m.length - 1]; }
    
    function init(m) { return m.slice(0, m.length - 1); }
    
    function padL(len, m) {
        if (m.length < len) { return repeat(len - m.length, 0).concat(m); }
        else                { return m; }
    }
    
    function padR(len, m) {
        if (m.length < len) { return m.concat(repeat(len - m.length, 0)); }
        else                { return m; }
    }
    
    function repeat(len, val) {
        if (len <= 0) { return []; }
        
        var result = new Array(len);
        for (var idx = 0; idx < len; ++idx) {
            result[idx] = val;
        }
        return result;
    }
    
    function map(fn, arr) {
        var result = new Array(arr.length);
        for (var idx = 0; idx < arr.length; ++idx) {
            result[idx] = fn(arr[idx]);
        }
        return result;
    }
    
    function stringToMantissa(sz) {
        return map(
            function(x) { return parseInt(x, 10); },
            sz.split("")
        );
    }
    
    function mantissaToString(m) { return m.join(""); }
    
    function normalize(b) {
        if (!b.mantissa.length)         { return new Big(b.sign, b.exponent, []); }
        else if (b.mantissa[0] == 0)    { return normalize(
                                                new Big(
                                                    b.sign, 
                                                    b.exponent - 1, 
                                                    b.mantissa.slice(1)
                                                )
                                            ); 
                                        }
        else                            { return b; }
    }
    
    function abnormalize(exp, b) {
        return new Big(
            b.sign,
            exp,
            padL(exp - b.exponent, b.mantissa)
        );
    }
    
    function sameExponent(l, r) {
        if (l.exponent == r.exponent)       { return { l:l, r:r }; }
        else if (l.exponent < r.exponent)   { return { l:abnormalize(r.exponent, l), r:r }; }
        else  /*(l.exponent > r.exponent)*/ { return { l:l, r:abnormalize(l.exponent, r) }; }
    }
    
    function add(l, r) {
        var same = sameExponent(l, r);
        
        if (l.sign == r.sign) {
            var sum = new Big(
                l.sign,
                same.l.exponent + 1,
                addMantissae(
                    same.l.mantissa,
                    same.r.mantissa
                )
            );
            
            if (l.sign == POSITIVE)         { return sum; }
            else /*(l.sign == NEGATIVE)*/   { return negate(sum); }
        }
        
        // Addition with inequal signs is reducible to subtraction.
        else /*(l.sign != r.sign)*/ {
            var cmp = compareMantissae(same.l.mantissa, same.r.mantissa);
            
            if (cmp == EQ)                  { return zero; }
            else if (cmp == LT)             { return negate(subtract(same.r, same.l)); }
            else /*(cmp == GT)*/            { return subtract(same.l, same.r); }
        }
    }
    
    function subtract(l, r) {
        var cmp = compare(l, r),
            
        if (cmp == EQ) { return zero; }
        
        // Subtraction with inequal signs is reducible to addition.
        if (l.sign != r.sign) {
            if (l.sign == POSITIVE)         { return add(l, r); }
            else /*(l.sign == NEGATIVE)*/   { return negate(add(r, l)); }
        }
        
        else /*(l.sign == r.sign)*/ {
            var same = sameExponent(l, r);
            
            if (l.sign == POSITIVE) {
                return new Big(
                    
                );
            }
            
            else /*(l.sign == NEGATIVE)*/ {
            
            }
            
            
        }
        
        
    }
    
    // Assuming equal lengths:
    function addMantissae(m1, m2) {
        var 
            result = new Array(m1.length + 1),
            temp, 
            carry = 0;
            
        for (var idx = m1.length - 1; idx >= 0; --idx) {
            temp = carry + m1[idx] + m2[idx];
            result[idx + 1] = temp % 10
            carry = temp > 9 ? 1 : 0;
        }
        
        result[0] = carry;
        
        return result;
    }
    
    // Assuming equal lengths and that m1 > m2:
    function subtractMantissae(m1, m2) {
        var 
            diff = new Array(m1.length),
            temp;
            
        for (var idx = m1.length - 1; idx >= 0; --idx) {
            if (m1[idx] < m2[idx]) {
                temp = 10 + m1[idx] - m2[idx];
                
                m1 = borrowFromMantissa(m1);
            }
            
            else {
                temp = m1[idx] - m2[idx];
            }
            
            diff[idx] = temp;
        }
        
        return diff;
    }
    
    function borrowFromMantissa(m) {
        if (last(m) == 0)   { return borrowFromMantissa(init(m)).concat([9]); }
        else                { return init(m).concat([last(m) - 1]); }
    }
    
//})();








