function subtract(l, r) {   
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



//