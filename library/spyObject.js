/**
 * spyObject API
 *
 * This work is licensed under a Creative Commons Attribution 3.0 Unported License
 * http://creativecommons.org/licenses/by/3.0/
 *
 * Author : Benoit Mariat
 * Date : 2014 - 01 - 25 (creation)
 *
 *
 * This script provides a spyObject function to monitor methods
 * inside objects (like number of calls and time spent inside).
 *
 * The goal of this library is to supply numbers about performance
 * in your objects.
 * It could provide how much times methods are called and time spent in
 * each of them.
 * The use of this spy could badly impact performance.
 *
 * To use this library you should first call the spyObject function.
 * Then you can retrieve results.
 *
 * Usage:
 * var spy = spyObject(obj, 'obj'); //spy on all methods of object obj
 * spy.add(obj2, 'obj2'); //spy on all methods of object obj2
 * // Results are stored in the same place. If you want to seperate
 * // results, you can create a new spy by calling again spyObject function
 * var result = spy.getPerfCode(); //perfCode string
 *
  **/

/**
	Create a spy
		@{Object} obj: object where method to spy are located
		@{String} prefix: a text to identify the 'owner' of methods spyed.
		@{Array[String]} exclude: list of methods name to not spy.
**/
function spyObject(obj, prefix, exclude){
	'use strict';
	prefix = prefix || '';
	var perfMeasured = [],
		currentMeasure = [],
		functionSpied = [];

	function replaceAll(obj, prefix, exclude){
		var x;
		
		exclude = exclude instanceof Array ? exclude : [];
		for(x in obj){
			if(obj.hasOwnProperty(x) && typeof obj[x] === 'function' && exclude.indexOf(x) === -1 ){
				functionSpied.push(prefix + '.' + x + '(' + spyObject.mode + ')');
				replaceFunc(x, obj, prefix);
			}
		}
	}

	function replaceFunc(f, obj, prefix){
		switch(spyObject.mode){
			case 'console': replaceFuncConsole(f, obj, prefix); break;
			case 'log':
			default:
				if(typeof performance === 'undefined' || !performance.now){
					replaceFuncLogDate(f, obj, prefix);
				}else{
					replaceFuncLog(f, obj, prefix); break;
				}
		}
	}

	function replaceFuncLog(f, obj, prefix){
		var fn = obj[f];
		obj[f] = function(){
			var t1 = performance.now(),
				r = fn.apply(this, arguments),
				t2 = performance.now();
			perfMeasured.push({
				name: prefix + '.' + f,
				start: t1,
				value: t2 - t1,
				option: arguments
			});
			return r;
		};
	}

	function replaceFuncConsole(f, obj, prefix){
		var fn = obj[f], uid=0;
		obj[f] = function(){
			var id = uid++;
			console.time(prefix + '.' + f + id);
			var r = fn.apply(this, arguments);
			console.timeEnd(prefix + '.' + f + id);
			return r;
		};
	}

	function replaceFuncLogDate(f, obj, prefix){
		var fn = obj[f];
		obj[f] = function(){
			var t1 = (new Date()).getTime(),
				r = fn.apply(this, arguments),
				t2 = (new Date()).getTime();
			perfMeasured.push({
				name: prefix + '.' + f,
				start: t1,
				value: t2 - t1,
				option: arguments
			});
			return r;
		};
	}

	function getLastMeasure(name){
		var i = currentMeasure.length, obj;
		while(i--){
			obj = currentMeasure[i];
			if(obj.name === name){
				currentMeasure.splice(i,1);
				return obj;
			}
		}
		return null;
	}

	var spyInterface = {};

	/**
	 * Generate a timeline collection of method called.
	 * measurements are stored in tree when they are called by another spyed method.
	 *	  @{Boolean} resetStartTime: if true start property refers to the time since the first call of a method in this spy
	 **/
	spyInterface.timeline = function (resetStartTime){
		//generate a list of called ordonate in trees
		var currentList = [],
			current = {sub: [], start: -100000, value: Infinity},
			li = perfMeasured.length,
			refTime = resetStartTime ? perfMeasured[0].start : 0,
			obj;

		while(li--){
			obj = copyObj(perfMeasured[li]);

			while(current.start >= obj.start || current.start + current.value <= obj.start + obj.value){
				current = currentList.pop();
			}

			current.sub.push(obj);
			current.sub = current.sub.sort(sortItems);
			currentList.push(current);
			current = obj;
		}

		function copyObj(ref){
			var obj = {
				name: ref.name,
				start: +(ref.start - refTime).toFixed(3),
				value: +(ref.value).toFixed(3),
				sub: [],
				option: ref.option
			};

			return obj;
		}

		function sortItems(a, b){
			return a.start - b.start;
		}

		return (currentList[0] || current).sub;
	};

	/**
	 * Generate statistics about the number of call and the average
	 * duration of each method
	 **/
	spyInterface.statistic = function(){
		var stat = {},
			i = perfMeasured.length,
			obj, st;

		while(i--){
			obj = perfMeasured[i];
			if(st = stat[obj.name]){
				st.duration = (st.duration * st.count + obj.value ) / ++st.count;
				st.min = Math.min(st.min, obj.value);
				st.max = Math.max(st.max, obj.value);
			}else{
				stat[obj.name] = {
					count: 1,
					duration: obj.value,
					min: obj.value,
					max: obj.value
				};
			}
		}

		return stat;
	};

	/**
	 * Add a spy on all methods in the obj
	 *		@{Object} obj: object where methods to spy are located
	 *		@{String} prefix: a description of the object
	 *		@{Array[String]} exclude: list of function name to not spy
	 */
	spyInterface.add = function(obj, prefix, exclude){
		if(obj){
			replaceAll(obj, prefix, exclude);
		}
	};

	/**
	 * Start a measurement
	 * Currently the measurement is only performance log. It is not changing with spyObject.mode
	 * 		@{String} name: name of the measurement
	 *		@{Any} option: additional information to put with the measurement
	 */
	if (typeof performance !== 'undefined') {
		spyInterface.start = function(name, option){
			var obj = {
					name: name,
					option: option
				};

			currentMeasure.push(obj);

			obj.start = performance.now();
		};
	} else {
		//fallback
		spyInterface.start = function(name, option){
			var obj = {
					name: name,
					option: option
				};

			currentMeasure.push(obj);

			obj.start = (new Date()).getTime();
		};
	}

	/**
	 * Stop a measurement
	 *		@{String} name: name of the measurement to stop. It should match the name given with method start
	 */
	if (typeof performance !== 'undefined') {
		spyInterface.stop = function(name){
			var t = performance.now(),
				obj = getLastMeasure(name);
			if(obj){
				obj.value = t - obj.start;
				perfMeasured.push(obj);
			}
		};
	} else {
		spyInterface.stop = function(name){
			var t = (new Date()).getTime(),
				obj = getLastMeasure(name);
			if(obj){
				obj.value = t - obj.start;
				perfMeasured.push(obj);
			}
		};
	}

	/**
	 * Add a measurement with the smallest call. This try to measure performance impact of a spy.
	 */
	if (typeof performance !== 'undefined') {
		spyInterface.test = function (){
			var obj = {
					v: 0,
					f: function(){this.v++;},
					g: function(){this.v++;}
				},
				d1, d2,
				t = performance.now();
			obj.f();
			d1 = performance.now() - t;

			replaceFunc('g', obj, 'TEST');
			t = performance.now();
			obj.g();
			d2 = performance.now() - t;

			if(spyObject.mode !== 'console'){
				obj = perfMeasured.pop();
			}else{
				obj.value = NaN;
			}

			return {
				precision: obj.value - d1,
				timeInSpy: d2 - d1
			};
		};
	} else {
		//fallback
		spyInterface.test = function (){
			var obj = {
					v: 0,
					f: function(){this.v++;},
					g: function(){this.v++;}
				},
				d1, d2,
				t = (new Date()).getTime();
			obj.f();
			d1 = (new Date()).getTime() - t;

			replaceFunc('g', obj, 'TEST');
			t = (new Date()).getTime();
			obj.g();
			d2 = (new Date()).getTime() - t;

			if(spyObject.mode !== 'console'){
				obj = perfMeasured.pop();
			}else{
				obj.value = NaN;
			}

			return {
				precision: obj.value - d1,
				timeInSpy: d2 - d1
			};
		};
	}

	/**
	 * Reset all measurements
	 */
	spyInterface.clear = function(){
		perfMeasured = [];
		currentMeasure = [];
	};

	/**
	 * Add a comment in the trace log
	 * This is currently only supported with performance API
	 *		@{String} comment: name/text of the comment
	 *		@{Any} option: additional information to put with the comment
	 */
	spyInterface.comment = function(comment, option){
		perfMeasured.push({
			name: comment,
			start: performance.now(),
			value: 0,
			option: option
		});
	};
	
	/**
	 * Get the log result of measurements
	 *		@{Boolean} resetStartTime: If true all time takes as reference the smallest value of all logs.
	 */
	spyInterface.getPerfCode = function(resetStartTime){
		var info = [], i, obj,
			stat = spyInterface.statistic();

		for(i in stat){
			if(stat.hasOwnProperty(i)){
				obj = stat[i];
				info.push(i + ': called ' + obj.count + ' times. Average duration: ' + obj.duration.toFixed(3) + 'ms ( ±' + ((obj.max-obj.min)/2).toFixed(3) + 'ms )');
			}
		}

		var perfCode = {
				information: info,
				chrono: spyInterface.timeline(resetStartTime)
			};

		return JSON.stringify(perfCode);
	};

	/**
	 * Get a list of all functions which are currently spied
	 */
	spyInterface.getSpied = function(){
		return functionSpied;
	};

	spyInterface.add(obj, prefix, exclude);
	return spyInterface;
}
