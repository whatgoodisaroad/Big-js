// Prototype Methods;
///////////////////////////////////////////////////////

Big.prototype.toString = function() {
    if (mantissaIsZero(this.mantissa)) { return "0"; }
    
    var norm = normalize(this);
    
    return (
        (this.sign == NEGATIVE ? "-" : "") +
            wholeString(norm) +
            fractionalString(norm)
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

Big.prototype.times = function(right) {
    return normalize(multiply(this, right));
};

Big.prototype.over = function(divisor) {
    return normalize(divide(this, divisor));
};

Big.prototype.isZero = function() { return mantissaIsZero(this.mantissa); };

Big.prototype.clone = function() {
    return new Big(
        this.sign,
        this.exponent,
        this.mantissa.slice()
    );
};

// Negate does not modify.
Big.prototype.negate = function() {
    var ret = this.clone();

    ret.sign = !ret.sign;

    return ret;
};

