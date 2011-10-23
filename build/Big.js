///////////////////////////////////////////////////////////////
//  Big.js
//  v0.9.0 (beta)
///////////////////////////////////////////////////////////////
//  http://github.com/whatgoodisaroad/Big-js
//  By Wyatt Allen
//  MIT Licensed
//  2011-09-19 (Monday, 19 September 2011)
///////////////////////////////////////////////////////////////
var Big;


(function() {

var 
    // Sign cosnstants.
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
        return lex(src);
    }
    
    // Load by parts.
    else {
        this.sign = arguments[0];
        this.exponent = arguments[1];
        this.mantissa = arguments[2];
        this.flags = arguments[3] || { };
        
        this.expr = this.toString();
    }
};

// Global constants.
Big.POSITIVE = POSITIVE;
Big.NEGATIVE = NEGATIVE;

Big.parse = function(str) {
    return new Big(str);
};

Big.precision = 20;

// Prototype Methods;
///////////////////////////////////////////////////////

Big.prototype.toString = function() {
    if (mantissaIsZero(this.mantissa)) { return "0"; }
    
    var norm = normalize(this);
    
    return (
        (this.sign == NEGATIVE ? "-" : "") +
            wholeString(norm) +
            fractionalString(norm)
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
    return normalize(subtract(this, right));
};

Big.prototype.times = function(right) {
    return normalize(multiply(this, right));
};

Big.prototype.over = function(divisor) {
    return normalize(divide(this, divisor));
};

Big.prototype.isZero = function() { return mantissaIsZero(this.mantissa); };

Big.prototype.clone = function() {
    return new Big(
        this.sign,
        this.exponent,
        this.mantissa.slice()
    );
};

// Negate does not modify.
Big.prototype.negate = function() {
    var ret = this.clone();

    ret.sign = !ret.sign;

    return ret;
};

// Parse a source string into a Big object:
function lex(src) {
    src = src.replace(/(^\s+)|(\s+$)/g, "");

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
                withoutSign.indexOf(".") - 1 :
                withoutSign.length - 1,
                
            stringToMantissa(
                withoutSign.replace(".", "")
            )
        )
    );
}

// Central definition of zero
var zero = new Big(POSITIVE, 0, []);

// Do comparison on two bigs, returns a comparison constant:
function compare(bl, br) {
    
    bl = bl.clone();
    br = br.clone();
    
    if (bl.sign != br.sign) {
        if (bl.sign == POSITIVE)                    { return GT; }
        else /* (bl.sign == NEGATIVE) */            { return LT; }
    }
    
    else if (bl.exponent != br.exponent) {
        if (bl.sign == POSITIVE) {
            if (bl.exponent > br.exponent)          { return GT; }
            else                                    { return LT; }
        }
        else {
            if (bl.exponent > br.exponent)          { return LT; }
            else                                    { return GT; }
        }
    }
    
    else {
        var same = sameExponent(bl, br);
    
        return bl.sign == POSITIVE ?
            compareMantissae(same.l.mantissa, same.r.mantissa) :
            compareMantissae(same.r.mantissa, same.l.mantissa);
    }
}

// Compare only mantissae, assuming they correspond to equal 
// exponents:
function compareMantissae(m1, m2) {
    m1 = m1.slice();
    m2 = m2.slice();

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
    if (b.exponent < 0) { return "0"; }
    else {
        return padR(
            b.exponent + 1, 
            take(
                b.exponent + 1, 
                b.mantissa
            )
        ).join("");
    }
}

// Returns the fractional component of a big number in a string of base 10.
function fractionalString(b) {
    // At least part of the significand is whole:
    if (b.exponent >= 0) {
        
        // If the entire significand is whole:
        if (b.mantissa.length == b.exponent) {
            return "";
        }
        
        // Else at least part of the significand is fractional:
        else {
            var frac = trimR(
                drop(
                    b.exponent + 1, 
                    b.mantissa
                )
            );
        
            return (
                "." + 
                frac.join("")
            );
        }
    }
    
    // The exponent is negative. At least some left padding is needed:
    else {
        return (
            "." + 
            repeat(-b.exponent - 1, "0").join("") + 
            b.mantissa.join("")
        );
    }
}

// Trim zeroes from the left:
function trimL(m) {
    return stringToMantissa(
        mantissaToString(m).replace(/^0+/, "")
    );
}

// Trim zeroes from the right:
function trimR(m) {
    return stringToMantissa(
        mantissaToString(m).replace(/0+$/, "")
    );
}

function cons(elem, arr) { 
    return [elem].concat(arr);
}

function uncons(arr) {
    return {
        x:arr[0],
        xs:arr.slice(1)
    };
}

// Take first len elements of m:
function take(len, m) { return m.slice(0, len); }

// Drop first len elements of m:
function drop(len, m) { 
    if (len < 1)    { return m.slice(); }
    else            { return m.slice(len); }
}

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

// See Haskell Prelude
function zipWith(a1, a2, fn) {
    var result = new Array(a1.length);
    for (var idx = 0; idx < a1.length; ++idx) {
        result[idx] = fn(a1[idx], a2[idx]);
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

function mantissaToInt(m) { return parseInt(mantissaToString(m), 10); }

function intToMantissa(n) { 
    return map(
        function(d) { return parseInt(d, 10); },
        n.toString()
    );
}

// Counts the number of zeroes before the first nonzero digit.
function numberOfLeadingZeroes(m) {
    var 
        match = m.join("").match(/^(0+)[1-9]/);
        
    return match ?
        match[1].length :
        0;
}

// Counts the number of zeroes following the last nonzero digit.
function numberOfTrailingZeroes(m) {
    var 
        match = m.join("").match(/(0+)$/);
        
    return match ?
        match[1].length :
        0;
}

// Normalize the big until the mantissa has no leading 
// or trailing zeroes and adjust the radix.
function normalize(b) {
    if (mantissaIsZero(b.mantissa)) { return zero; }

    var 
        lz = numberOfLeadingZeroes(b.mantissa),
        tz = numberOfTrailingZeroes(b.mantissa);
    
    if (!b.mantissa.length)         { return new Big(b.sign, b.exponent, []); }
    else if (lz)                    { return new Big(
                                            b.sign, 
                                            b.exponent - lz, 
                                            trimR(drop(lz, b.mantissa))
                                        ); 
                                    }
                                    
    else if (tz)                   { return new Big(
                                            b.sign,
                                            b.exponent,
                                            trimR(b.mantissa)
                                        );
                                    }
    else                            { return b }
}

// Abnormalize the big by adding leading zeroes until the given exponent is met:
function abnormalize(exp, b) {
    return new Big(
        b.sign,
        exp,
        padL(
            (exp - b.exponent) + b.mantissa.length, 
            b.mantissa
        )
    );
}

// Returns a tuple of the arguments which 
// are guaranteed to have the same exponent:
function sameExponent(l, r) {
    if (l.exponent == r.exponent)       { return { l:l, r:r }; }
    else if (l.exponent < r.exponent)   { return { l:abnormalize(r.exponent, l), r:r }; }
    else  /*(l.exponent > r.exponent)*/ { return { l:l, r:abnormalize(l.exponent, r) }; }
}

// Right-Pads the mantissae until they are the same length.
// Returns a tuple of bigs.
function sameLength(l, r) {
    var 
        ll = l.mantissa.length, 
        rl = r.mantissa.length;
    
    if (ll == rl)           {   return { l:l, r:r }; }
    else if (ll < rl)       {   return { 
                                    l:new Big(  
                                        l.sign, 
                                        l.exponent,
                                        padR(rl, l.mantissa)
                                    ), 
                                    r:r 
                                }; 
                            }
    else /* (ll > rl) */    {   return { 
                                    l:l,
                                    r:new Big(  
                                        r.sign, 
                                        r.exponent,
                                        padR(ll, r.mantissa)
                                    )
                                }; 
                            }
}

// Convert both bigs so that they have the same
// exponents and mantissa lengths.
function preProcess(l, r) {
    var same = sameExponent(l, r);
    return sameLength(same.l, same.r);
}

function negate(b) {
    return new Big(
        !b.sign,
        b.exponent,
        b.mantissa
    );
}

function abs(b) {
    return new Big(
        POSITIVE,
        b.exponent,
        b.mantissa
    );
}


// Add two Big numbers together and return the sum as another Big:
function add(l, r) {
    var same = sameExponent(l, r);
    same = sameLength(same.l, same.r);
    
	if (l.sign == r.sign) {
        return new Big(
            l.sign,
            same.l.exponent + 1,
            addMantissae(
                same.l.mantissa,
                same.r.mantissa
            )
        );
    }
    
    // Addition with inequal signs is reducible to subtraction:
    else /*(l.sign != r.sign)*/ {
        var cmp = compareMantissae(same.l.mantissa, same.r.mantissa);
        
        if (cmp == EQ)                  { return zero; }
        else if (l.sign == POSITIVE)    { return subtract(same.l, negate(same.r)); }
        else /* (l.sign == NEGATIVE) */ { return subtract(same.r, negate(same.l)); }
    }
}

// Add two mantissae together, assuming that they have 
// equal lengths. Will always result in a mantissa 1 longer
// than the sources because of potential carry.
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

function subtract(l, r) {   
    l = normalize(l);
    r = normalize(r);
    
    if (l.isZero()) {
        return negate(l);
    }
    
    if (r.isZero()) {
        return l.clone();
    }
    
    var cmp = compare(l, r);
        
    if (cmp == EQ) { return zero; }
    
    if (l.sign == r.sign) {
        
        // One negative minus another, restate the problem:
        if (l.sign == NEGATIVE) {
            return subtract(negate(r), negate(l));
        }
        
        // If the left argument is less than the right, then
        // reframe the problem and negate. This way, for the
        // rest of the algorithm left is guaranteed to be 
        // greater than right.
        if (cmp == LT) {
            return negate(subtract(r, l));
        }
        
        var same = sameExponent(l, r);
        same = sameLength(same.l, same.r);

        return new Big(
            l.sign,
            same.l.exponent,
            subtractMantissae(
                same.l.mantissa,
                same.r.mantissa
            )
        );
    }
    
    // Subtraction with inequal signs is reducible to addition.
    else /*(l.sign != r.sign)*/ {
        if (l.sign == POSITIVE)         { return add(l, negate(r)); }
        else /*(l.sign == NEGATIVE)*/   { return negate(add(negate(l), r)); }
    }
}

// Subtract one mantissa from another assuming that the lengths are
// equal and that the first argument is greater so that no carry 
// will occur.
function subtractMantissae(m1, m2) {
    if (m1.length == 0) { return []; }

    var 
        i1 = init(m1), 
        i2 = init(m2),

        l1 = last(m1), 
        l2 = last(m2);
        
    if (l1 < l2) {
        return subtractMantissae(borrowFromMantissa(i1), i2).concat([ l1 + 10 - l2 ]);
    }
    else {
        return subtractMantissae(i1, i2).concat([ l1 - l2 ]);
    }
}

// Subtracts one from a given mantissa:
function borrowFromMantissa(m) {
    if (last(m) == 0)   { return borrowFromMantissa(init(m)).concat([9]); }
    else                { return init(m).concat([last(m) - 1]); }
}



//// Basic, O(n^2) multiplication algorithm:
function multiply(l, r) {
    var 
        same = preProcess(l, r),
        n = same.l.mantissa.length,
        result = repeat(2 * n, 0);
        
    for (var ridx = n - 1; ridx >= 0; --ridx) {
        for (var lidx = n - 1; lidx >= 0; --lidx) {
            result[ridx + lidx + 1] += (
                same.r.mantissa[ridx] * 
                same.l.mantissa[lidx]
            );
        }
    }
    
    result = applyPolynomialCarry(result);
    
    return new Big(
        l.sign == r.sign ? 
            POSITIVE :
            NEGATIVE,
            
        2 * same.l.exponent + 1,
        
        result
    );
}

function applyPolynomialCarry(poly) {
    var term, ones, carry;
    
    poly = poly.slice();
    
    for (var idx = poly.length - 1; idx > 0; --idx) {
        term = poly[idx];
        
        if (term > 9) {
            ones = term % 10;
            carry = (term - ones) / 10;
            
            poly[idx - 1] += carry;
            poly[idx] = ones;
        }
    }
    
    return poly;
}

//

function divide(left, right) {
    return longDivide(left, right);
}

// Divide using traditional, pen-and-paper division:
function longDivide(dividend, divisor) { 
    
    
    /*if (divisor.exponent < 0) {
        var power = new Big(Math.pow(10, -divisor.exponent));
        
        dividend = dividend.times(power);
        divisor = divisor.times(power);
    }*/
    
    // LShift both numbers evenly until they are both whole.
    var porp = porportionateWholes(
        dividend, 
        divisor
    );

    var flags = { };
    
    return new Big(
        dividend.sign == divisor.sign ?
            POSITIVE :
            NEGATIVE,
            
        porp.l.exponent,
        
        // Find mantissa quotient:
        div_prime(
            porp.l, 
            porp.r,
            flags
        ),
        
        flags
    );
}

// Multiply both arguments untill they are both whole
// but have the same ratio.
function porportionateWholes(l, r) {
    var 
        same = sameExponent(l, r),
        diff = same.l.mantissa.length - same.r.mantissa.length,
        factor;
    
    // Left mantissa is longer
    if (diff > 0) {
        factor = new Big(
            Math.pow(
                10,
                same.l.mantissa.length - same.l.exponent - 1
            )
        );
        
        return {
            l:same.l.times(factor),
            r:same.r.times(factor)
        };
    }
    
    // Else left mantissa is longer or they are of equal length.
    else {
        factor = new Big(
            Math.pow(
                10,
                same.r.mantissa.length - same.r.exponent - 1
            )
        );
        
        return {
            l:same.l.times(factor),
            r:same.r.times(factor)
        };
    }
}

// Divide two bigs and return the mantissa only. The mantissa will
// correspond to the same exponent as the divisor.
function div_prime(dividend, divisor, flags) { 
    
    // Trivial case:
    if (mantissaIsZero(dividend.mantissa)) { return []; }
    
    // Error case:
    // TODO: Handle properly via flags.
    else if (mantissaIsZero(divisor.mantissa)) { throw "Division by zero"; }
    
    // Do mantissa division:
    else { 
        
        // Shift out the first digit of the dividend as the initial remainder:
        var uncons_dividend = uncons(dividend.mantissa);
        
        return div_rec(
            
            // The dividend is the dividend sans the initial remainder:
            uncons_dividend.xs, 
            
            // The divisor will not change over the course of division,
            // but must be a positive bignum.
            abs(divisor), 
            
            // The remainder will be a bignum of the initial remander digit.
            new Big(uncons_dividend.x),
            
            // The depth parameter is used to guard precision, therefore the recursion
            // starts at depth-zero.
            0,
            
            // Flags is used as an output parameter.
            flags
        );
    }
}

// Recursive mantissa division algorithm.
function div_rec(num_m, den_bn, rem_bn, depth, flags) { 

    // BASE CASE:
    // If the depth has exceeded the confugured precision,
    // record this in the flags and exit.
    if (depth >= Big.precision) {
        flags.DIVISION_ROUNDOFF = true;
        flags.DIVISION_REMAINDER = rem_bn.toString();
        return [];
    }
    
    // BASE CASE:
    // If the numerator has been exhausted and the remainder has been obliterated,
    // then an exact quotient has been found calls. Exit.
    if (!num_m.length && mantissaIsZero(rem_bn.mantissa)) {
        flags.DIVISION_ROUNDOFF = false;
        return [];
    }
    
    // STEP: Bring in a new digit. This can happen in one of two ways.
    
    var 
        num_x, 
        num_xs;
        
    // The numerator is exhausted then we are creating trailing zeros after the decimal point. (This 
    // is the endgame. If the remainder is obliterated in this case the exact quotient has been 
    // found.) Use a zero in the new remaidner.
    if (!num_m.length) {
        num_x = 0;
        num_xs = [];
    }
    
    // The numerator has not been exhausted, decompose it and use its digit in the next remainder.
    else {
        var uncons_num = uncons(num_m);
        
        num_x = uncons_num.x;
        num_xs = uncons_num.xs;
    }
        
    // STEP: Find quotient digit. This can happen in one of two ways.
        
    // If the remainder is smaller than the divisor,
    // bring in another digit and yeild a zero-quotient for this digit.

    /*// TODO: reenable and test.
    if (false && rem_bn.lessThan(den_bn)) { 
    
        // RECURSIVE CASE:
        return cons(
            0,
            div_rec(
                num_xs,
                den_bn,
                shiftIn(
                    rem_bn, 
                    num_x
                ),
                depth == 0 ?
                    0 :
                    depth + 1,
                flags
            )
        );
    }
    
    // The remainder is greater than or equal to the divisor.
    // This should result in a nonzero quotient digit.
    
    else {*/
        
        var 
            est = findQ_hat(rem_bn, den_bn),
            q_hat = est.q,
            prod_bn = est.prod_bn;
        
        // RECURSIVE CASE:
        return cons(
            q_hat,
            div_rec(
                num_xs,
                den_bn,
                shiftIn(
                    rem_bn.minus(prod_bn), 
                    num_x
                ),
                
                depth == 0 && q_hat == 0 ?
                    0 :
                    depth + 1,
                    
                flags
            )
        );
    /*}*/
}

function findQ_hat(rem_bn, den_bn) {
    
    var prod_bn;
    
    for (var q = 9; q >= 0; --q) {
        prod_bn = den_bn.times(new Big(q));
        
        if (q == 0 || prod_bn.lessThanOrEqualTo(rem_bn)) {
            break;
        }
    }
    
    return {
        q:q,
        prod_bn:prod_bn
    };
}

// q_hat estimation algorithm from Knuth sect. 4.3.1 page 271:
function findQ_hat_knu(rem_bn, den_bn) {
    
    var 
        rem_tm = trimL(rem_bn.mantissa),
        knu_u = (
            (rem_tm[0] * 10) +
            (rem_tm.length > 1 ? 
                rem_tm[1] : 
                0
            )
        ),
        knu_v = trimL(den_bn.mantissa)[0],
        q_hat = Math.min(
            Math.floor(
                knu_u / knu_v
            ),
            9
        ),
        
        prod_bn;
    
    // Multiply step:
    do {
        prod_bn = den_bn
            .times(new Big(q_hat--));
    }
    while (prod_bn.greaterThan(rem_bn));
    ++q_hat;
}

function shiftIn(bn, digit) {
    return bn
        .times(new Big(10))
        .plus(new Big(digit));
}
})();
