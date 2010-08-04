#! /bin/sh

generateRand() {
  numA=`cat /dev/urandom | od -N4 -An -f | sed 's/e[\+\-]//' | bc`;

  shiftA=`cat /dev/urandom | od -N4 -An -i | bc`;

  bcexpr="$numA * ($shiftA % 1000)";

  rand=`echo "$bcexpr" | bc`;
}

rm -rf ./temp.js;
touch ./temp.js;

loader="load('Big.js');";

for i in 1
do

  generateRand;
  testA=$rand;

  generateRand;
  testB=$rand;

  echo "testA = $testA, testB = $testB";

  jsexp="$loader print((new Big('$testA')).lessThan(new Big('$testB')));";

  echo $jsexp >> ./temp.js;

  jres=`rhino -f ./temp.js;`;

  bcexp="$testA<$testB";

  bcres=`echo "$bcexp" | bc`;

  echo "$bcres $jres";

done

