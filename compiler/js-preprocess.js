/**
 * @preserve JavaScript Preprocessor v0.33
 *
 * Licensed under the new BSD License.
 * Copyright 2009, Bram Stein
 * All rights reserved.
 */
/*
 * This is a simple JavaScript preprocessor to enable conditional compilation. The 
 * syntax of the preprocessor is a subset of the C preprocessor. This means that all 
 * JavaScript preprocessor directives are valid C preprocessor directives (and can
 * thus be used with the C preprocessor), but not the other way around. 
 *
 * Pseudo EBNF for the preprocessor:
 * ---------------------------------
 * block       ::= statement block
 * 
 * statement        ::= if-statement |
 *                      define-statement |
 *                      undef-statement |
 *                      line
 *                  
 * if-statement     ::= ('#ifdef' | '#ifndef') <identifier> block ['#else' block] '#endif'
 * 
 * define-statement ::= '#define' <identifier>
 * undef-statement  ::= '#undef' <identifier>
 *
 * <identifier>     ::= [A-Za-z0-9_]
 */
/*global block*/
var preprocess = function (source, definitions) {
    var lines = [],
		p,
		lexer = function (lines) {
			var tokens = new RegExp("^\\s*#(ifdef|ifndef|endif|else|define|undef|.*)\\s*(\\w*)$"),
				index = 0, m;

			function token(t, v, p) {
				return {
					id: t,
					value: v,
					position: p,
					toString: function () {
						return this.id + ' = "' + this.value + '", at: ' + this.position + '\n';
					}
				};
			}

			return {
				hasNext: function () {
				    return index < lines.length;
				},
				next: function () {
					if (index < lines.length) {
						m = tokens.exec(lines[index]);
						index += 1;
						if (m) {
							return token(m[1], m[2], index);
						} else {
							return token('line', lines[index - 1], index);
						}
					}
					return false;
				}
			};
		},
		parser = function (lines, definitions) {
			var	previousToken,
				token,
				l = lexer(lines),
				result = [],
				scope = [],
				symbols = Object.prototype.toString.apply(definitions) === '[object Object]' && definitions || {};

			function inScope() {
				var i = 0,
					len = scope.length,
					result = true;

				for (; i < len; i += 1) {
					result = result && scope[i];
				}
				return result;
			}

			function ifStatement() {
				var invert = token.id === 'ifndef',
					identifier = token.value;

				if (!invert && symbols[identifier] || invert && !symbols[identifier]) {
					scope.push(true);
				} else {
					scope.push(false);
				}
				block();
				scope.pop();
				if (token.id === 'else') {
					if (!invert && !symbols[identifier] || invert && symbols[identifier]) {
						scope.push(true);
					} else {
						scope.push(false);
					}
					block();
					scope.pop();
				}
				    
				if (token.id === 'endif') {
				    return true;
				}
				throw 'Missing #endif at line: ' + previousToken.position;
			}

			function defineStatement() {
				var define = token.id === 'define',
				    identifier = token.value;

				if (define && inScope()) {
					symbols[identifier] = true;        
				} else if (inScope()) {
					delete symbols[identifier];
				}
				return true;
			}

			function lineStatement() {
				if (inScope()) {
					result.push(token.value);
				}
				return true;
			}

			function statement() {
				previousToken = token;
				token = l.next();
				if (token) {
				    if (token.id === 'ifdef' || token.id === 'ifndef') {
				        return ifStatement();
				    } else if (token.id === 'define' || token.id === 'undef') {
				        return defineStatement();
				    } else if (token.id === 'line') {
				        return lineStatement();
				    }
				}
				return false;
			}

			function block() {
				while (statement()) {
				}
				return true;
			}

			return {
				parse: function () {
					scope.push(true);
					block();
		
					if (l.hasNext() || token.id === 'else') {
						throw 'Unexpected statement: "' + token.id + '" at line: ' + token.position;
					}
					scope.pop();

					return result;
				}
			};
		};

    if (typeof source === 'string') {
        lines = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    } else {
        lines = source;
    }

	p = parser(lines, definitions);

	return p.parse();
};

/** 
 * This is code for Ant integration and the command line. You can safely delete 
 * everything below this comment if you are not using Ant or the command line.
 */
/*global importClass, java, Packages, attributes, elements, FileUtils, FileReader, File, self, FileWriter, project, readFile, print*/
if (typeof self !== 'undefined' && typeof self.getTaskName !== 'undefined' && self.getTaskName() + '' === 'preprocess') {
	var ant = function () {
		importClass(java.io.FileWriter);
		importClass(java.io.File);
		importClass(Packages.org.apache.tools.ant.util.FileUtils);
		importClass(java.io.FileReader);

		var defines = attributes.get('defines'),
			todir = attributes.get('todir'),
			file = attributes.get('file'),
			tofile = attributes.get('tofile'),
			filesets = elements.get('fileset'),
			mapping = [], i = 0, j = 0, l = 0, fileset, files = [], def = {},
			fileToString = function (file) {
				return '' + FileUtils.readFully(new FileReader(file)).toString();
			},
			out, result = [];

		defines = (defines + '').split(/,\s?/);

		for (; l < defines.length; l += 1) {
			def[defines[l]] = true;
		}

		if (file) {
			if (tofile || todir) {
				mapping.push({
					src: new File(project.getBaseDir(), file),
					dst: new File(project.getBaseDir(), tofile || todir)
				});
			} else {
				self.fail('Please specify a destination using either the "tofile" or "todir" attribute.');
			}
		} else if (filesets) {
			if (todir) {
				for (; i < filesets.size(); i += 1) {
					fileset = filesets.get(i);
					files = fileset.getDirectoryScanner(project).getIncludedFiles();

					for (; j < files.length; j += 1) {
						mapping.push({
							src: new File(fileset.getDir(project), files[j]),
							dst: new File(new File(project.getBaseDir(), todir), files[j])
						});
					}
				}			
			} else {
				self.fail('Please specify a destination using the "todir" attribute.');
			}
		}

		for (i = 0; i < mapping.length; i += 1) {
			result = [];
			self.log('Preprocessing: ' + mapping[i].dst.toString());
			try {
				result = preprocess(fileToString(mapping[i].src), def);
			} catch (e) {
				self.fail(e);
			}
			mapping[i].dst.getParentFile().mkdirs();
	
			out = new FileWriter(mapping[i].dst);
			out.write(result.join('\n'));
			out.close();
		}
	};
	ant();
}

if (typeof arguments !== 'undefined' && typeof readFile !== 'undefined') {
	var cmd = function (arg) {
		var input,
			defines = {},
			i = 1;

		if (!arg[0]) {
			print('Usage: js-preprocess.js file.js [defines, ...]');
			return 1;
		}

		input = readFile(arg[0]);

		if (!input) {
			print('preprocess: Couldn\'t open file "' + arg[0] + '".');
			return 1;
		}

		for (; i < arg.length; i += 1) {
			defines[arg[i]] = true;
		}

		try {
			print(preprocess(input, defines).join('\n'));
		} catch (e) {
			print(e);
			return 2;
		}
		return 0;
	};
	cmd(arguments);
}
