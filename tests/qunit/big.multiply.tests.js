// new Big("1").times(new Big(0.01)).toString()

module("multiply");

test("multiply(l, r)", function() {
    var l, r, expected, result;
    
    l = new Big("1");
    r = new Big("0.01");
    expected = new Big("0.01");
    result = normalize(multiply(l, r));
    deepEqual(result + "", expected + "", "add correctly finds product of whole with small real");
});
