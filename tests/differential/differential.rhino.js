var term = { 
    print:function(sz) { print(sz); },
    blue:function(sz) { print("\033[22;34m" + sz); },
    normal:function(sz) { print("\033[22;37m" + sz); },
    red:function(sz) { print("\033[01;31m" + sz); },
    yellow:function(sz) { print("\033[01;33m" + sz); }
};

var console = {
    log:function(msg) {
        //term.yellow(msg);
    }
};

var test = {
    pc:0,
    fc:0,
    
    pass:function(expr, expected, result) {
        ++this.pc;
        term.blue("PASSED:\texpr:" + expr + "\toracle:" + expected + "\tbig:" + result);
    },
    fail:function(expr, expected, result) {
        ++this.fc
        term.red("FAILED:\texpr:" + expr + "\toracle:" + expected + "\tbig:" + result);
    },
    
    percentage:function() {
        return ((this.pc / (this.pc + this.fc)) * 100).toFixed(2);
    },
    
    printResults:function() {
        term.blue(
            this.percentage() + 
            "% tests passed " + 
            "(" + this.pc + "/" + (this.pc + this.fc) + ")"
        );
    }
    
};

var numtests = (arguments.length > 0 && /^\d+$/.test(arguments[0])) ? 
    parseInt(arguments[0]) : 
    128;

var partLength = 10;
    
term.blue("**** differential.rhino.js ****");

term.normal("Loading Big.no_closure.js");
load("Big.no_closure.js");
term.normal("Loaded.");

term.normal("Doing " + numtests + " test(s)...");

function oracle(expr, type) {
    try {
        var opts = { output:"" };
    
        var retcode = runCommand("./apcalc.wrapper.sh", expr, opts);

        if (retcode) {
            print("bc returned fail, expr: \"" + expr + "\"");
        }

        if (type == "boolean") {
            return !!(opts.output * 1);
        }
        else if (type == "number") {
            opts.output = opts.output.replace(/^[~]/, "");
        
            return new Big(opts.output).toString();
        }
    }
    catch(exc) {
        term.yellow("Exception thrown from apcalc: \"" + exc + "\"");
    }
}

function randB() {
    return new Big(random());
    
    var 
        sign = Math.random() > 0.5 ? Big.POSITIVE : Big.NEGATIVE,
        exponent = Math.floor(Math.random() * 10 - 20),
        length = Math.floor(Math.random() * (partLength - 1) + 1),
        mantissa = new Array(length);
        
    mantissa = map(function(_) { return Math.floor(Math.random() * 9); }, mantissa);
        
    return new Big(
        sign,
        exponent,
        mantissa
    );   
};

function random() {
    var 
        wl = Math.floor(Math.random() * (partLength - 2) + 1),
        fl = Math.floor(Math.random() * (partLength - 1) + 1),
        res = "";
        
    if (Math.random() > 0.5) { res += "-"; }
        
    res += (Math.floor(Math.random() * 8) + 1) + "";
        
    for (var idx = 0; idx < wl - 1; ++idx) {
        res += Math.floor(Math.random() * 9) + "";
    }
    
    res += ".";
        
    for (var idx = 0; idx < fl; ++idx) {
        res += Math.floor(Math.random() * 9) + "";
    }
    
    return res;
}

function greaterThanTest(l, r) {
    var 
        bl = l,
        br = r,
        expression = "(" + l + ") > (" + r + ")"
        expected = oracle(expression, "boolean"),
        result = bl.greaterThan(br);
    if (expected == result) {
        test.pass(expression, expected, result);
    }
    else {
        test.fail(expression, expected, result);
    }
}

function lessThanTest(l, r) {
    var 
        bl = l,
        br = r,
        expression = "(" + l + ") < (" + r + ")"
        expected = oracle(expression, "boolean"),
        result = bl.lessThan(br);
    if (expected == result) {
        test.pass(expression, expected, result);
    }
    else {
        test.fail(expression, expected, result);
    }
}

function addTest(l, r) {
    var 
        bl = l,
        br = r,
        expression = "(" + l + ") + (" + r + ")"
        expected = oracle(expression, "number"),
        result = bl.plus(br);
    if (expected == result + "") {
        test.pass(expression, expected, result);
    }
    else {
        test.fail(expression, expected, result);
    }
}

function subtractionTest(l, r) {
    var 
        bl = l,
        br = r,
        expression = "(" + l + ") - (" + r + ")",
        expected = oracle(expression, "number"),
        result = bl.minus(br);
    if (expected == result + "") {
        test.pass(expression, expected, result);
    }
    else {
        test.fail(expression, expected, result);
    }
}

function multiplicationTest(l, r) {
    var 
        bl = l,
        br = r,
        expression = "(" + l + ") * (" + r + ")",
        expected = oracle(expression, "number"),
        result = bl.times(br);
    if (expected == result + "") {
        test.pass(expression, expected, result);
    }
    else {
        test.fail(expression, expected, result);
    }
}

function divisionTest(l, r) {
    var 
        bl = l,
        br = r,
        expression = "(" + l + ") / (" + r + ")",
        expected = oracle(expression, "number"),
        result = bl.over(br);
    if (expected == result + "") {
        test.pass(expression, expected, result);
    }
    else {
        test.fail(expression, expected, result);
    }
}

var b1, b2;
for (var idx = 0; idx < numtests; ++idx) {
    b1 = randB();
    b2 = randB();
    
    //greaterThanTest(b1, b2);
    //lessThanTest(b1, b2);
    //addTest(b1, b2);
    subtractionTest(b1, b2);
    //multiplicationTest(b1, b2);
    //divisionTest(b1, b2);
}

print("\n");

test.printResults();

term.normal("\nDone.");

    
    