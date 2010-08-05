all:
	@ cat header.js > Big.min.js
	@ ../jsmin/jsmin.bin < ./Big.js >> Big.min.js
