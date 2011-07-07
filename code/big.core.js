// Parse a source string into a Big object:
function lex(src) {
    var 
        hasSign = /^[+-]/.test(src),
        hasDecimal = /^[+-]?\d*\.\d*$/.test(src),
        withoutSign = hasSign ? 
            src.slice(1) :
            src;
    
    return normalize(
        new Big(
            hasSign && src[0] == "-" ? 
                NEGATIVE : 
                POSITIVE,
                
            hasDecimal ? 
                withoutSign.indexOf(".") :
                withoutSign.length,
                
            stringToMantissa(
                withoutSign.replace(".", "")
            )
        )
    );
}

// Central definition of zero
var zero = new Big(POSITIVE, 1, []);

// Do comparison on two bigs, returns a comparison constant:
function compare(bl, br) {
    if (bl.sign > br.sign)              { return GT; }
    else if (bl.sign < br.sign)         { return LT; }
    
    if (bl.exponent > br.exponent)      { return GT; }
    else if (bl.exponent < br.exponent) { return LT; }
    
    return compareMantissae(bl.mantissa, br.mantissa);
}

// Compare only mantissae:
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

// Returns true or false for whether a mantissa is zero:
function mantissaIsZero(m) { 
    return /^0*$/.test(mantissaToString(m));
}

// Returns the whole component of a big number in a string of base 10.
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

// Returns the fractional component of a big number in a string of base 10.
function fractionalString(b) {
    var frac = trimR(drop(b.exponent, b.mantissa));
    
    if (!frac.length)   { return ""; }
    else                { return "." + 
                            repeat(-b.exponent, "0").join("") + 
                            frac.join(""); }
}

// Trim zeroes from the left:
function trimL(m) {
    return stringToMantissa(
        mantissaToString(m).replace(/0^+/, "")
    );
}

// Trim zeroes from the right:
function trimR(m) {
    return stringToMantissa(
        mantissaToString(m).replace(/0+$/, "")
    );
}

// Take first len elements of m:
function take(len, m) { return m.slice(0, len); }

// Drop first len elements of m:
function drop(len, m) { return m.slice(len); }

// The final element of m:
function last(m) { return m[m.length - 1]; }

// The initial element of m:
function init(m) { return m.slice(0, m.length - 1); }

// Pad m with zeroes to the left UNTIL it is of length len:
function padL(len, m) {
    if (m.length < len) { return repeat(len - m.length, 0).concat(m); }
    else                { return m; }
}

// Pad m with zeroes to the right UNTIL it is of length len:
function padR(len, m) {
    if (m.length < len) { return m.concat(repeat(len - m.length, 0)); }
    else                { return m; }
}

// Returns an array of val len times:
function repeat(len, val) {
    if (len <= 0) { return []; }
    
    var result = new Array(len);
    for (var idx = 0; idx < len; ++idx) {
        result[idx] = val;
    }
    return result;
}

// Standard map function:
function map(fn, arr) {
    var result = new Array(arr.length);
    for (var idx = 0; idx < arr.length; ++idx) {
        result[idx] = fn(arr[idx]);
    }
    return result;
}

// Converts a string to a mantissa array:
function stringToMantissa(sz) {
    return map(
        function(x) { return parseInt(x, 10); },
        sz.split("")
    );
}

// Joins a mantissa into a string of digits:
function mantissaToString(m) { return m.join(""); }

// Normalize the big until the mantissa has no leading zeroes and adjust the radix:
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

// Abnormalize the big by adding leading zeroes until the given exponent is met:
function abnormalize(exp, b) {
    return new Big(
        b.sign,
        exp,
        padL(exp, b.mantissa)
    );
}

// Returns a tuple of the arguments which 
// are guaranteed to have the same exponent:
function sameExponent(l, r) {
    if (l.exponent == r.exponent)       { return { l:l, r:r }; }
    else if (l.exponent < r.exponent)   { return { l:abnormalize(r.exponent, l), r:r }; }
    else  /*(l.exponent > r.exponent)*/ { return { l:l, r:abnormalize(l.exponent, r) }; }
}

function negate(b) {
    return new Big(
        !b.sign,
        b.exponent,
        b.mantissa
    );
}

