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
   
