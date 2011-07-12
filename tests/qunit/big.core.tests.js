module("core");

test("lex(src)", 2, function() {
    var src, expect, result;
    
    src = "123.456";
    expect = new Big(
        POSITIVE, 
        2,
        [ 1, 2, 3, 4, 5, 6 ]
    );
    result = lex(src);
    deepEqual(result, expect, "Lex correctly parses simple string.");
    
    src = "-3";
    expect = new Big(
        NEGATIVE,
        0,
        [ 3 ]
    );
    result = lex(src);
    deepEqual(result, expect, "Lex correctly parses small negative integer.");
});

test("compare(bl, br)", function() {
    var cmp;
    
    var a = new Big("00123.456");
    var a_orig = new Big("00123.456");
    var b = new Big("123.45600");
    var b_orig = new Big("123.45600");
    compare(a, b);
    
    deepEqual(a, a_orig, "Compare does not change first argument");
    deepEqual(b, b_orig, "Compare does not change second argument");
});

test("compareMantissae(m1, m2)", function() {
    var m1, m2, expect, result;
    
    m1 = [ 8, 3, 1, 6, 5, 4, 0, 7, 6, 8, 1 ];
    m2 = [ 3, 8, 8, 1, 3, 3, 8, 5, 7, 6, 5, 9, 5, 4, 2, 9, 9 ];
    expect = GT;
    result = compareMantissae(m1, m2);
    equal(result, expect, "compareMantissae correctly compares long mantissae");
});

test("abnormalize(exp, b)", function() {
    var exp, src, b, expected_exp, result;
    
    exp = 2;
    src = "3.1415";
    b = new Big(src);
    result = abnormalize(exp, b);
    
    equal(result.exponent, exp, "Abnormalize correctly sets the resulting exponent");
    equal(result.toString(), src, "Abnormalize does not change the unerlying value");
    
});

test("sameExponent(l, r)", function() {
    var l, r, expected, result;
    
    l = r = new Big("1");
    expected = { l:l, r:r };
    result = sameExponent(l, r);
    deepEqual(result, expected, "Same exponent does nothing to equal, small, simple integers");
    
    l = r = new Big("3444366");
    expected = { l:l, r:r };
    result = sameExponent(l, r);
    deepEqual(result, expected, "Same exponent does nothing to equal, large integers");
    
    l = r = new Big("4.633");
    expected = { l:l, r:r };
    result = sameExponent(l, r);
    deepEqual(result, expected, "Same exponent does nothing to equal, small reals");
    
    l = r = new Big("4363717.213456431");
    expected = { l:l, r:r };
    result = sameExponent(l, r);
    deepEqual(result, expected, "Same exponent does nothing to equal, large reals");
    
    l = new Big("23");
    r = new Big("4");
    expected = { l:l, r:abnormalize(l.exponent, r) };
    result = sameExponent(l, r);
    deepEqual(result, expected, "Same exponent abnormalizes right in simple case");

    l = new Big("2");
    r = new Big("4343");
    expected = { l:abnormalize(r.exponent, l), r:r };
    result = sameExponent(l, r);
    deepEqual(result, expected, "Same exponent abnormalizes left in simple case");
    
    l = new Big("23.545");
    r = new Big("4");
    expected = { l:l, r:abnormalize(l.exponent, r) };
    result = sameExponent(l, r);
    deepEqual(result, expected, "Same exponent abnormalizes right in complex case");
    
    l = new Big("4");
    r = new Big("-3");
    expected = { l:l, r:r };
    result = sameExponent(l, r);
    deepEqual(result, expected, "Same exponent does not abnormalize when right is negative");
    
});
