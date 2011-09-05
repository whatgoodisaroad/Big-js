module("divide");

test("divide(l, r)", function() {
    Big.precision = 18;
    
    var l, r, expected, result;
    
    // l = new Big(-28.56);
    // r = new Big(713.86);
    // expected = new Big("-0.004000784467542655");
    // result = normalize(divide(l, r));
    // deepEqual(result + "", expected + "", "divide correctly finds quotient reals");
    // deepEqual(result.exponent, expected.exponent, "divide correctly finds quotient exponent");

    // l = new Big("-363.705240363");
    // r = new Big("8.28655177");
    // expected = new Big("-43.89102372831733361632");
    // result = normalize(divide(l, r));
    // deepEqual(result + "", expected + "", "divide correctly finds quotient reals");
    // deepEqual(result.exponent, expected.exponent, "divide correctly finds quotient exponent");
    
    // l = new Big(1.3);
    // r = new Big(-2.6);
    // expected = new Big(-0.5);
    // result = normalize(divide(l, r));
    // deepEqual(result + "", expected + "", "divide correctly finds quotient reals");
    // deepEqual(result.exponent, expected.exponent, "divide correctly finds quotient exponent");
    
    l = new Big(2.6);
    r = new Big(-2.85);
    expected = new Big("-0.912280701754385964");
    result = normalize(divide(l, r));
    equal(result + "", expected + "", "divide correctly finds quotient reals");
    deepEqual(result.exponent, expected.exponent, "divide correctly finds quotient exponent");
});
