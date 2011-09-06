big_no_closure:
	@ echo "Preparing build directory..."
	@ rm -rf build
	@ mkdir -p build
	@ echo "Building big..."
	@ cd lib; make big_no_closure
	@ mv ./lib/Big.js ./build/Big.no_closure.js

tests: big_no_closure
	mv ./build/Big.no_closure.js ./tests

all:
	@ echo "Preparing build directory..."
	@ rm -rf build
	@ mkdir -p build
	@ echo "Building big..."
	@ cd lib; make all
	@ mv ./lib/Big.js ./build
	@ cp ./build/Big.js ./compiler
	@ echo "Compiling big..."
	@ cd compiler; java -jar compiler.jar --js=Big.js --js_output_file=Big.min.temp.js
	@ cat ./lib/full_header.js > ./build/Big.min.js
	@ cat ./compiler/Big.min.temp.js >> ./build/Big.min.js
	@ rm ./compiler/Big.min.temp.js
