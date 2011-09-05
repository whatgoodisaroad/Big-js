module("core");

test("compare(bl, br)", function() {
    var bl, br, expect, result;
    
    bl = new Big("-83165407.681")
    br = new Big("-38813385.765954299");
    expect = true;
    result = compare(bl, br) == LT;
    equal(result, expect, "compare correctly finds smallest of two negative numbers");
    
    bl = new Big("-100")
    br = new Big("-4");
    expect = true;
    result = compare(bl, br) == LT;
    equal(result, expect, "compare correctly finds smallest of two negative numbers");
    
    bl = new Big("9614994.104949061")
    br = new Big("9181308.764");
    expect = true;
    result = compare(bl, br) == GT;
    equal(result, expect, "compare correctly finds smallest of two negative numbers");
    
    bl = new Big(0, [ 8, 2, 8, 6, 5, 5, 1, 7, 7 ],  false); // new Big("8.28655177");
    br = new Big(0, [ 8, 2, 4, 2, 8, 1, 4, 7 ],     false); //new Big("8.2428147");
    expect = true;
    result = bl.lessThanOrEqualTo(br);
    equal(result, expect, "Compare correctly finds less than or equal to bool.");
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

