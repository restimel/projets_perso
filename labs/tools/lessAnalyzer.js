#!/usr/bin/env node

'use strict';
var fs = require('fs'),
    events = require('events'),
    eventEmitter = new events.EventEmitter();

/**
 * the main entry point of the program
  * @param {String[]} argv list of arguments given my STDIN
 */
function main(argv) {
    var params = ['prog', 'execFile', 'path', 'filter'],
        option = {
            prog: '', /* name of executable program (node)*/
             execFile: '', /* path of file executed */
            path: '.', /* path of searching directory */
            filter: '*', /* Analyze only files which match this filter */
            help: false, /* display help command */
             excNamesValue: [] /* variable names to be ignored */
        },
        param, i;

    for (i = 0; i < argv.length; i++) {
        param = argv[i];
        if (param.indexOf('-') === 0) {
             if (main.manageParameters(param, argv[i + 1], option)) {
                i++;
            }
        } else {
            if (params.length === 0) {
                main.stopProg('Too much arguments. Try --help for more information.');
             }
            option[params.shift()] = param;
        }
    }

    main.executeProg(option);
}

/**
 * An object that analyze all files to extract variables and search if they
 * are used and defined.
  * @param {String} path is the path of the main directory to look in.
 * @param {String} filter is a pattern to filter files.
 * @param {object} option contains all executing options
 */
function FileAnalyzer(path, filter, option) {
     this.files = [];
    this.setVarUnused = [];
    this.useVarUnset = [];
    this.filter = this.convertFilter(filter || '');
    this.displayWlist = option.displayWlist || [];
    this.displayBlist = option.displayBlist || [];
     this.exceptNames = ['import', 'media', 'arguments', 'rest'].concat(option.excNamesValue);
    path = (path || '').replace(/\/$/,'') || '.';

    this.exceptNames = this.exceptNames.map(function(v) {
         if (v[0] === '@') {
            return v;
        } else {
            return '@' + v;
        }
    });

    this.displayWlist = this.displayWlist.map(this.convertFilter);
     this.displayBlist = this.displayBlist.map(this.convertFilter);

    this.readDirectory(path);
}

/**
 * Convert a filter string with joker into a regexp
 * @param {String} filter the filter in string format
  * @return {RegExp} a regexp of the filter
 */
FileAnalyzer.prototype.convertFilter = function(filter) {
    filter = filter.replace(/[.]/g, '\\$&').replace(/[?*]/g, '.$&') + '$';
     return new RegExp(filter);
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

    /* look for variables that are not defined and not used */
    this.setVarUnused = this.isNotIn(setVar, useVar);
    this.useVarUnset = this.isNotIn(useVar, setVar);

    eventEmitter.emit('analyzed');
 };

/**
 * search value in source list that are not in the target list
 * @param {String[]} origin is the list containing source value
 * @param {String[]} target is the list where values must be present
  * @return {String[]} a list of values that are in origin list but not in target list
 */
FileAnalyzer.prototype.isNotIn = function(origin, target) {
    var arr = [];

    origin.forEach(function(v) {
        if (target.indexOf(v) === -1 && arr.indexOf(v) === -1) {
             arr.push(v);
        }
    });

    return arr;
};

FileAnalyzer.prototype.toBeDisplayed = function(obj) {
    var display = true,
        isFiltered = function(filter) {
            return filter.test(obj.name);
         };

    display = !this.displayWlist.length || this.displayWlist.some(isFiltered);
    display = display && (!this.displayBlist.length || !this.displayBlist.some(isFiltered));

    return display;
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

    /* add dynamic property to fileObject */
    fileObject.display = this.toBeDisplayed(fileObject);

    /* add the fileObject to the collection */
    this.files.push(fileObject);

    this.readFile(fileObject.name, function (content) {
        /* save content and remove comments */
        fileObject.content = content
             .replace(/\/\*[\s\S]+?\*\//g, '')
            .replace(/\/\/.*$/gm, '');
        this.extractVar(fileObject);
    }.bind(this));
};

/**
 * check if all files have been analyzed
  * return {Boolean} true if all files have been analyzed
 */
FileAnalyzer.prototype.isReady = function() {
    var ready = this.files.every(function(o) {return o.ready;});

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
    /* Variables Set */
    /* Variables must be at the beginning of a line and be followed by :*/
    fileObject.content.replace(/(?:^|;)\s*(@[_a-z][-_$a-z0-9]+)\s*:/gim, function(m, v) {
         if (fileObject.setVar.indexOf(v) === -1) {
            fileObject.setVar.push(v);
        }
        return '';
    });

    /* In mixin variables must be followed by ){ */
    fileObject.content.replace(/[(,;]\s*(@[_a-z][-_$a-z0-9]+)\b(?=[^()]*?\)\s*{)/gim, function(m, v) {
         if (fileObject.setVar.indexOf(v) === -1) {
            fileObject.setVar.push(v);
        }
        return '';
    });

    /* Variables Used */
    /* variables mustn't be at the beginning of a line they could be called with brackets*/
     fileObject.content.replace(/[^\s;(,][ \t]*(@[_a-z][-_$a-z0-9]+|@{[_a-z][-_$a-z0-9]+})/gim, function(m, v) {
        v = v.replace(/[{}]/g, '');
        if (fileObject.useVar.indexOf(v) === -1) {
            fileObject.useVar.push(v);
         }
        return '';
    }); /* @@ variables are check but their content are not */

    /* not mixin declaration variables where after ) there is no {*/
    fileObject.content.replace(/[(,;]\s*(@[_a-z][-_$a-z0-9]+\b(?=[^()]*?\)\s*[^{])|@{[_a-z][-_$a-z0-9]+})/gim, function(m, v) {
         v = v.replace(/[{}]/g, '');
        if (fileObject.useVar.indexOf(v) === -1) {
            fileObject.useVar.push(v);
        }
        return '';
    });

    /* remove untrack variables */
     fileObject.setVar = this.isNotIn(fileObject.setVar, this.exceptNames);
    fileObject.useVar = this.isNotIn(fileObject.useVar, this.exceptNames);

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
    file.on('error', main.sendWarning);
};

/**
 * read a directory. It read also its subdirectories and its files.
  * @param {String} path is the location of the file
 */
FileAnalyzer.prototype.readDirectory = function(path) {
    fs.readdir(path, function(err, files) {
        if (err) {
            return main.sendWarning('directory ' + path + ' can not be opened', err);
         }

        if (!files.length) {
            return;
        }

        files.forEach(function(fileName) {
            var pathFileName = path + '/' + fileName;
            fs.stat(pathFileName, function(err, stat) {
                 if (err) {
                    return main.sendWarning(pathFileName + ' can not be opened', err);
                }
                if (stat.isDirectory()) {
                    this.readDirectory(pathFileName);
                 } else {
                    if (this.filter.test(pathFileName)) {
                        this.fileManager(pathFileName);
                    }
                }
            }.bind(this));
         }, this);
    }.bind(this));
};


/**
 * Analyze parameters to fill option correctly
 * @param {String} param the parameter to analyze
 * @param {String} nextParam the next argument
 * @param {object} option to fill to contains all executing options
  * @return {Boolean} true if the next argument has been also analyzed and must be skipped
 */
main.manageParameters = function(param, nextParam, option) {
    var nextParamUsed = false,
        map = {
            f: 'displayWlist',
             F: 'displayBlist',
            V: 'excNamesValue'
        },
        i;

    if (param.indexOf('--') === 0) {
        switch(param) {
          case '--help':
             option.help = true;
            break;
          default:
            main.stopProg('Parameter ' + param + ' unknown. Try --help for more information.');
        }
    } else {
         for (i = 1; i < param.length; i++) {
            switch(param[i]) {
              case 'h':
                option.help = true;
                break;
              case 'f':
              case 'F':
               case 'V':
                if (nextParamUsed) {
                    main.stopProg('Parameter ' + param + ' combines multi-options that' +
                        'require an argument. Try --help for more information.');
                 }
                option[map[param[i]]] = nextParam.split(/\s*,\s*/);
                nextParamUsed = true;
                break;
            }
        }
    }

    return nextParamUsed;
 };

/**
 * Display usage and commands available.
 * @param {object} option contains all executing options
 */
main.runHelp = function(option) {
    console.log('Usage:');
    console.log(option.prog + ' ' + option.execFile.split('/').pop() + ' [option] [path [filter]]');
     console.log('');
    console.log('path: directory location where to search files. default: ./');
    console.log('filter: filter to apply on files. Only files which match filter will be analyzed. default = "*"');
     console.log('');
    console.log('Option');
    console.log('--help: (or -h) give commands');
    console.log('-f [patterns]: Display results only for files matching these patterns. These patterns must be comma separated.');
     console.log('-F [patterns]: Do not display results for files matching these patterns. These patterns must be comma separated.');
    console.log('-V [names]: Exclude variables names. These names must be comma separated.');
 };

/**
 * Run the analyzer with options given
 * @param {object} option contains all executing options
 */
main.runAnalyzer = function(option) {
    var analyzer;

    /* display results when analyzed is finished */
     eventEmitter.on('analyzed', function(){
        var setVarUnused = analyzer.setVarUnused,
            useVarUnset = analyzer.useVarUnset,
            countErrSet = 0,
            countErrUse = 0;

        if (setVarUnused.length || useVarUnset.length) {
            analyzer.files.forEach(function(file) {
                var vNotused, vNotDefined;

                if (!file.display) {
                    return false;
                 }

                vNotDefined = file.useVar.filter(function(v) {
                    return useVarUnset.indexOf(v) !== -1;
                });

                vNotused = file.setVar.filter(function(v) {
                     return setVarUnused.indexOf(v) !== -1;
                });

                if (vNotused.length || vNotDefined.length) {
                    console.log('\nFile: ' + file.name);
                     if (vNotDefined.length) {
                        console.log('Are not defined (' + vNotDefined.length +
                            '): ' + vNotDefined.join(', '));
                        countErrUse += vNotDefined.length;
                     }

                    if (vNotused.length) {
                        console.log('Are not used (' + vNotused.length +
                            '): ' + vNotused.join(', '));
                         countErrUse += vNotused.length;
                    }
                }
            });

            console.log('');
            console.log('Variables unused:', countErrSet);
             console.log('Variables not defined:', countErrUse);
        } else {
            console.log('no issue detected.');
        }
        console.log('searched in ' + analyzer.files.length + ' files');
     });

    /* run the anaylzer */
    analyzer = new FileAnalyzer(option.path, option.filter, option);
};

/**
 * Execute actions regarding option
 * @param {object} option contains all executing options
  */
main.executeProg = function(option) {
    if (option.help) {
        main.runHelp(option);
    } else {
        main.runAnalyzer(option);
    }
};

/**
 * Manage error by sending warning
  * @param {String} msg a title message
 * @param {String} err the error message
 */
main.sendWarning = function(msg, err){
    if (typeof err === 'undefined') {
        err = '';
    }

    console.warn(msg, err);
};

/**
 * Manage error by stopping program
 * @param {String} msg the error message
 */
main.stopProg = function(msg){
    console.error(msg);
    process.exit(1);
 };

/* run script */
main(process.argv);