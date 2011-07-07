module("compare");

test("compare(bl, br)", function() {
    var bl, br, expect, result;
    
    bl = new Big("-83165407.681")
    br = new Big("-38813385.765954299");
    expect = LT;
    result = compare(bl, br);
    equal(result, expect, "compare correctly finds smallest of two negative numbers");
    
    bl = new Big("-100")
    br = new Big("-4");
    expect = LT;
    result = compare(bl, br);
    equal(result, expect, "compare correctly finds smallest of two negative numbers");
    
    bl = new Big("9614994.104949061")
    br = new Big("9181308.764");
    expect = GT;
    result = compare(bl, br);
    equal(result, expect, "compare correctly finds smallest of two negative numbers");
});