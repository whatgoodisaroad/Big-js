// Add two Big numbers together and return the sum as another Big:
function add(l, r) {
    var same = sameExponent(l, r);
    
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
        else if (cmp == LT)             { return negate(subtract(same.r, same.l)); }
        else /*(cmp == GT)*/            { return subtract(same.l, negate(same.r)); }
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

