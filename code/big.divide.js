

function divide(left, right) {
    return longDivide(left, right);
}

function longDivide(dividend, divisor) {
    return new Big(
        dividend.sign == divisor.sign ?
            POSITIVE :
            NEGATIVE,
            
        dividend.exponent - divisor.exponent + 1,
        
        divideMantissae(
            dividend.mantissa,
            divisor.mantissa
        )
    );
}

function divideMantissae(m1, m2) {
    if (mantissaIsZero(m1)) { return []; }
    
    // TODO: Handle properly:
    else if (mantissaIsZero(m2)) { throw "Division by zero"; }
    
    else { 
        var ucons_m1 = uncons(m1);
        
        return (
            div_m(
                ucons_m1.xs, 
                m2, 
                [ ucons_m1.x ],
                false
            )
        );
    }
}

function div_m(num, div, rem, endgame) {
    if (endgame && mantissaIsZero(rem)) {
        return [];
    }
    
    var 
        rem_i = mantissaToInt(rem),
        div_i = mantissaToInt(div);
    
    // If the remainder is smaller than the divisor,
    // bring in another digit and yeild a zero-quotient
    // for this digit.
    if (rem.length < div.length ||
        rem_i < div_i) {

        var num_x, num_xs;
        
        if (!num.length) {
            num_x = 0;
            num_xs = [];
            
            endgame = true;
        }
        
        else {
            var uncons_num = uncons(num);
            
            num_x = uncons_num.x;
            num_xs = uncons_num.xs;
        }
        
        return cons(
            0,
            div_m(
                num_xs,
                div,
                rem.concat([ num_x ]),
                endgame
            )
        );
    }
    
    else {
        var 
            // TODO: add q_hat confirm logic.
            q_hat = Math.floor(rem_i / div_i),
            cipher = div_i * q_hat,
            rem_i = mantissaToInt(rem);
            
            cipher_m = intToMantissa(cipher),
            
        rem = intToMantissa(
            rem_i - cipher
        );
        
        return cons(
            q_hat,
            div_m(
                num,
                div,
                rem,
                endgame
            )
        );
    }
}

