module("compare");

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
    
    bl = new Big(0, [ 8, 2, 8, 6, 5, 5, 1, 7, 7 ], false); // new Big("8.28655177");
    br = new Big(0, [ 8, 2, 4, 2, 8, 1, 4, 7 ], false); //new Big("8.2428147");
    expect = false;
    result = bl.lessThanOrEqualTo(br);
    equal(result, expect, "Compare correctly finds less than or equal to bool.");
});