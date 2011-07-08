var 
    n1, n2,
    big1, big2,
    oexp,
    expect, actual,
    succeed = 0, total = 0,

    numtests = (arguments.length > 0 && /^\d+$/.test(arguments[0])) ? 
        parseInt(arguments[0]) : 
        128;

load("Big.no_closure.js");

function trimZ(st) {
    return st.replace(/^[\s0]+/g, "").replace(/^-0+/, "-");
}

function rand(n) {
    return Math.floor(Math.random() * n);
}

function rands(l) {
    if (!l) {
        l = rand(10) + 1;
    }
    var s = "";
    for (var idx = 0; idx < l; ++idx) {
        s += "" + rand(10);
    }
    return s;
}

function randn(w) {
    //return (Math.random() > 0.5 ? "+" : "-") + rands() + "." + rands();
    if (!!w) {
        return (w + "." + rands()).replace(/[\n\r]/g, "");
    }
    else {
        return (Math.random() > 0.5 ? "-" : "") + rands() + "." + rands();
    }
}

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
            return (new Big(opts.output)).toString();
        }
    }
    catch(exc) {
        print("\033[01;33mException thrown from bc: \"" + exc + "\"");
    }
}

function dispTest(expect, actual, oexp, booleanTest) {
    ++total;

    if (booleanTest) {
        expect = !!expect;
        actual = !!actual;
    }

    if (expect == actual) {
        //print("\033[22;32mGood");

        ++succeed;
    }
    else {
        print("\033[22;31mBad");

        print("\tora: " + expect + "\tbig: " + actual + "\texp: " + oexp);
    }

    //print("\tora: " + expect + "\tbig: " + actual + "\texp: " + oexp);
}

print("\033[22;34mRunning tests...");

for (var idx = 0; idx < numtests; ++idx) {
    try {

        n1 = trimZ(randn());
        big1 = new Big(n1);

        // Half the time, use the same whole component as in the first one:
        n2 = trimZ(randn(
            Math.random() > 0.5 ? 
                big1.whole :
                null
        ));
        big2 = new Big(n2);

        oexp = "(" + n1 + ") < (" + n2 + ")";
        expect = oracle(oexp, "boolean");
        actual = big1.lessThan(big2);
        dispTest(expect, actual, oexp, true);

        oexp = "(" + n1 + ") <= (" + n2 + ")";
        expect = oracle(oexp, "boolean");
        actual = big1.lessThanOrEqualTo(big2);
        dispTest(expect, actual, oexp, true);

        oexp = "(" + n1 + ") > (" + n2 + ")";
        expect = oracle(oexp, "boolean");
        actual = big1.greaterThan(big2);
        dispTest(expect, actual, oexp, true);

        oexp = "(" + n1 + ") >= (" + n2 + ")";
        expect = oracle(oexp, "boolean");
        actual = big1.greaterThanOrEqualTo(big2);
        dispTest(expect, actual, oexp, true);

        oexp = "(" + n1 + ") == (" + n2 + ")";
        expect = oracle(oexp, "boolean");
        actual = big1.equals(big2);
        dispTest(expect, actual, oexp, true);

        oexp = "(" + n1 + ") + (" + n2 + ")";
        expect = oracle(oexp, "number");
        actual = big1.plus(big2).toString();
        dispTest(expect, actual, oexp);

        oexp = "(" + n1 + ") - (" + n2 + ")";
        expect = oracle(oexp, "number");
        actual = big1.minus(big2).toString();
        dispTest(expect, actual, oexp);

        // oexp = "(" + n1 + ") * (" + n2 + ")";
        // expect = oracle(oexp, "number");
        // actual = big1.times(big2).toString();
        // dispTest(expect, actual, oexp);
    }

    catch(exc) {
        print("\033[01;33mException thrown: \"" + exc + "\"");
        ++total;
    }

}

print("\033[22;34m\nTest Summary:\n\t" + succeed + " test(s) succeeded out of " + total + " (" + ((100 * succeed) / total).toFixed(2) + "%)");
print("\033[22;37m");



