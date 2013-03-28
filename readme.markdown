         ___   _________     __ ____
        / _ ) /  _/ ___/ __ / // __/
       / _  |_/ // (_ /_/ // /_\ \  
      /____//___/\___/(_)___//___/  
                              
***

Big.js
An Arbitrary Precision Math Library for JavaScript

# Overview

Big.js provides a class definition (Big) to handle numbers of any precision and
perform mathematical operations on them within JavaScript. Create a "Big" 
object in either of the the following ways:

    new Big("123.456"); // --> [Object]

OR:

    Big.parse("567.890"); // --> [Object]

# Method Support

Version 0.7.*:
    lessThan, lessThanOrEqualTo, greaterThan, greaterThanOrEqualTo, equals

Version 0.8.*:
    plus, minus, negate, clone

# Runing Tests

The unit test suite is a stratified-randomized differential tester which runs
in UNIX environments and is designed for the VT100 shell (for colors). It has
a small list of system requirements.

1.  Mozilla's Rhino Shell: This is available from Mozilla for free. It is
    essentially a JavaScript interpreter/shell environment which we use to 
    execute the library code quickly and programmatically (and without a 
    browser).

2.  The "apcalc" UNIX utility. On debian variants it can be installed with the 
    command "apt-get install apcalc". It is a programming language built around 
    an infinite precision math library used here as an "oracle" for the 
    differential testing.

To run the unit tests, first navigate to the root of the project and run:

    make tests
    
Then, navigate to tests/differential and run:

    ./differential.sh

You can specify how many tests to run by adding an argument:
    
    ./differential.sh 200

# TODO

* Convert to Node.js module for NPM
* Convert multiplication to FFT
* Exponentiation
* Trigonometric functions
* Logarithms
* Base parsing
