module("divide");

test("divide(l, r)", function() {
    Big.precision = 18;
    
    var l, r, expected, result;
    
    l = new Big(-28.56);
    r = new Big(713.86);
    expected = new Big("-0.004000784467542655");
    result = normalize(divide(l, r));
    deepEqual(result + "", expected + "", "divide correctly finds quotient reals");
    deepEqual(result.exponent, expected.exponent, "divide correctly finds quotient exponent");

    
    l = new Big("-363.705240363");
    r = new Big("8.28655177");
    expected = new Big("-43.89102372831733361632");
    result = normalize(divide(l, r));
    deepEqual(result + "", expected + "", "divide correctly finds quotient reals");
    deepEqual(result.exponent, expected.exponent, "divide correctly finds quotient exponent");
    
    
});
