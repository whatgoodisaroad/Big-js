module("add");

test("add(3, 4) = 7", function() {
    var l, r, expected, result;
    
    l = new Big("3");
    r = new Big("4");
    expected = new Big("7");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds two small positive integers");
});

test("add(3.4, 4.5) = 7.9", function() {
    var l, r, expected, result;
        
    l = new Big("3.4");
    r = new Big("4.5");
    expected = new Big("7.9");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds two small positive reals");
});

test("add(4, -3) = 1", function() {
    var l, r, expected, result;

    l = new Big("4");
    r = new Big("-3");
    expected = new Big("1");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds small negative integer to small positive integer");
});

test("add(-4, -5) = -9", function() {
    var l, r, expected, result;
    
    l = new Big("-4");
    r = new Big("-5");
    expected = new Big("-9");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds two negative integers");
});

test("add(4, -36) = 32", function() {
    var l, r, expected, result;
    
    l = new Big("4");
    r = new Big("-36");
    expected = new Big("-32");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds negative integer to positive integer");
});

test("add(3.456789, 789.1) = 792.556789", function() {
    var l, r, expected, result;
    
    l = new Big("3.456789");
    r = new Big("789.1");
    expected = new Big("792.556789");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds positive reals with different whole and fractional lengths");
});

test("add(8716138.12, 55257081.72085) = 63973219.84085", function() {
    var l, r, expected, result;
    
    l = new Big("8716138.12");
    r = new Big("55257081.72085");
    expected = new Big("63973219.84085");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds large positive reals");
});

test("add(-1.1, 1.8) = 0.7", function() {
    var l, r, expected, result;
    
    l = new Big("-1.1");
    r = new Big("1.8");
    expected = new Big("0.7");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds large positive reals");
});