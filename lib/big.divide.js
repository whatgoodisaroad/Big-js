

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
            
        porp.r.exponent,
        
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
    if (depth > Big.precision) {
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
