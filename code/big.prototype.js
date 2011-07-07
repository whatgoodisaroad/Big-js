// Prototype Methods;
///////////////////////////////////////////////////////

Big.prototype.toString = function() {
    if (mantissaIsZero(this.mantissa)) { return "0"; }
    
    return (
        (this.sign == NEGATIVE ? "-" : "") +
            wholeString(this) +
            fractionalString(this)
    );
};

Big.prototype.lessThan = function(right) {
    return compare(this, right) == LT;
};

Big.prototype.greaterThan = function(right) {
    return compare(this, right) == GT;
};

Big.prototype.equals = function(right) {
    return compare(this, right) == EQ;
};

Big.prototype.lessThanOrEqualTo = function(right) {
    var c = compare(this, right);
    return c == LT || c == EQ;
};

Big.prototype.greaterThanOrEqualTo = function(right) {
    var c = compare(this, right);
    return c == GT || c == EQ;
};

Big.prototype.plus = function(right) { 
    return normalize(add(this, right));
};

Big.prototype.minus = function(right) { 
    return normalize(subtract(this, right));
};

Big.prototype.times = function(right) { };

Big.prototype.over = function(divisor) { };

Big.prototype.isZero = function() { };

Big.prototype.clone = function() {
    return new Big(
        this.sign,
        this.exponent,
        this.mantissa
    );
};

// Negate does not modify.
Big.prototype.negate = function() {
    var ret = this.clone();

    ret.sign = !ret.sign;

    return ret;
};

