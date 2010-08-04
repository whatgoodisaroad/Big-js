var Big;

//(function() { 
  var 
    valid = /^[\+\-]?(\d+(\.\d*)?)|(\.\d+)$/,
    POSITIVE = false,
    NEGATIVE = true;

  Big = function(str) {
    if (!valid.test(str)) {
      throw "Format exception: \"" + str + "\"";
    }
    
    this.sign = POSITIVE;
    
    if (/^[\+\-]/.test(str)) {
      if (str[0] == "-") {
        this.sign = NEGATIVE;
      }
      
      str = str.substring(1);
    }

    if (str.indexOf(".") == -1) {
      this.whole = str;
      this.fractional = "0";
    }

    else if (str[0] == ".") {
      this.whole = "0";
      this.fractional = str.substring(1);
    }
    
    else if (str[str.length - 1] == ".") {
      this.whole = str.substring(0, str.length - 1);
      this.fractional = "0";
    }
    
    else {
      var dec = str.split(".");
      this.whole = dec[0];
      this.fractional = dec[1];
    }
    
    if (trim(this.whole + this.fractional) == "") {
      this.sign = POSITIVE;
    }
  }
  
  Big.POSITIVE = POSITIVE;
  Big.NEGATIVE = NEGATIVE;
  
  Big.prototype.lessThan = function(right) {
    return inequal("lessThan", this, right);
  };
  
  Big.prototype.greaterThan = function(right) {
    return inequal("greaterThan", this, right);
  };
  
  Big.prototype.equals = function(right) {
    return equal(this, right);
  };
  
  Big.prototype.lessThanOrEqualTo = function(right) {
    return inequal("lessThan", this, right) || equal(this, right);
  };
  
  Big.prototype.greaterThanOrEqualTo = function(right) {
    return inequal("greaterThan", this, right) || equal(this, right);
  };
  
  Big.prototype.plus = function(right) {
    return add(this, right);
  };
  
  Big.prototype.minus = function(right) {
    return subtract(this, right);
  };
  
  Big.prototype.toString = function() {
    if (this.isZero()) {
      return "0.0";
    }
    else {
      return [ triml(this.whole), ".", trimr(this.fractional) ].join("");
    }
  }
  
  Big.prototype.isZero = function() {
    return trim(this.whole) == "" && trim(this.fractional) == "";
  }
  
  
  
  
  function equal(left, right) {
    if (left.isZero() && right.isZero()) {
      return true;
    }
    
    if (left.sign != right.sign) {
      return false;
    }
    
    var wholeNorm = Math.max(
      left.whole.length,
      right.whole.length
    );
    
    var fractionalNorm = Math.max(
      left.fractional.length,
      right.fractional.length
    );
    
    return (
      padLeft(left.whole, wholeNorm) == padLeft(right.whole, wholeNorm) && 
      padRight(left.fractional, fractionalNorm) == padRight(right.fractional, fractionalNorm)
    );
  }
  
  function inequal(type, left, right) {
    if (type == "lessThan") {
      var a = -1, b = 1;
      
      if (left.sign != right.sign) {
        return left.sign == Big.NEGATIVE;
      }
    }
    else if (type == "greaterThan") {
      var a = 1, b = -1;
      
      if (left.sign != right.sign) {
        return left.sign == Big.POSITIVE;
      }
    }
    else {
      throw "Bad argument in inequal";
    }
    
    if (left.sign == Big.NEGATIVE) {
      a = -a;
      b = -b;
    }
    
    var wholeNorm = Math.max(
      left.whole.length,
      right.whole.length
    );
    
    var 
      lw = padLeft(left.whole, wholeNorm),
      rw = padLeft(right.whole, wholeNorm);
    
    var comp = strcmp(lw, rw);
    
    if (comp == a) {
      return true;
    }
    
    else if (comp == b) {
      return false;    
    }
    
    else {
      var fractionalNorm = Math.max(
        left.fractional.length,
        right.fractional.length
      );
      
      var 
        lf = padRight(left.fractional, fractionalNorm),
        rf = padRight(right.fractional, fractionalNorm);
      
      return strcmp(lf, rf) == a;
    }
  }
  
  function add(left, right) {
    var fractionalNorm = Math.max(
      left.fractional.length,
      right.fractional.length
    );
    
    var fractionalSum = addStrings(
      padRight(left.fractional, fractionalNorm), 
      padRight(right.fractional, fractionalNorm)
    );
    
    var fractionalCarry;
    
    if (fractionalSum.length > fractionalNorm) {
      fractionalCarry = parseInt(
        fractionalSum.substring(
          0, 
          fractionalSum.length - fractionalNorm
        )
      );
      
      fractionalSum = fractionalSum.substring(1);
    }
    else {
      fractionalCarry = 0;
    }
    
    var wholeNorm = Math.max(
      left.whole.length,
      right.whole.length
    );
    
    var wholeSum = addStrings(
      padLeft(left.whole, wholeNorm), 
      padLeft(right.whole, wholeNorm),
      fractionalCarry
    );
    
    return new Big(
      wholeSum + "." + fractionalSum
    );
  }
  
  function addStrings(left, right, carry, result) {
  
    if (carry == null) {
      carry = 0;
    }
    
    if (result == null) {
      result = "";
    }
  
    if (left.length != right.length) {
      throw "Bad addStrings arguments";
    }
    
    var sum = carry + parseInt(left[left.length - 1]) + parseInt(right[right.length - 1]);
    
    if (sum >= 10) {
      carry = Math.floor(sum / 10);
    }
    
    else {
      carry = 0;
    }
    
    result = (sum - (carry * 10)) + result;
    
    if (left.length == 1) {
      return (carry == 0 ? "" : carry) + result;
    }
    
    else {
      return addStrings(
        left.substring(0, left.length - 1),
        right.substring(0, right.length - 1),
        carry,
        result
      );
    }
  }
  
  
  
  
  function subtract(left, right) {
    //console.log("subtract: left:" + left + " right:" + right);
  
    if (left.equals(right)) {
      return new Big("0.0");
    }
    
    var negate = false;
    
    if (left.lessThan(right)) {
      var temp = left;
      
      left = right;
      right = temp;
      
      negate = true;
    }
    
    var 
      lw = left.whole,
      rw = right.whole,
      lf = left.fractional,
      rf = right.fractional;
    
    var wholeNorm = Math.max(
      lw.length,
      rw.length
    );
    
    lw = padLeft(lw, wholeNorm);
    rw = padLeft(rw, wholeNorm);
    
    var fractionalNorm = Math.max(
      lf.length,
      rf.length
    );
    
    lf = padRight(lf, fractionalNorm);
    rf = padRight(rf, fractionalNorm);
    
    var fracCmp = strcmp(lf, rf);
    
    var fractional;
    
    switch (fracCmp) {
      case 0:
        fractional = "0";
        break;
        
      case -1:
        lw = borrowFromString(lw);
        
        fractional = subtractStrings("1" + lf, "0" + rf).substring(1);
        break;
      
      case 1:
        fractional = subtractStrings(lf, rf);
        break;
    }
    
    
    
    var whole = subtractStrings(lw, rw);
    
    var result = new Big(whole + "." + fractional);
    
    if (negate) {
      result.sign = NEGATIVE;
    }
    
    return result;
  }
  
  function subtractStrings(left, right, result) {
    //console.log("subtractStrings: left:" + left + ", right:" + right + ", result:" + result);

    if (left.length != right.length) {
      throw "Bad subtractStrings args";
    }
    if (!result) {
      result = "";
    }
    
    var 
      len = left.length - 1,
      
      lrem = left.substring(0, len),
      rrem = right.substring(0, len),
      
      ldig = parseInt(left[len], 10),
      rdig = parseInt(right[len], 10);
      
    if (ldig < rdig) {
      lrem = borrowFromString(lrem);
      ldig += 10;
    }
    
    diff = (ldig - rdig).toString();
    
    //console.log("diff " + diff);
    
    result = diff + result;
    
    if (len == 1) {
      //console.log("subtractStrings: EXIT");
      
      return result;
    }
    else {
      return subtractStrings(lrem, rrem, result);
    }
  }
  
  function borrowFromString(str) {
    if (str[str.length - 1] == "0") {
      return borrowFromString(str.substring(0, str.length - 1)) + "9";
    }
    else {
      return str.substring(0, str.length - 1) + (parseInt(str[str.length - 1], 10) - 1);
    }
  }
  
  
  
  
  
  function padLeft(n, d) {
    return Array(Math.max(0, d - (n + '').length + 1)).join(0) + n;
  };
  
  function padRight(n, d) {
    return n + Array(Math.max(0, d - (n + '').length + 1)).join(0);
  };
  
  function trim(n) {
    return n.replace(/(^(0|\s)*)|((0|\s)*$)/g, "");
  }
  
  function triml(n) {
    return n.replace(/(^(0|\s)*)/, "");
  }
  
  function trimr(n) {
    return n.replace(/((0|\s)*$)/, "");
  }
  
  function strcmp(left, right) {
    if (left.length != right.length) {
      throw "Bad strcmp args";
    }
    else if (left.length == 0) {
      return 0;
    }
    else if (left[0] < right[0]) {
      return -1;
    }
    else if (left[0] > right[0]) {
      return 1;
    }
    else {
      return strcmp(
        left.substring(1),
        right.substring(1)
      );
    }
  }
  
  
  
  
  
//})();
