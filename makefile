big_no_closure:
	@ echo "Preparing build directory..."
	@ rm -rf build
	@ mkdir -p build
	@ echo "Building big..."
	@ cd code; make big_no_closure
	@ mv ./code/Big.js ./build/Big.no_closure.js

tests: big_no_closure
	mv ./build/Big.no_closure.js ./tests

all:
	@ echo "Preparing build directory..."
	@ rm -rf build
	@ mkdir -p build
	@ echo "Building big..."
	@ cd code; make all
	@ mv ./code/Big.js ./build
   