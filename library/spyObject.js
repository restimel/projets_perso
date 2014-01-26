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
 **/ 
function spyObject(obj, prefix){
	prefix = prefix || '';
	var perfMeasured = [];
	
	function replaceAll(obj, prefix){
		var x;
		for(x in obj){
			if(obj.hasOwnProperty(x) && typeof obj[x] === 'function' ){
				replaceFunc(x, obj, prefix);
			}
		}
	}
	
	function replaceFunc(f, obj, prefix){
		var fn = obj[f];
		obj[f] = function(){
			var t = performance.now(),
				r = fn.apply(this, arguments);
			perfMeasured.push({
				name: prefix + '.' + f,
				start: t,
				value: performance.now() - t,
				sub: [],
				option: arguments
			});
			return r;
		};
	}

	var spyInterface = {};

	/**
	 * Generate a timeline collection of method called.
	 * method that are stored in tree when they are called by another spyed method.
	 *		@{Boolean} resetStartTime: if true start property refers to the time since the first call of a method in thi spy
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
			console.log(typeof obj.start)

			ref.sub.forEach(function(item){
				obj.sub.push(copyObj(item));
			})

			obj.sub = obj.sub.sort(sortItems);
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
	//TODO: spyInterface.startMeasure(name)
	//TODO: spyInterface.stopMeasure(name)

	spyInterface.add = function(obj, prefix){
		if(obj){
			replaceAll(obj, prefix);
		}
	};

	spyInterface.clear = function(){
		perfMeasured = [];
	};

	spyInterface.getPerfCode = function(resetStartTime){
		var info = [], i, obj,
			stat = spyInterface.statistic();
		
		for(i in stat){
			obj = stat[i];
			info.push(i + ': called ' + obj.count + ' times. Average duration: ' + obj.duration.toFixed(3) + 'ms ( ±' + ((obj.max-obj.min)/2).toFixed(3) + 'ms )');
		}

		var perfCode = {
				information: info,
				chrono: spyInterface.timeline(resetStartTime)
			};

		return JSON.stringify(perfCode);
	};

	spyInterface.add(obj, prefix);
	return spyInterface;
}
