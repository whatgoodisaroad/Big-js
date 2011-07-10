// Basic, O(n^2) multiplication algorithm:
function multiply(l, r) {
    var 
        same = preProcess(l, r),
        n = same.l.mantissa.length;
        result = repeat(2 * n - 1, 0);
    
    for (var ridx = n - 1; ridx >= 0; --ridx) {
        for (var lidx = n - 1; lidx >= 0; --lidx) {
            result[ridx + lidx] += (
                same.r.mantissa[ridx] * 
                same.l.mantissa[lidx]
            );
        }
    }
    
    var term, ones, carry;
    
    for (var idx = result.length - 1; idx > 0; --idx) {
        term = result[idx];
        
        if (term > 9) {
            ones = term % 10;
            carry = (term - ones) / 10;
            
            result[idx - 1] += carry;
            result[idx] = ones;
        }
    }
    
    return new Big(
        l.sign == r.sign ? 
            POSITIVE :
            NEGATIVE,
            
        2 * same.l.exponent - 1,
        
        result
    );
}

