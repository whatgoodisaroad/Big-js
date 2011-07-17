// new Big("1").times(new Big(0.01)).toString()

module("multiply");

test("multiply(l, r)", function() {
    var l, r, expected, result;
    
    l = new Big("1");
    r = new Big("0.01");
    expected = new Big("0.01");
    result = normalize(multiply(l, r));
    deepEqual(result + "", expected + "", "multiply correctly finds product of whole with small real");
    
    l = new Big("5.05");
    r = new Big("8.42");
    expected = new Big("42.521");
    result = normalize(multiply(l, r));
    deepEqual(result + "", expected + "", "multiply correctly finds product of reals");
   
    l = new Big(4);
    r = new Big("8.1865177");
    expected = new Big("32.7460708");
    result = normalize(multiply(l, r));
    deepEqual(result + "", expected + "", "multiply correctly finds product of real with integer");
});
