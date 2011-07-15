

function divide(left, right) {
    return longDivide(left, right);
}

function longDivide(dividend, divisor) {
    var flags = { };
    
    return new Big(
        dividend.sign == divisor.sign ?
            POSITIVE :
            NEGATIVE,
            
        dividend.exponent - divisor.exponent + 1,
        
        div_prime(
            dividend, 
            divisor,
            flags
        )
    );
}


function div_prime(dividend, divisor, flags) {
    if (mantissaIsZero(dividend.mantissa)) { return []; }
    
    // TODO: Handle properly:
    else if (mantissaIsZero(divisor.mantissa)) { throw "Division by zero"; }
    
    else { 
        var uncons_dividend = uncons(dividend.mantissa);
        
        return (
            div_rec(
                uncons_dividend.xs, 
                divisor, 
                new Big(uncons_dividend.x),
                0,
                flags
            )
        );
    }
}

function div_rec(num_m, den_bn, rem_bn, depth, flags) { console.log(arguments);
    if (depth > Big.precision) {
        return [];
    }
    
    if (!num_m.length && mantissaIsZero(rem_bn.mantissa)) {
        return [];
    }
    
    var 
        num_x, 
        num_xs;
        
    if (!num_m.length) {
        num_x = 0;
        num_xs = [];
    }
    
    else {
        var uncons_num = uncons(num_m);
        
        num_x = uncons_num.x;
        num_xs = uncons_num.xs;
    }
        
    // If the remainder is smaller than the divisor,
    // bring in another digit and yeild a zero-quotient
    // for this digit.

    if (rem_bn.lessThan(den_bn)) {
        console.log(0);
        return cons(
            0,
            div_rec(
                num_xs,
                den_bn,
                shiftIn(
                    rem_bn, 
                    num_x
                ),
                depth + 1,
                flags
            )
        );
    }
    
    else {
        
        // q_hat estimation inspired from Knuth sect. 4.3.1 page 271:
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
        
        console.log(q_hat);
        
        // Subtract step:
        rem_bn = rem_bn
            .minus(prod_bn);
        
        return cons(
            q_hat,
            div_rec(
                num_xs,
                den_bn,
                shiftIn(
                    rem_bn, 
                    num_x
                ),
                depth + 1,
                flags
            )
        );
    }
}

function shiftIn(bn, digit) {
    return bn
        .times(new Big(10))
        .plus(new Big(digit));
}
