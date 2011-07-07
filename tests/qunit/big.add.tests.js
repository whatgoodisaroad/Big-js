module("add");

test("add(l, r)", 4, function() {
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
});