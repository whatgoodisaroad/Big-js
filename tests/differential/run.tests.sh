#! /bin/bash

cp ../Big.no_closure.js .

time rhino test.script.rhino.js $1
