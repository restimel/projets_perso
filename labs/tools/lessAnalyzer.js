#!/usr/bin/env node

var fs = require('fs'),
	events = require('events'),
	eventEmitter = new events.EventEmitter();

function main(argv) {
  if (argv.some(function(v) {return /^-[^\s]*h|^--help$/i.test(v);})) {
  	console.log('\nusage:\n' + argv[0] + ' ' + argv[1].split('/').pop() +
  		' path [filter]\n\n' +
  		'path: directory location where to search files. default: ./\n' +
  		'filter: filter to apply on files. Only files which match filter will be analyzed. default = "*"\n' +
  		'\nOption\n' +
  		'--help: (or -h) give commands');
  } else {
  	var path = argv[2],
  		filter = argv[3];
  	eventEmitter.on('analyzed', function(){
  		var setVarUnused = analyzer.setVarUnused,
  			useVarUnset = analyzer.useVarUnset,
  			countErrSet = 0,
  			countErrUse = 0;

  		if (setVarUnused.length || useVarUnset.length) {
	  		analyzer.files.forEach(function(file) {
	  			var list = file.useVar.filter(function(v) {
	  				return useVarUnset.indexOf(v) !== -1;
	  			});
	  			if (list.length) {
	  				console.warn('File ' + file.name + ' use variables that are not defined: ' + list.join(', '));
	  				countErrUse += list.length;
	  			}
	  			
	  			list = file.setVar.filter(function(v) {
	  				return setVarUnused.indexOf(v) !== -1;
	  			});
	  			if (list.length) {
	  				console.warn('File ' + file.name + ' define variables that are not used: ' + list.join(', '));
	  				countErrSet += list.length;
	  			}
	  		});
	  		console.log('');
			console.log('Variables unused:', countErrSet);
			console.log('Variables not defined:', countErrUse);
		} else {
			console.log('no issue detected.');
		}
		console.log('searched in ' + analyzer.files.length + ' files')
  	});
  	var analyzer = new FileAnalyzer(path, filter);
  }
}


function FileAnalyzer(path, filter) {
	this.files = [];
	this.setVarUnused = [];
	this.useVarUnset = [];
	this.convertFilter(filter || '');
	path = (path || '').replace(/\/$/,'') || '.';

	this.readDirectory(path);
}

/**
 * Convert a filter string with joker into a regexp
 * @param {String} filter the filter in string format
 */
FileAnalyzer.prototype.convertFilter = function(filter) {
	filter = filter.replace(/[.]/g, '\\$&').replace(/[?*]/g, '.$&') + '$';
	this.filter = new RegExp(filter);
};

/**
 * Search which variables are set but not used and which ones are used but not set
 * setVarUnused and useVarUnset are updated.
 * @trigger 'analyzed' when all analyzis are finished
 */
FileAnalyzer.prototype.analyzeVar = function() {
	var setVar = [],
		useVar = [];
	this.files.forEach(function(file) {
		setVar = setVar.concat(file.setVar);
		useVar = useVar.concat(file.useVar);
	}, this);

	this.setVarUnused = this.isNotIn(setVar, useVar);
	this.useVarUnset = this.isNotIn(useVar, setVar);

	eventEmitter.emit('analyzed');
};

/**
 * search name in source list that are not in the target list
 * @param {Array[String]} origin is the list containing source name
 * @param {Array[String]} target is the list where names must be present
 * @return {Array[String]} a list of names that are in origin list but not in target list
 */
FileAnalyzer.prototype.isNotIn = function(origin, target) {
	var arr = [];

	origin.forEach(function(v) {
		if (!~target.indexOf(v) && !~arr.indexOf(v)) {
			arr.push(v);
		}
	});

	return arr;
};

/**
 * Manage a file to store it and analyze it
 * @param {String} path is the file location
 */
FileAnalyzer.prototype.fileManager = function(path) {
	var fileObject = {
			name: path,
			content: '',
			setVar: [],
			useVar: [],
			ready: false
		};

	this.files.push(fileObject);

	this.readFile(fileObject.name, function (content) {
		fileObject.content = content;
		this.extractVar(fileObject);
	}.bind(this));
};

/**
 * check if all files have been analyzed
 * return {Boolean} true if all files have been analyzed
 */
FileAnalyzer.prototype.isReady = function() {
	var ready = this.files.every(function(o) {return o.ready});
	if (ready) {
		this.analyzeVar();
	}
	return ready;
};

/**
 * look for all variables in file. They are stored in the fileObject properties
 * useVar and setVar.
 * @param {Object} fileObject is the object containing all information about file
 */
FileAnalyzer.prototype.extractVar = function(fileObject) {
	fileObject.setVar = fileObject.content.match(/^@[_a-z][-_$a-z0-9]+/gim) || [];

	fileObject.content.replace(/.(@[_a-z][-_$a-z0-9]+)/gim, function(m, v) {
		if ( !~fileObject.useVar.indexOf(v)) {
			fileObject.useVar.push(v);
		}
	});

	fileObject.ready = true;
	this.isReady();
};

/**
 * Read a file
 * @param {String} path is the location of the file
 * @param {function} f is a callback function which is called when file is read
 */
FileAnalyzer.prototype.readFile = function(path, f) {
	var file = fs.createReadStream(path);

	file.on('data', function(stream) {
		f(stream.utf8Slice());
	});
    file.on('close', function() {});
    file.on('error', sendError);
};

/**
 * read a directory. It read also its subdirectories and its files.
 * @param {String} path is the location of the file
 */
FileAnalyzer.prototype.readDirectory = function(path) {
	fs.readdir(path, function(err, files) {
		if (err) {
			return sendError('directory ' + path + ' could not been open', err);
		}

		if (!files.length) {
			return;
		}

		files.forEach(function(fileName, index) {
			var pathFileName = path + '/' + fileName;
			fs.stat(pathFileName, (function(err, stat) {
				if (err) {
					return sendError(pathFileName + ' could not been open', err);
				}
				if (stat.isDirectory()) {
					this.readDirectory(pathFileName);
				} else {
					if (this.filter.test(pathFileName)) {
						this.fileManager(pathFileName);
					}
				}
			}).bind(this));
		}, this);
	}.bind(this));
};

/**
 * Manage error
 * @param {String} msg a title message
 * @param {String} err the error message
 */
function sendError(msg, err){
	if (typeof err === 'undefined') {
		err = '';
	}

	console.error(msg, err);
}

main(process.argv);
