

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
                [ uncons_dividend.x ],
                false,
                0,
                flags
            )
        );
    }
}

function div_rec(num_m, den_bn, rem_m, endgame, depth, flags) {
    console.log(arguments);

    if (depth > Big.precision) {
        return [];
    }
    
    if (endgame && mantissaIsZero(rem_m)) {
        return [];
    }
    
    var 
        num_x, 
        num_xs, 
        
        rem_s = mantissaToString(rem_m),
        rem_bn = new Big(rem_s);
        
    if (!num_m.length) {
        num_x = 0;
        num_xs = [];
        
        endgame = true;
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

        return cons(
            0,
            div_rec(
                num_xs,
                den_bn,
                shiftIn(
                    rem_bn, 
                    num_x
                ),
                endgame,
                depth + 1,
                flags
            )
        );
    }
    
    else {
        var 
            // From Knuth sect. 4.3.1:
            q_hat = Math.min(
                Math.floor(
                    mantissaToInt(
                        take(
                            2, 
                            trimL(
                                rem_m
                            )
                        )
                    ) /
                    mantissaToInt(
                        take(
                            1, 
                            trimL(
                                den_bn.mantissa
                            )
                        )
                    )
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
                endgame,
                depth + 1,
                flags
            )
        );
    }
}

function shiftIn(bn, digit) {
    return bn
        .times(new Big(10))
        .plus(new Big(digit))
        .mantissa
}
