module("add");

test("add(l, r)", 5, function() {
    var l, r, expected, result;
    
    l = new Big("3");
    r = new Big("4");
    expected = new Big("7");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds two small positive integers");
    
    l = new Big("3.4");
    r = new Big("4.5");
    expected = new Big("7.9");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds two small positive reals");
    
    l = new Big("4");
    r = new Big("-3");
    expected = new Big("1");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds small negative integer to small positive integer");
    
    l = new Big("-4");
    r = new Big("-5");
    expected = new Big("-9");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds two negative integers");
    
    l = new Big("4");
    r = new Big("-36");
    expected = new Big("-32");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds negative integer to positive integer");
    
    l = new Big("8716138.12");
    r = new Big("55257081.72085");
    expected = new Big("63973219.84085");
    result = normalize(add(l, r));
    deepEqual(result, expected, "add correctly adds large positive reals");
});