module("subtract");

test("subtract(l, r)", 0, function() {
    var l, r, expect, result;
    
    l = new Big("4");
    r = new Big("36");
    expected = new Big("-32");
    result = normalize(subtract(l, r));
    deepEqual(result, expected, "subtract correctly subtracts larger number from smaller");

    l = new Big("4");
    r = new Big("3.5");
    expected = new Big("0.5");
    result = normalize(subtract(l, r));
    deepEqual(result, expected, "subtract correctly subtracts fractional number from whole");
    
});

