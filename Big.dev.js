var Big;

(function() { 
  var 
    valid = /^(\d+(\.\d*)?)|(\.\d+)$/;

  Big = function(str) {
    if (!valid.test(str)) {
      throw "Format exception: \"" + str + "\"";
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
  }
  
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
  
  Big.prototype.toString = function() {
    return [ trim(this.whole), ".", trim(this.fractional) ].join("");
  }
  
  function equal(left, right) {
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
    }
    else if (type == "greaterThan") {
      var a = 1, b = -1;
    }
    else {
      throw "Bad argument in inequal";
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
    
    var fractionalCarry = parseInt(
      fractionalSum.substring(
        0, 
        fractionalSum.length - fractionalNorm
      )
    );
    
    var wholeNorm = Math.max(
      left.whole.length,
      right.whole.length
    );
    
    var wholeSum = addStrings(
      padLeft(left.whole, wholeNorm), 
      padLeft(right.whole, wholeNorm)
    );
    
    return new Big(
      wholeSum + "." + fractionalSum
    );
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
  
  function addStrings(left, right, carry, result) {
    console.log(carry);
  
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
    
    if (sum > 10) {
      carry = Math.floor(sum / 10);
    }
    
    else {
      carry = 0;
    }
    
    result = (sum - (carry * 10)) + result;
    
    if (left.length == 1) {
      return carry + result;
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
  
})();
