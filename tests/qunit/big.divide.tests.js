module("divide");

test("divide(l, r)", function() {
    var l, r, expected, result;
    
    l = new Big(-28.56);
    r = new Big(713.86);
    expected = new Big(-0.004000784467542655423);
    result = normalize(divide(l, r));
    deepEqual(result + "", expected + "", "divide correctly finds quotient reals");
    deepEqual(result.exponent, expected.exponent, "divide correctly finds quotient exponent");
});
