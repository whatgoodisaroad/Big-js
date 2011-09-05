// Basic, O(n^2) multiplication algorithm:
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