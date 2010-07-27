#! /bin/sh

rm -rf ./temp.js;
touch ./temp.js;

loader="load('Big.js');";

for i in {1..5}
do

  wholeA=`cat /dev/urandom|od -N4 -An -i`;
  fracA=`cat /dev/urandom|od -N4 -An -i`;
  
  testA=`echo "$wholeA / 1000" | bc`;
  
  echo $testA;
  #echo $testB;

  #jsexp="$loader print((new Big('$testA')).lessThan(new Big('$testB')));";

  #echo $jsexp >> ./temp.js;

  #jres=`rhino -f ./temp.js;`;

  #bcexp="$testA<$testB";

  #bcres=`echo "$bcexp" | bc`;

  #echo "$bcres $jres";

done
