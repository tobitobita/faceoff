  1 /*!
  2  * NCMB JavaScript SDK
  3  * バージョン: 1.0.0
  4  * ビルト: 2013年9月24日
  5  * http://www.nifty.com
  6  *
  7  * Copyright@ 2013 Nifty, Inc.
  8  * Nifty JavaScript SDKはMITライセンスに従って、自由に配布している。
  9  *
 10  * Includes: Underscore.js
 11  * Copyright 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
 12  * MITライセンスに従ってリリースされている。
 13  */
 14 
 15 (function(root) {
 16   root.NCMB = root.NCMB || {};
 17   root.NCMB.VERSION = "js.1.0.0";
 18 }(this));
 19 
 20 //********************************************** UNDERSCORE *********************************************************//
 21 //     Underscore.js 1.4.4
 22 //     http://underscorejs.org
 23 //     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
 24 //     Underscore may be freely distributed under the MIT license.
 25 
 26 (function() {
 27 
 28   // Baseline setup
 29   // --------------
 30 
 31   // Establish the root object, `window` in the browser, or `global` on the server.
 32   // root オブジェクトを生成（ブラウザーの場合、`window`、サーバーの場合）
 33   var root = this;
 34 
 35   // Save the previous value of the `_` variable.
 36   var previousUnderscore = root._;
 37 
 38   // Establish the object that gets returned to break out of a loop iteration.
 39   var breaker = {};
 40 
 41   // Save bytes in the minified (but not gzipped) version:
 42   var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
 43 
 44   // Create quick reference variables for speed access to core prototypes.
 45   var push             = ArrayProto.push,
 46       slice            = ArrayProto.slice,
 47       concat           = ArrayProto.concat,
 48       toString         = ObjProto.toString,
 49       hasOwnProperty   = ObjProto.hasOwnProperty;
 50 
 51   // All **ECMAScript 5** native function implementations that we hope to use
 52   // are declared here.
 53   var
 54     nativeForEach      = ArrayProto.forEach,
 55     nativeMap          = ArrayProto.map,
 56     nativeReduce       = ArrayProto.reduce,
 57     nativeReduceRight  = ArrayProto.reduceRight,
 58     nativeFilter       = ArrayProto.filter,
 59     nativeEvery        = ArrayProto.every,
 60     nativeSome         = ArrayProto.some,
 61     nativeIndexOf      = ArrayProto.indexOf,
 62     nativeLastIndexOf  = ArrayProto.lastIndexOf,
 63     nativeIsArray      = Array.isArray,
 64     nativeKeys         = Object.keys,
 65     nativeBind         = FuncProto.bind;
 66 
 67   // Create a safe reference to the Underscore object for use below.
 68   var _ = function(obj) {
 69     if (obj instanceof _) return obj;
 70     if (!(this instanceof _)) return new _(obj);
 71     this._wrapped = obj;
 72   };
 73 
 74   // Export the Underscore object for **Node.js**, with
 75   // backwards-compatibility for the old `require()` API. If we're in
 76   // the browser, add `_` as a global object via a string identifier,
 77   // for Closure Compiler "advanced" mode.
 78   if (typeof exports !== 'undefined') {
 79     if (typeof module !== 'undefined' && module.exports) {
 80       exports = module.exports = _;
 81     }
 82     exports._ = _;
 83   } else {
 84     root._ = _;
 85   }
 86 
 87   // Current version.
 88   _.VERSION = '1.4.4';
 89 
 90   // Collection Functions
 91   // --------------------
 92 
 93   // The cornerstone, an `each` implementation, aka `forEach`.
 94   // Handles objects with the built-in `forEach`, arrays, and raw objects.
 95   // Delegates to **ECMAScript 5**'s native `forEach` if available.
 96   var each = _.each = _.forEach = function(obj, iterator, context) {
 97     if (obj == null) return;
 98     if (nativeForEach && obj.forEach === nativeForEach) {
 99       obj.forEach(iterator, context);
100     } else if (obj.length === +obj.length) {
101       for (var i = 0, l = obj.length; i < l; i++) {
102         if (iterator.call(context, obj[i], i, obj) === breaker) return;
103       }
104     } else {
105       for (var key in obj) {
106         if (_.has(obj, key)) {
107           if (iterator.call(context, obj[key], key, obj) === breaker) return;
108         }
109       }
110     }
111   };
112 
113   // Return the results of applying the iterator to each element.
114   // Delegates to **ECMAScript 5**'s native `map` if available.
115   _.map = _.collect = function(obj, iterator, context) {
116     var results = [];
117     if (obj == null) return results;
118     if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
119     each(obj, function(value, index, list) {
120       results[results.length] = iterator.call(context, value, index, list);
121     });
122     return results;
123   };
124 
125   var reduceError = 'Reduce of empty array with no initial value';
126 
127   // **Reduce** builds up a single result from a list of values, aka `inject`,
128   // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
129   _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
130     var initial = arguments.length > 2;
131     if (obj == null) obj = [];
132     if (nativeReduce && obj.reduce === nativeReduce) {
133       if (context) iterator = _.bind(iterator, context);
134       return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
135     }
136     each(obj, function(value, index, list) {
137       if (!initial) {
138         memo = value;
139         initial = true;
140       } else {
141         memo = iterator.call(context, memo, value, index, list);
142       }
143     });
144     if (!initial) throw new TypeError(reduceError);
145     return memo;
146   };
147 
148   // The right-associative version of reduce, also known as `foldr`.
149   // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
150   _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
151     var initial = arguments.length > 2;
152     if (obj == null) obj = [];
153     if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
154       if (context) iterator = _.bind(iterator, context);
155       return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
156     }
157     var length = obj.length;
158     if (length !== +length) {
159       var keys = _.keys(obj);
160       length = keys.length;
161     }
162     each(obj, function(value, index, list) {
163       index = keys ? keys[--length] : --length;
164       if (!initial) {
165         memo = obj[index];
166         initial = true;
167       } else {
168         memo = iterator.call(context, memo, obj[index], index, list);
169       }
170     });
171     if (!initial) throw new TypeError(reduceError);
172     return memo;
173   };
174 
175   // Return the first value which passes a truth test. Aliased as `detect`.
176   _.find = _.detect = function(obj, iterator, context) {
177     var result;
178     any(obj, function(value, index, list) {
179       if (iterator.call(context, value, index, list)) {
180         result = value;
181         return true;
182       }
183     });
184     return result;
185   };
186 
187   // Return all the elements that pass a truth test.
188   // Delegates to **ECMAScript 5**'s native `filter` if available.
189   // Aliased as `select`.
190   _.filter = _.select = function(obj, iterator, context) {
191     var results = [];
192     if (obj == null) return results;
193     if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
194     each(obj, function(value, index, list) {
195       if (iterator.call(context, value, index, list)) results[results.length] = value;
196     });
197     return results;
198   };
199 
200   // Return all the elements for which a truth test fails.
201   _.reject = function(obj, iterator, context) {
202     return _.filter(obj, function(value, index, list) {
203       return !iterator.call(context, value, index, list);
204     }, context);
205   };
206 
207   // Determine whether all of the elements match a truth test.
208   // Delegates to **ECMAScript 5**'s native `every` if available.
209   // Aliased as `all`.
210   _.every = _.all = function(obj, iterator, context) {
211     iterator || (iterator = _.identity);
212     var result = true;
213     if (obj == null) return result;
214     if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
215     each(obj, function(value, index, list) {
216       if (!(result = result && iterator.call(context, value, index, list))) return breaker;
217     });
218     return !!result;
219   };
220 
221   // Determine if at least one element in the object matches a truth test.
222   // Delegates to **ECMAScript 5**'s native `some` if available.
223   // Aliased as `any`.
224   var any = _.some = _.any = function(obj, iterator, context) {
225     iterator || (iterator = _.identity);
226     var result = false;
227     if (obj == null) return result;
228     if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
229     each(obj, function(value, index, list) {
230       if (result || (result = iterator.call(context, value, index, list))) return breaker;
231     });
232     return !!result;
233   };
234 
235   // Determine if the array or object contains a given value (using `===`).
236   // Aliased as `include`.
237   _.contains = _.include = function(obj, target) {
238     if (obj == null) return false;
239     if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
240     return any(obj, function(value) {
241       return value === target;
242     });
243   };
244 
245   // Invoke a method (with arguments) on every item in a collection.
246   _.invoke = function(obj, method) {
247     var args = slice.call(arguments, 2);
248     var isFunc = _.isFunction(method);
249     return _.map(obj, function(value) {
250       return (isFunc ? method : value[method]).apply(value, args);
251     });
252   };
253 
254   // Convenience version of a common use case of `map`: fetching a property.
255   _.pluck = function(obj, key) {
256     return _.map(obj, function(value){ return value[key]; });
257   };
258 
259   // Convenience version of a common use case of `filter`: selecting only objects
260   // containing specific `key:value` pairs.
261   _.where = function(obj, attrs, first) {
262     if (_.isEmpty(attrs)) return first ? null : [];
263     return _[first ? 'find' : 'filter'](obj, function(value) {
264       for (var key in attrs) {
265         if (attrs[key] !== value[key]) return false;
266       }
267       return true;
268     });
269   };
270 
271   // Convenience version of a common use case of `find`: getting the first object
272   // containing specific `key:value` pairs.
273   _.findWhere = function(obj, attrs) {
274     return _.where(obj, attrs, true);
275   };
276 
277   // Return the maximum element or (element-based computation).
278   // Can't optimize arrays of integers longer than 65,535 elements.
279   // See: https://bugs.webkit.org/show_bug.cgi?id=80797
280   _.max = function(obj, iterator, context) {
281     if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
282       return Math.max.apply(Math, obj);
283     }
284     if (!iterator && _.isEmpty(obj)) return -Infinity;
285     var result = {computed : -Infinity, value: -Infinity};
286     each(obj, function(value, index, list) {
287       var computed = iterator ? iterator.call(context, value, index, list) : value;
288       computed >= result.computed && (result = {value : value, computed : computed});
289     });
290     return result.value;
291   };
292 
293   // Return the minimum element (or element-based computation).
294   _.min = function(obj, iterator, context) {
295     if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
296       return Math.min.apply(Math, obj);
297     }
298     if (!iterator && _.isEmpty(obj)) return Infinity;
299     var result = {computed : Infinity, value: Infinity};
300     each(obj, function(value, index, list) {
301       var computed = iterator ? iterator.call(context, value, index, list) : value;
302       computed < result.computed && (result = {value : value, computed : computed});
303     });
304     return result.value;
305   };
306 
307   // Shuffle an array.
308   _.shuffle = function(obj) {
309     var rand;
310     var index = 0;
311     var shuffled = [];
312     each(obj, function(value) {
313       rand = _.random(index++);
314       shuffled[index - 1] = shuffled[rand];
315       shuffled[rand] = value;
316     });
317     return shuffled;
318   };
319 
320   // An internal function to generate lookup iterators.
321   var lookupIterator = function(value) {
322     return _.isFunction(value) ? value : function(obj){ return obj[value]; };
323   };
324 
325   // Sort the object's values by a criterion produced by an iterator.
326   _.sortBy = function(obj, value, context) {
327     var iterator = lookupIterator(value);
328     return _.pluck(_.map(obj, function(value, index, list) {
329       return {
330         value : value,
331         index : index,
332         criteria : iterator.call(context, value, index, list)
333       };
334     }).sort(function(left, right) {
335       var a = left.criteria;
336       var b = right.criteria;
337       if (a !== b) {
338         if (a > b || a === void 0) return 1;
339         if (a < b || b === void 0) return -1;
340       }
341       return left.index < right.index ? -1 : 1;
342     }), 'value');
343   };
344 
345   // An internal function used for aggregate "group by" operations.
346   var group = function(obj, value, context, behavior) {
347     var result = {};
348     var iterator = lookupIterator(value || _.identity);
349     each(obj, function(value, index) {
350       var key = iterator.call(context, value, index, obj);
351       behavior(result, key, value);
352     });
353     return result;
354   };
355 
356   // Groups the object's values by a criterion. Pass either a string attribute
357   // to group by, or a function that returns the criterion.
358   _.groupBy = function(obj, value, context) {
359     return group(obj, value, context, function(result, key, value) {
360       (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
361     });
362   };
363 
364   // Counts instances of an object that group by a certain criterion. Pass
365   // either a string attribute to count by, or a function that returns the
366   // criterion.
367   _.countBy = function(obj, value, context) {
368     return group(obj, value, context, function(result, key) {
369       if (!_.has(result, key)) result[key] = 0;
370       result[key]++;
371     });
372   };
373 
374   // Use a comparator function to figure out the smallest index at which
375   // an object should be inserted so as to maintain order. Uses binary search.
376   _.sortedIndex = function(array, obj, iterator, context) {
377     iterator = iterator == null ? _.identity : lookupIterator(iterator);
378     var value = iterator.call(context, obj);
379     var low = 0, high = array.length;
380     while (low < high) {
381       var mid = (low + high) >>> 1;
382       iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
383     }
384     return low;
385   };
386 
387   // Safely convert anything iterable into a real, live array.
388   _.toArray = function(obj) {
389     if (!obj) return [];
390     if (_.isArray(obj)) return slice.call(obj);
391     if (obj.length === +obj.length) return _.map(obj, _.identity);
392     return _.values(obj);
393   };
394 
395   // Return the number of elements in an object.
396   _.size = function(obj) {
397     if (obj == null) return 0;
398     return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
399   };
400 
401   // Array Functions
402   // ---------------
403 
404   // Get the first element of an array. Passing **n** will return the first N
405   // values in the array. Aliased as `head` and `take`. The **guard** check
406   // allows it to work with `_.map`.
407   _.first = _.head = _.take = function(array, n, guard) {
408     if (array == null) return void 0;
409     return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
410   };
411 
412   // Returns everything but the last entry of the array. Especially useful on
413   // the arguments object. Passing **n** will return all the values in
414   // the array, excluding the last N. The **guard** check allows it to work with
415   // `_.map`.
416   _.initial = function(array, n, guard) {
417     return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
418   };
419 
420   // Get the last element of an array. Passing **n** will return the last N
421   // values in the array. The **guard** check allows it to work with `_.map`.
422   _.last = function(array, n, guard) {
423     if (array == null) return void 0;
424     if ((n != null) && !guard) {
425       return slice.call(array, Math.max(array.length - n, 0));
426     } else {
427       return array[array.length - 1];
428     }
429   };
430 
431   // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
432   // Especially useful on the arguments object. Passing an **n** will return
433   // the rest N values in the array. The **guard**
434   // check allows it to work with `_.map`.
435   _.rest = _.tail = _.drop = function(array, n, guard) {
436     return slice.call(array, (n == null) || guard ? 1 : n);
437   };
438 
439   // Trim out all falsy values from an array.
440   _.compact = function(array) {
441     return _.filter(array, _.identity);
442   };
443 
444   // Internal implementation of a recursive `flatten` function.
445   var flatten = function(input, shallow, output) {
446     each(input, function(value) {
447       if (_.isArray(value)) {
448         shallow ? push.apply(output, value) : flatten(value, shallow, output);
449       } else {
450         output.push(value);
451       }
452     });
453     return output;
454   };
455 
456   // Return a completely flattened version of an array.
457   _.flatten = function(array, shallow) {
458     return flatten(array, shallow, []);
459   };
460 
461   // Return a version of the array that does not contain the specified value(s).
462   _.without = function(array) {
463     return _.difference(array, slice.call(arguments, 1));
464   };
465 
466   // Produce a duplicate-free version of the array. If the array has already
467   // been sorted, you have the option of using a faster algorithm.
468   // Aliased as `unique`.
469   _.uniq = _.unique = function(array, isSorted, iterator, context) {
470     if (_.isFunction(isSorted)) {
471       context = iterator;
472       iterator = isSorted;
473       isSorted = false;
474     }
475     var initial = iterator ? _.map(array, iterator, context) : array;
476     var results = [];
477     var seen = [];
478     each(initial, function(value, index) {
479       if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
480         seen.push(value);
481         results.push(array[index]);
482       }
483     });
484     return results;
485   };
486 
487   // Produce an array that contains the union: each distinct element from all of
488   // the passed-in arrays.
489   _.union = function() {
490     return _.uniq(concat.apply(ArrayProto, arguments));
491   };
492 
493   // Produce an array that contains every item shared between all the
494   // passed-in arrays.
495   _.intersection = function(array) {
496     var rest = slice.call(arguments, 1);
497     return _.filter(_.uniq(array), function(item) {
498       return _.every(rest, function(other) {
499         return _.indexOf(other, item) >= 0;
500       });
501     });
502   };
503 
504   // Take the difference between one array and a number of other arrays.
505   // Only the elements present in just the first array will remain.
506   _.difference = function(array) {
507     var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
508     return _.filter(array, function(value){ return !_.contains(rest, value); });
509   };
510 
511   // Zip together multiple lists into a single array -- elements that share
512   // an index go together.
513   _.zip = function() {
514     var args = slice.call(arguments);
515     var length = _.max(_.pluck(args, 'length'));
516     var results = new Array(length);
517     for (var i = 0; i < length; i++) {
518       results[i] = _.pluck(args, "" + i);
519     }
520     return results;
521   };
522 
523   // Converts lists into objects. Pass either a single array of `[key, value]`
524   // pairs, or two parallel arrays of the same length -- one of keys, and one of
525   // the corresponding values.
526   _.object = function(list, values) {
527     if (list == null) return {};
528     var result = {};
529     for (var i = 0, l = list.length; i < l; i++) {
530       if (values) {
531         result[list[i]] = values[i];
532       } else {
533         result[list[i][0]] = list[i][1];
534       }
535     }
536     return result;
537   };
538 
539   // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
540   // we need this function. Return the position of the first occurrence of an
541   // item in an array, or -1 if the item is not included in the array.
542   // Delegates to **ECMAScript 5**'s native `indexOf` if available.
543   // If the array is large and already in sort order, pass `true`
544   // for **isSorted** to use binary search.
545   _.indexOf = function(array, item, isSorted) {
546     if (array == null) return -1;
547     var i = 0, l = array.length;
548     if (isSorted) {
549       if (typeof isSorted == 'number') {
550         i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
551       } else {
552         i = _.sortedIndex(array, item);
553         return array[i] === item ? i : -1;
554       }
555     }
556     if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
557     for (; i < l; i++) if (array[i] === item) return i;
558     return -1;
559   };
560 
561   // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
562   _.lastIndexOf = function(array, item, from) {
563     if (array == null) return -1;
564     var hasIndex = from != null;
565     if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
566       return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
567     }
568     var i = (hasIndex ? from : array.length);
569     while (i--) if (array[i] === item) return i;
570     return -1;
571   };
572 
573   // Generate an integer Array containing an arithmetic progression. A port of
574   // the native Python `range()` function. See
575   // [the Python documentation](http://docs.python.org/library/functions.html#range).
576   _.range = function(start, stop, step) {
577     if (arguments.length <= 1) {
578       stop = start || 0;
579       start = 0;
580     }
581     step = arguments[2] || 1;
582 
583     var len = Math.max(Math.ceil((stop - start) / step), 0);
584     var idx = 0;
585     var range = new Array(len);
586 
587     while(idx < len) {
588       range[idx++] = start;
589       start += step;
590     }
591 
592     return range;
593   };
594 
595   // Function (ahem) Functions
596   // ------------------
597 
598   // Create a function bound to a given object (assigning `this`, and arguments,
599   // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
600   // available.
601   _.bind = function(func, context) {
602     if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
603     var args = slice.call(arguments, 2);
604     return function() {
605       return func.apply(context, args.concat(slice.call(arguments)));
606     };
607   };
608 
609   // Partially apply a function by creating a version that has had some of its
610   // arguments pre-filled, without changing its dynamic `this` context.
611   _.partial = function(func) {
612     var args = slice.call(arguments, 1);
613     return function() {
614       return func.apply(this, args.concat(slice.call(arguments)));
615     };
616   };
617 
618   // Bind all of an object's methods to that object. Useful for ensuring that
619   // all callbacks defined on an object belong to it.
620   _.bindAll = function(obj) {
621     var funcs = slice.call(arguments, 1);
622     if (funcs.length === 0) funcs = _.functions(obj);
623     each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
624     return obj;
625   };
626 
627   // Memoize an expensive function by storing its results.
628   _.memoize = function(func, hasher) {
629     var memo = {};
630     hasher || (hasher = _.identity);
631     return function() {
632       var key = hasher.apply(this, arguments);
633       return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
634     };
635   };
636 
637   // Delays a function for the given number of milliseconds, and then calls
638   // it with the arguments supplied.
639   _.delay = function(func, wait) {
640     var args = slice.call(arguments, 2);
641     return setTimeout(function(){ return func.apply(null, args); }, wait);
642   };
643 
644   // Defers a function, scheduling it to run after the current call stack has
645   // cleared.
646   _.defer = function(func) {
647     return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
648   };
649 
650   // Returns a function, that, when invoked, will only be triggered at most once
651   // during a given window of time.
652   _.throttle = function(func, wait) {
653     var context, args, timeout, result;
654     var previous = 0;
655     var later = function() {
656       previous = new Date;
657       timeout = null;
658       result = func.apply(context, args);
659     };
660     return function() {
661       var now = new Date;
662       var remaining = wait - (now - previous);
663       context = this;
664       args = arguments;
665       if (remaining <= 0) {
666         clearTimeout(timeout);
667         timeout = null;
668         previous = now;
669         result = func.apply(context, args);
670       } else if (!timeout) {
671         timeout = setTimeout(later, remaining);
672       }
673       return result;
674     };
675   };
676 
677   // Returns a function, that, as long as it continues to be invoked, will not
678   // be triggered. The function will be called after it stops being called for
679   // N milliseconds. If `immediate` is passed, trigger the function on the
680   // leading edge, instead of the trailing.
681   _.debounce = function(func, wait, immediate) {
682     var timeout, result;
683     return function() {
684       var context = this, args = arguments;
685       var later = function() {
686         timeout = null;
687         if (!immediate) result = func.apply(context, args);
688       };
689       var callNow = immediate && !timeout;
690       clearTimeout(timeout);
691       timeout = setTimeout(later, wait);
692       if (callNow) result = func.apply(context, args);
693       return result;
694     };
695   };
696 
697   // Returns a function that will be executed at most one time, no matter how
698   // often you call it. Useful for lazy initialization.
699   _.once = function(func) {
700     var ran = false, memo;
701     return function() {
702       if (ran) return memo;
703       ran = true;
704       memo = func.apply(this, arguments);
705       func = null;
706       return memo;
707     };
708   };
709 
710   // Returns the first function passed as an argument to the second,
711   // allowing you to adjust arguments, run code before and after, and
712   // conditionally execute the original function.
713   _.wrap = function(func, wrapper) {
714     return function() {
715       var args = [func];
716       push.apply(args, arguments);
717       return wrapper.apply(this, args);
718     };
719   };
720 
721   // Returns a function that is the composition of a list of functions, each
722   // consuming the return value of the function that follows.
723   _.compose = function() {
724     var funcs = arguments;
725     return function() {
726       var args = arguments;
727       for (var i = funcs.length - 1; i >= 0; i--) {
728         args = [funcs[i].apply(this, args)];
729       }
730       return args[0];
731     };
732   };
733 
734   // Returns a function that will only be executed after being called N times.
735   _.after = function(times, func) {
736     if (times <= 0) return func();
737     return function() {
738       if (--times < 1) {
739         return func.apply(this, arguments);
740       }
741     };
742   };
743 
744   // Object Functions
745   // ----------------
746 
747   // Retrieve the names of an object's properties.
748   // Delegates to **ECMAScript 5**'s native `Object.keys`
749   _.keys = nativeKeys || function(obj) {
750     if (obj !== Object(obj)) throw new TypeError('Invalid object');
751     var keys = [];
752     for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
753     return keys;
754   };
755 
756   // Retrieve the values of an object's properties.
757   _.values = function(obj) {
758     var values = [];
759     for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
760     return values;
761   };
762 
763   // Convert an object into a list of `[key, value]` pairs.
764   _.pairs = function(obj) {
765     var pairs = [];
766     for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
767     return pairs;
768   };
769 
770   // Invert the keys and values of an object. The values must be serializable.
771   _.invert = function(obj) {
772     var result = {};
773     for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
774     return result;
775   };
776 
777   // Return a sorted list of the function names available on the object.
778   // Aliased as `methods`
779   _.functions = _.methods = function(obj) {
780     var names = [];
781     for (var key in obj) {
782       if (_.isFunction(obj[key])) names.push(key);
783     }
784     return names.sort();
785   };
786 
787   // Extend a given object with all the properties in passed-in object(s).
788   _.extend = function(obj) {
789     each(slice.call(arguments, 1), function(source) {
790       if (source) {
791         for (var prop in source) {
792           obj[prop] = source[prop];
793         }
794       }
795     });
796     return obj;
797   };
798 
799   // Return a copy of the object only containing the whitelisted properties.
800   _.pick = function(obj) {
801     var copy = {};
802     var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
803     each(keys, function(key) {
804       if (key in obj) copy[key] = obj[key];
805     });
806     return copy;
807   };
808 
809    // Return a copy of the object without the blacklisted properties.
810   _.omit = function(obj) {
811     var copy = {};
812     var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
813     for (var key in obj) {
814       if (!_.contains(keys, key)) copy[key] = obj[key];
815     }
816     return copy;
817   };
818 
819   // Fill in a given object with default properties.
820   _.defaults = function(obj) {
821     each(slice.call(arguments, 1), function(source) {
822       if (source) {
823         for (var prop in source) {
824           if (obj[prop] == null) obj[prop] = source[prop];
825         }
826       }
827     });
828     return obj;
829   };
830 
831   // Create a (shallow-cloned) duplicate of an object.
832   _.clone = function(obj) {
833     if (!_.isObject(obj)) return obj;
834     return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
835   };
836 
837   // Invokes interceptor with the obj, and then returns obj.
838   // The primary purpose of this method is to "tap into" a method chain, in
839   // order to perform operations on intermediate results within the chain.
840   _.tap = function(obj, interceptor) {
841     interceptor(obj);
842     return obj;
843   };
844 
845   // Internal recursive comparison function for `isEqual`.
846   var eq = function(a, b, aStack, bStack) {
847     // Identical objects are equal. `0 === -0`, but they aren't identical.
848     // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
849     if (a === b) return a !== 0 || 1 / a == 1 / b;
850     // A strict comparison is necessary because `null == undefined`.
851     if (a == null || b == null) return a === b;
852     // Unwrap any wrapped objects.
853     if (a instanceof _) a = a._wrapped;
854     if (b instanceof _) b = b._wrapped;
855     // Compare `[[Class]]` names.
856     var className = toString.call(a);
857     if (className != toString.call(b)) return false;
858     switch (className) {
859       // Strings, numbers, dates, and booleans are compared by value.
860       case '[object String]':
861         // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
862         // equivalent to `new String("5")`.
863         return a == String(b);
864       case '[object Number]':
865         // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
866         // other numeric values.
867         return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
868       case '[object Date]':
869       case '[object Boolean]':
870         // Coerce dates and booleans to numeric primitive values. Dates are compared by their
871         // millisecond representations. Note that invalid dates with millisecond representations
872         // of `NaN` are not equivalent.
873         return +a == +b;
874       // RegExps are compared by their source patterns and flags.
875       case '[object RegExp]':
876         return a.source == b.source &&
877                a.global == b.global &&
878                a.multiline == b.multiline &&
879                a.ignoreCase == b.ignoreCase;
880     }
881     if (typeof a != 'object' || typeof b != 'object') return false;
882     // Assume equality for cyclic structures. The algorithm for detecting cyclic
883     // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
884     var length = aStack.length;
885     while (length--) {
886       // Linear search. Performance is inversely proportional to the number of
887       // unique nested structures.
888       if (aStack[length] == a) return bStack[length] == b;
889     }
890     // Add the first object to the stack of traversed objects.
891     aStack.push(a);
892     bStack.push(b);
893     var size = 0, result = true;
894     // Recursively compare objects and arrays.
895     if (className == '[object Array]') {
896       // Compare array lengths to determine if a deep comparison is necessary.
897       size = a.length;
898       result = size == b.length;
899       if (result) {
900         // Deep compare the contents, ignoring non-numeric properties.
901         while (size--) {
902           if (!(result = eq(a[size], b[size], aStack, bStack))) break;
903         }
904       }
905     } else {
906       // Objects with different constructors are not equivalent, but `Object`s
907       // from different frames are.
908       var aCtor = a.constructor, bCtor = b.constructor;
909       if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
910                                _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
911         return false;
912       }
913       // Deep compare objects.
914       for (var key in a) {
915         if (_.has(a, key)) {
916           // Count the expected number of properties.
917           size++;
918           // Deep compare each member.
919           if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
920         }
921       }
922       // Ensure that both objects contain the same number of properties.
923       if (result) {
924         for (key in b) {
925           if (_.has(b, key) && !(size--)) break;
926         }
927         result = !size;
928       }
929     }
930     // Remove the first object from the stack of traversed objects.
931     aStack.pop();
932     bStack.pop();
933     return result;
934   };
935 
936   // Perform a deep comparison to check if two objects are equal.
937   _.isEqual = function(a, b) {
938     return eq(a, b, [], []);
939   };
940 
941   // Is a given array, string, or object empty?
942   // An "empty" object has no enumerable own-properties.
943   _.isEmpty = function(obj) {
944     if (obj == null) return true;
945     if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
946     for (var key in obj) if (_.has(obj, key)) return false;
947     return true;
948   };
949 
950   // Is a given value a DOM element?
951   _.isElement = function(obj) {
952     return !!(obj && obj.nodeType === 1);
953   };
954 
955   // Is a given value an array?
956   // Delegates to ECMA5's native Array.isArray
957   _.isArray = nativeIsArray || function(obj) {
958     return toString.call(obj) == '[object Array]';
959   };
960 
961   // Is a given variable an object?
962   _.isObject = function(obj) {
963     return obj === Object(obj);
964   };
965 
966   // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
967   each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
968     _['is' + name] = function(obj) {
969       return toString.call(obj) == '[object ' + name + ']';
970     };
971   });
972 
973   // Define a fallback version of the method in browsers (ahem, IE), where
974   // there isn't any inspectable "Arguments" type.
975   if (!_.isArguments(arguments)) {
976     _.isArguments = function(obj) {
977       return !!(obj && _.has(obj, 'callee'));
978     };
979   }
980 
981   // Optimize `isFunction` if appropriate.
982   if (typeof (/./) !== 'function') {
983     _.isFunction = function(obj) {
984       return typeof obj === 'function';
985     };
986   }
987 
988   // Is a given object a finite number?
989   _.isFinite = function(obj) {
990     return isFinite(obj) && !isNaN(NCMBFloat(obj));
991   };
992 
993   // Is the given value `NaN`? (NaN is the only number which does not equal itself).
994   _.isNaN = function(obj) {
995     return _.isNumber(obj) && obj != +obj;
996   };
997 
998   // Is a given value a boolean?
999   _.isBoolean = function(obj) {
1000     return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
1001   };
1002 
1003   // Is a given value equal to null?
1004   _.isNull = function(obj) {
1005     return obj === null;
1006   };
1007 
1008   // Is a given variable undefined?
1009   _.isUndefined = function(obj) {
1010     return obj === void 0;
1011   };
1012 
1013   // Shortcut function for checking if an object has a given property directly
1014   // on itself (in other words, not on a prototype).
1015   _.has = function(obj, key) {
1016     return hasOwnProperty.call(obj, key);
1017   };
1018 
1019   // Utility Functions
1020   // -----------------
1021 
1022   // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
1023   // previous owner. Returns a reference to the Underscore object.
1024   _.noConflict = function() {
1025     root._ = previousUnderscore;
1026     return this;
1027   };
1028 
1029   // Keep the identity function around for default iterators.
1030   _.identity = function(value) {
1031     return value;
1032   };
1033 
1034   // Run a function **n** times.
1035   _.times = function(n, iterator, context) {
1036     var accum = Array(n);
1037     for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
1038     return accum;
1039   };
1040 
1041   // Return a random integer between min and max (inclusive).
1042   _.random = function(min, max) {
1043     if (max == null) {
1044       max = min;
1045       min = 0;
1046     }
1047     return min + Math.floor(Math.random() * (max - min + 1));
1048   };
1049 
1050   // List of HTML entities for escaping.
1051   var entityMap = {
1052     escape: {
1053       '&': '&',
1054       '<': '<',
1055       '>': '>',
1056       '"': '"',
1057       "'": ''',
1058       '/': '/'
1059     }
1060   };
1061   entityMap.unescape = _.invert(entityMap.escape);
1062 
1063   // Regexes containing the keys and values listed immediately above.
1064   var entityRegexes = {
1065     escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
1066     unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
1067   };
1068 
1069   // Functions for escaping and unescaping strings to/from HTML interpolation.
1070   _.each(['escape', 'unescape'], function(method) {
1071     _[method] = function(string) {
1072       if (string == null) return '';
1073       return ('' + string).replace(entityRegexes[method], function(match) {
1074         return entityMap[method][match];
1075       });
1076     };
1077   });
1078 
1079   // If the value of the named property is a function then invoke it;
1080   // otherwise, return it.
1081   _.result = function(object, property) {
1082     if (object == null) return null;
1083     var value = object[property];
1084     return _.isFunction(value) ? value.call(object) : value;
1085   };
1086 
1087   // Add your own custom functions to the Underscore object.
1088   _.mixin = function(obj) {
1089     each(_.functions(obj), function(name){
1090       var func = _[name] = obj[name];
1091       _.prototype[name] = function() {
1092         var args = [this._wrapped];
1093         push.apply(args, arguments);
1094         return result.call(this, func.apply(_, args));
1095       };
1096     });
1097   };
1098 
1099   // Generate a unique integer id (unique within the entire client session).
1100   // Useful for temporary DOM ids.
1101   var idCounter = 0;
1102   _.uniqueId = function(prefix) {
1103     var id = ++idCounter + '';
1104     return prefix ? prefix + id : id;
1105   };
1106 
1107   // By default, Underscore uses ERB-style template delimiters, change the
1108   // following template settings to use alternative delimiters.
1109   _.templateSettings = {
1110     evaluate    : /<%([\s\S]+?)%>/g,
1111     interpolate : /<%=([\s\S]+?)%>/g,
1112     escape      : /<%-([\s\S]+?)%>/g
1113   };
1114 
1115   // When customizing `templateSettings`, if you don't want to define an
1116   // interpolation, evaluation or escaping regex, we need one that is
1117   // guaranteed not to match.
1118   var noMatch = /(.)^/;
1119 
1120   // Certain characters need to be escaped so that they can be put into a
1121   // string literal.
1122   var escapes = {
1123     "'":      "'",
1124     '\\':     '\\',
1125     '\r':     'r',
1126     '\n':     'n',
1127     '\t':     't',
1128     '\u2028': 'u2028',
1129     '\u2029': 'u2029'
1130   };
1131 
1132   var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
1133 
1134   // JavaScript micro-templating, similar to John Resig's implementation.
1135   // Underscore templating handles arbitrary delimiters, preserves whitespace,
1136   // and correctly escapes quotes within interpolated code.
1137   _.template = function(text, data, settings) {
1138     var render;
1139     settings = _.defaults({}, settings, _.templateSettings);
1140 
1141     // Combine delimiters into one regular expression via alternation.
1142     var matcher = new RegExp([
1143       (settings.escape || noMatch).source,
1144       (settings.interpolate || noMatch).source,
1145       (settings.evaluate || noMatch).source
1146     ].join('|') + '|$', 'g');
1147 
1148     // Compile the template source, escaping string literals appropriately.
1149     var index = 0;
1150     var source = "__p+='";
1151     text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
1152       source += text.slice(index, offset)
1153         .replace(escaper, function(match) { return '\\' + escapes[match]; });
1154 
1155       if (escape) {
1156         source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
1157       }
1158       if (interpolate) {
1159         source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
1160       }
1161       if (evaluate) {
1162         source += "';\n" + evaluate + "\n__p+='";
1163       }
1164       index = offset + match.length;
1165       return match;
1166     });
1167     source += "';\n";
1168 
1169     // If a variable is not specified, place data values in local scope.
1170     if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
1171 
1172     source = "var __t,__p='',__j=Array.prototype.join," +
1173       "print=function(){__p+=__j.call(arguments,'');};\n" +
1174       source + "return __p;\n";
1175 
1176     try {
1177       render = new Function(settings.variable || 'obj', '_', source);
1178     } catch (e) {
1179       e.source = source;
1180       throw e;
1181     }
1182 
1183     if (data) return render(data, _);
1184     var template = function(data) {
1185       return render.call(this, data, _);
1186     };
1187 
1188     // Provide the compiled function source as a convenience for precompilation.
1189     template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
1190 
1191     return template;
1192   };
1193 
1194   // Add a "chain" function, which will delegate to the wrapper.
1195   _.chain = function(obj) {
1196     return _(obj).chain();
1197   };
1198 
1199   // OOP
1200   // ---------------
1201   // If Underscore is called as a function, it returns a wrapped object that
1202   // can be used OO-style. This wrapper holds altered versions of all the
1203   // underscore functions. Wrapped objects may be chained.
1204 
1205   // Helper function to continue chaining intermediate results.
1206   var result = function(obj) {
1207     return this._chain ? _(obj).chain() : obj;
1208   };
1209 
1210   // Add all of the Underscore functions to the wrapper object.
1211   _.mixin(_);
1212 
1213   // Add all mutator Array functions to the wrapper.
1214   each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
1215     var method = ArrayProto[name];
1216     _.prototype[name] = function() {
1217       var obj = this._wrapped;
1218       method.apply(obj, arguments);
1219       if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
1220       return result.call(this, obj);
1221     };
1222   });
1223 
1224   // Add all accessor Array functions to the wrapper.
1225   each(['concat', 'join', 'slice'], function(name) {
1226     var method = ArrayProto[name];
1227     _.prototype[name] = function() {
1228       return result.call(this, method.apply(this._wrapped, arguments));
1229     };
1230   });
1231 
1232   _.extend(_.prototype, {
1233 
1234     // Start chaining a wrapped Underscore object.
1235     chain: function() {
1236       this._chain = true;
1237       return this;
1238     },
1239 
1240     // Extracts the result from a wrapped and chained object.
1241     value: function() {
1242       return this._wrapped;
1243     }
1244 
1245   });
1246 }).call(this);
1247 
1248 //************************************************ SHA256 ENCODE *******************************************************//
1249 //     CryptoJS v3.0.2
1250 //     code.google.com/p/crypto-js
1251 //     (c) 2009-2012 by Jeff Mott. All rights reserved.
1252 //     code.google.com/p/crypto-js/wiki/License
1253 
1254 var CryptoJS = CryptoJS || function (h, i) {
1255         var e = {}, f = e.lib = {}, l = f.Base = function () {
1256                 function a() {}
1257                 return {
1258                     extend: function (j) {
1259                         a.prototype = this;
1260                         var d = new a;
1261                         j && d.mixIn(j);
1262                         d.$super = this;
1263                         return d
1264                     },
1265                     create: function () {
1266                         var a = this.extend();
1267                         a.init.apply(a, arguments);
1268                         return a
1269                     },
1270                     init: function () {},
1271                     mixIn: function (a) {
1272                         for (var d in a) a.hasOwnProperty(d) && (this[d] = a[d]);
1273                         a.hasOwnProperty("toString") && (this.toString = a.toString)
1274                     },
1275                     clone: function () {
1276                         return this.$super.extend(this)
1277                     }
1278                 }
1279             }(),
1280             k = f.WordArray = l.extend({
1281                 init: function (a, j) {
1282                     a =
1283                         this.words = a || [];
1284                     this.sigBytes = j != i ? j : 4 * a.length
1285                 },
1286                 toString: function (a) {
1287                     return (a || m).stringify(this)
1288                 },
1289                 concat: function (a) {
1290                     var j = this.words,
1291                         d = a.words,
1292                         c = this.sigBytes,
1293                         a = a.sigBytes;
1294                     this.clamp();
1295                     if (c % 4)
1296                         for (var b = 0; b < a; b++) j[c + b >>> 2] |= (d[b >>> 2] >>> 24 - 8 * (b % 4) & 255) << 24 - 8 * ((c + b) % 4);
1297                     else if (65535 < d.length)
1298                         for (b = 0; b < a; b += 4) j[c + b >>> 2] = d[b >>> 2];
1299                     else j.push.apply(j, d);
1300                     this.sigBytes += a;
1301                     return this
1302                 },
1303                 clamp: function () {
1304                     var a = this.words,
1305                         b = this.sigBytes;
1306                     a[b >>> 2] &= 4294967295 << 32 - 8 * (b % 4);
1307                     a.length = h.ceil(b / 4)
1308                 },
1309                 clone: function () {
1310                     var a =
1311                         l.clone.call(this);
1312                     a.words = this.words.slice(0);
1313                     return a
1314                 },
1315                 random: function (a) {
1316                     for (var b = [], d = 0; d < a; d += 4) b.push(4294967296 * h.random() | 0);
1317                     return k.create(b, a)
1318                 }
1319             }),
1320             o = e.enc = {}, m = o.Hex = {
1321                 stringify: function (a) {
1322                     for (var b = a.words, a = a.sigBytes, d = [], c = 0; c < a; c++) {
1323                         var e = b[c >>> 2] >>> 24 - 8 * (c % 4) & 255;
1324                         d.push((e >>> 4).toString(16));
1325                         d.push((e & 15).toString(16))
1326                     }
1327                     return d.join("")
1328                 },
1329                 parse: function (a) {
1330                     for (var b = a.length, d = [], c = 0; c < b; c += 2) d[c >>> 3] |= parseInt(a.substr(c, 2), 16) << 24 - 4 * (c % 8);
1331                     return k.create(d, b / 2)
1332                 }
1333             }, q = o.Latin1 = {
1334                 stringify: function (a) {
1335                     for (var b =
1336                         a.words, a = a.sigBytes, d = [], c = 0; c < a; c++) d.push(String.fromCharCode(b[c >>> 2] >>> 24 - 8 * (c % 4) & 255));
1337                     return d.join("")
1338                 },
1339                 parse: function (a) {
1340                     for (var b = a.length, d = [], c = 0; c < b; c++) d[c >>> 2] |= (a.charCodeAt(c) & 255) << 24 - 8 * (c % 4);
1341                     return k.create(d, b)
1342                 }
1343             }, r = o.Utf8 = {
1344                 stringify: function (a) {
1345                     try {
1346                         return decodeURIComponent(escape(q.stringify(a)))
1347                     } catch (b) {
1348                         throw Error("Malformed UTF-8 data");
1349                     }
1350                 },
1351                 parse: function (a) {
1352                     return q.parse(unescape(encodeURIComponent(a)))
1353                 }
1354             }, b = f.BufferedBlockAlgorithm = l.extend({
1355                 reset: function () {
1356                     this._data = k.create();
1357                     this._nDataBytes = 0
1358                 },
1359                 _append: function (a) {
1360                     "string" == typeof a && (a = r.parse(a));
1361                     this._data.concat(a);
1362                     this._nDataBytes += a.sigBytes
1363                 },
1364                 _process: function (a) {
1365                     var b = this._data,
1366                         d = b.words,
1367                         c = b.sigBytes,
1368                         e = this.blockSize,
1369                         g = c / (4 * e),
1370                         g = a ? h.ceil(g) : h.max((g | 0) - this._minBufferSize, 0),
1371                         a = g * e,
1372                         c = h.min(4 * a, c);
1373                     if (a) {
1374                         for (var f = 0; f < a; f += e) this._doProcessBlock(d, f);
1375                         f = d.splice(0, a);
1376                         b.sigBytes -= c
1377                     }
1378                     return k.create(f, c)
1379                 },
1380                 clone: function () {
1381                     var a = l.clone.call(this);
1382                     a._data = this._data.clone();
1383                     return a
1384                 },
1385                 _minBufferSize: 0
1386             });
1387         f.Hasher = b.extend({
1388             init: function () {
1389                 this.reset()
1390             },
1391             reset: function () {
1392                 b.reset.call(this);
1393                 this._doReset()
1394             },
1395             update: function (a) {
1396                 this._append(a);
1397                 this._process();
1398                 return this
1399             },
1400             finalize: function (a) {
1401                 a && this._append(a);
1402                 this._doFinalize();
1403                 return this._hash
1404             },
1405             clone: function () {
1406                 var a = b.clone.call(this);
1407                 a._hash = this._hash.clone();
1408                 return a
1409             },
1410             blockSize: 16,
1411             _createHelper: function (a) {
1412                 return function (b, d) {
1413                     return a.create(d).finalize(b)
1414                 }
1415             },
1416             _createHmacHelper: function (a) {
1417                 return function (b, d) {
1418                     return g.HMAC.create(a, d).finalize(b)
1419                 }
1420             }
1421         });
1422         var g = e.algo = {};
1423         return e
1424     }(Math);
1425 (function (h) {
1426     var i = CryptoJS,
1427         e = i.lib,
1428         f = e.WordArray,
1429         e = e.Hasher,
1430         l = i.algo,
1431         k = [],
1432         o = [];
1433     (function () {
1434         function e(a) {
1435             for (var b = h.sqrt(a), d = 2; d <= b; d++)
1436                 if (!(a % d)) return !1;
1437             return !0
1438         }
1439 
1440         function f(a) {
1441             return 4294967296 * (a - (a | 0)) | 0
1442         }
1443         for (var b = 2, g = 0; 64 > g;) e(b) && (8 > g && (k[g] = f(h.pow(b, 0.5))), o[g] = f(h.pow(b, 1 / 3)), g++), b++
1444     })();
1445     var m = [],
1446         l = l.SHA256 = e.extend({
1447             _doReset: function () {
1448                 this._hash = f.create(k.slice(0))
1449             },
1450             _doProcessBlock: function (e, f) {
1451                 for (var b = this._hash.words, g = b[0], a = b[1], j = b[2], d = b[3], c = b[4], h = b[5], l = b[6], k = b[7], n = 0; 64 >
1452                     n; n++) {
1453                     if (16 > n) m[n] = e[f + n] | 0;
1454                     else {
1455                         var i = m[n - 15],
1456                             p = m[n - 2];
1457                         m[n] = ((i << 25 | i >>> 7) ^ (i << 14 | i >>> 18) ^ i >>> 3) + m[n - 7] + ((p << 15 | p >>> 17) ^ (p << 13 | p >>> 19) ^ p >>> 10) + m[n - 16]
1458                     }
1459                     i = k + ((c << 26 | c >>> 6) ^ (c << 21 | c >>> 11) ^ (c << 7 | c >>> 25)) + (c & h ^ ~c & l) + o[n] + m[n];
1460                     p = ((g << 30 | g >>> 2) ^ (g << 19 | g >>> 13) ^ (g << 10 | g >>> 22)) + (g & a ^ g & j ^ a & j);
1461                     k = l;
1462                     l = h;
1463                     h = c;
1464                     c = d + i | 0;
1465                     d = j;
1466                     j = a;
1467                     a = g;
1468                     g = i + p | 0
1469                 }
1470                 b[0] = b[0] + g | 0;
1471                 b[1] = b[1] + a | 0;
1472                 b[2] = b[2] + j | 0;
1473                 b[3] = b[3] + d | 0;
1474                 b[4] = b[4] + c | 0;
1475                 b[5] = b[5] + h | 0;
1476                 b[6] = b[6] + l | 0;
1477                 b[7] = b[7] + k | 0
1478             },
1479             _doFinalize: function () {
1480                 var e = this._data,
1481                     f = e.words,
1482                     b = 8 * this._nDataBytes,
1483                     g = 8 * e.sigBytes;
1484                 f[g >>> 5] |= 128 << 24 - g % 32;
1485                 f[(g + 64 >>> 9 << 4) + 15] = b;
1486                 e.sigBytes = 4 * f.length;
1487                 this._process()
1488             }
1489         });
1490     i.SHA256 = e._createHelper(l);
1491     i.HmacSHA256 = e._createHmacHelper(l)
1492 })(Math);
1493 (function () {
1494     var h = CryptoJS,
1495         i = h.enc.Utf8;
1496     h.algo.HMAC = h.lib.Base.extend({
1497         init: function (e, f) {
1498             e = this._hasher = e.create();
1499             "string" == typeof f && (f = i.parse(f));
1500             var h = e.blockSize,
1501                 k = 4 * h;
1502             f.sigBytes > k && (f = e.finalize(f));
1503             for (var o = this._oKey = f.clone(), m = this._iKey = f.clone(), q = o.words, r = m.words, b = 0; b < h; b++) q[b] ^= 1549556828, r[b] ^= 909522486;
1504             o.sigBytes = m.sigBytes = k;
1505             this.reset()
1506         },
1507         reset: function () {
1508             var e = this._hasher;
1509             e.reset();
1510             e.update(this._iKey)
1511         },
1512         update: function (e) {
1513             this._hasher.update(e);
1514             return this
1515         },
1516         finalize: function (e) {
1517             var f =
1518                 this._hasher,
1519                 e = f.finalize(e);
1520             f.reset();
1521             return f.finalize(this._oKey.clone().concat(e))
1522         }
1523     })
1524 })();
1525 
1526 //     CryptoJS v3.1.2
1527 //     code.google.com/p/crypto-js
1528 //     (c) 2009-2013 by Jeff Mott. All rights reserved.
1529 //     code.google.com/p/crypto-js/wiki/License
1530 //     http://crypto-js.googlecode.com/svn/tags/3.0.2/build/components/enc-base64.js
1531 
1532 (function () {
1533     // Shortcuts
1534     var C = CryptoJS;
1535     var C_lib = C.lib;
1536     var WordArray = C_lib.WordArray;
1537     var C_enc = C.enc;
1538 
1539     /**
1540      * Base64 encoding strategy.
1541      */
1542     var Base64 = C_enc.Base64 = {
1543         /**
1544          * Converts a word array to a Base64 string.
1545          *
1546          * @param {WordArray} wordArray The word array.
1547          *
1548          * @return {string} The Base64 string.
1549          *
1550          * @static
1551          *
1552          * @example
1553          *
1554          *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
1555          */
1556         stringify: function (wordArray) {
1557             // Shortcuts
1558             var words = wordArray.words;
1559             var sigBytes = wordArray.sigBytes;
1560             var map = this._map;
1561 
1562             // Clamp excess bits
1563             wordArray.clamp();
1564 
1565             // Convert
1566             var base64Chars = [];
1567             for (var i = 0; i < sigBytes; i += 3) {
1568                 var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
1569                 var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
1570                 var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
1571 
1572                 var triplet = (byte1 << 16) | (byte2 << 8) | byte3;
1573 
1574                 for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
1575                     base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
1576                 }
1577             }
1578 
1579             // Add padding
1580             var paddingChar = map.charAt(64);
1581             if (paddingChar) {
1582                 while (base64Chars.length % 4) {
1583                     base64Chars.push(paddingChar);
1584                 }
1585             }
1586 
1587             return base64Chars.join('');
1588         },
1589 
1590         /**
1591          * Converts a Base64 string to a word array.
1592          *
1593          * @param {string} base64Str The Base64 string.
1594          *
1595          * @return {WordArray} The word array.
1596          *
1597          * @static
1598          *
1599          * @example
1600          *
1601          *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
1602          */
1603         parse: function (base64Str) {
1604             // Shortcuts
1605             var base64StrLength = base64Str.length;
1606             var map = this._map;
1607 
1608             // Ignore padding
1609             var paddingChar = map.charAt(64);
1610             if (paddingChar) {
1611                 var paddingIndex = base64Str.indexOf(paddingChar);
1612                 if (paddingIndex != -1) {
1613                     base64StrLength = paddingIndex;
1614                 }
1615             }
1616 
1617             // Convert
1618             var words = [];
1619             var nBytes = 0;
1620             for (var i = 0; i < base64StrLength; i++) {
1621                 if (i % 4) {
1622                     var bits1 = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
1623                     var bits2 = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
1624                     words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
1625                     nBytes++;
1626                 }
1627             }
1628 
1629             return WordArray.create(words, nBytes);
1630         },
1631 
1632         _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
1633     };
1634 }());
1635 
1636 /************************************************* NCMB main class ********************************************/
1637 
1638 (function(root) {
1639   root.NCMB = root.NCMB || {};
1640   /**
1641    * NCMBクラスとメソッドを定義する。
1642    * @name NCMB
1643    * @namespace ネームスペース
1644    *
1645    */
1646   var NCMB = root.NCMB;
1647 
1648   NCMB._ = _.noConflict();
1649   if (typeof(localStorage) !== "undefined") {
1650     NCMB.localStorage = localStorage;
1651   }
1652   if (typeof(XMLHttpRequest) !== "undefined") {
1653     NCMB.XMLHttpRequest = XMLHttpRequest;
1654   }
1655 
1656   // jQuery か Zepto　は生成された場合、参照を取得する
1657   if (typeof($) !== "undefined") {
1658     NCMB.$ = $;
1659   }
1660   
1661   // 空のクラスのコンストラクター、プロトタイプチェイン作成を補助するため。
1662   var EmptyConstructor = function() {};
1663 
1664   // サブクラスのプロトタイプチェインを設定するためヘルパーサービス。
1665   // `goog.inherits`と似ており、プロトタイプとクラスの属性のハッシュを使って、エクステンドさせる。
1666   var inherits = function(parent, protoProps, staticProps) {
1667     var child;
1668 
1669     // 新しいクラスのコンストラクター関数は自分で定義する（`extend`の定義で定義さする"constructor"属性）か、
1670     // デフォルトとして親のコンストラクターを実行させる。
1671     if (protoProps && protoProps.hasOwnProperty('constructor')) {
1672       child = protoProps.constructor;
1673     } else {
1674       /** @ignore */
1675       child = function(){ parent.apply(this, arguments); };
1676     }
1677 
1678     // Inherit class (static) properties from parent.
1679     NCMB._.extend(child, parent);
1680 
1681     // Set the prototype chain to inherit from `parent`, without calling
1682     // `parent`'s constructor function.
1683     EmptyConstructor.prototype = parent.prototype;
1684     child.prototype = new EmptyConstructor();
1685 
1686     // Add prototype properties (instance properties) to the subclass,
1687     // if supplied.
1688     if (protoProps) {
1689       NCMB._.extend(child.prototype, protoProps);
1690     }
1691 
1692     // Add static properties to the constructor function, if supplied.
1693     if (staticProps) {
1694       NCMB._.extend(child, staticProps);
1695     }
1696 
1697     // Correctly set child's `prototype.constructor`.
1698     child.prototype.constructor = child;
1699 
1700     // Set a convenience property in case the parent's prototype is
1701     // needed later.
1702     child.__super__ = parent.prototype;
1703 
1704     return child;
1705   };
1706 
1707   // Set the server for NCMB to talk to. //APIサーバーURL設定
1708   NCMB.serverURL = "https://mb.api.cloud.nifty.com/2013-09-01/";
1709 
1710   /**
1711    * 認証トークンを設定する。コントロールパネルから認証キーを取得してください。
1712    * @param {String} applicationKey アプリケーションキー。
1713    * @param {String} clientKey 　クライントキー。
1714    */
1715   NCMB.initialize = function(applicationKey, clientKey) {
1716     NCMB._initialize(applicationKey, clientKey);
1717   };
1718 
1719   /**
1720    * アプリケーションキーとクライントキーを設定するため、実装する。プライベートで利用する。
1721    * @param {String} applicationKey NCMBのアプリケーションキー
1722    * @param {String} clientKey NCMBのクライントキー
1723    */
1724   NCMB._initialize = function(applicationKey, clientKey) {
1725     NCMB.applicationKey = applicationKey;
1726     NCMB.clientKey = clientKey;
1727   };
1728 
1729   /**
1730    * Local storage　ロカールストレージ利用のため
1731    * NCMBのインスタンスのロカールストレージのプリフィクスprefixを取得。
1732    * @param {String} path 相対的の拡張子のパス。nullかundefinedの場合、空文字列として扱う。
1733    *     
1734    * @return {String} キーのフルの名前。
1735    */
1736   NCMB._getNCMBPath = function(path) {
1737     if (!NCMB.applicationKey) {
1738       throw "You need to call NCMB.initialize before using NCMB.";
1739     }
1740     if (!path) {
1741       path = "";
1742     }
1743     if (!NCMB._.isString(path)) {
1744       throw "Tried to get a localStorage path that wasn't a String.";
1745     }
1746     if (path[0] === "/") {
1747       path = path.substring(1);
1748     }
1749     return "NCMB/" + NCMB.applicationKey + "/" + path;
1750   };
1751 
1752   //　UTC文字列からデートオブジェクトを作成
1753   NCMB._NCMBDate = function(utcString) {
1754     var regexp = new RegExp(
1755       "^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})" + "T" +
1756       "([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})" +
1757       "(.([0-9]+))?" + "Z$");
1758 
1759     var match = regexp.exec(utcString); 
1760     if (!match) {
1761       return null;
1762     }
1763     var year = match[1] || 0;
1764     var month = (match[2] || 1) - 1;  
1765     var day = match[3] || 0;
1766     var hour = match[4] || 0;
1767     var minute = match[5] || 0;
1768     var second = match[6] || 0;
1769     var milli = match[8] || 0;
1770     return new Date(Date.UTC(year, month, day, hour, minute, second, milli));
1771   };
1772 
1773   //アプリケーションキー、クライアントキー、タイムスタンプアクセス用のシグネチャーを作成し取得
1774   NCMB._createSignature = function(route, className, objectId, url, method, timestamp){
1775     var signature = "";
1776     var _applicationKey = NCMB.applicationKey;
1777     var _timestamp = timestamp;
1778     var _clientKey = NCMB.clientKey;
1779 
1780     var _method = method;
1781     var _url = encodeURI(url);
1782     var _tmp = _url.substring(_url.lastIndexOf("//") + 2);
1783     var _fqdn = _tmp.substring(0, _tmp.indexOf("/"));  
1784  
1785     var _position = _url.indexOf("?");
1786     var _path = "";
1787     var _data = {};
1788 
1789     if(_position == -1) {
1790       _path =  _url.substring(_url.lastIndexOf(_fqdn) + _fqdn.length );
1791     }
1792     else{
1793       var _get_parameter= _url.substring(_position + 1);
1794       _path = _url.substring(_url.lastIndexOf(_fqdn) + _fqdn.length, _position);
1795       _tmp = _get_parameter.split("&");
1796       for (var i = 0; i < _tmp.length; i++) {
1797       _position = _tmp[i].indexOf("=");
1798       _data[_tmp[i].substring(0 , _position)] = _tmp[i].substring(_position + 1);
1799       }
1800     }
1801     _data["SignatureMethod"] = "HmacSHA256";
1802     _data["SignatureVersion"] = "2";
1803     _data["X-NCMB-Application-Key"] = _applicationKey;
1804     _data["X-NCMB-Timestamp"] = _timestamp;
1805 
1806     var _sorted_data = {};
1807     var keys = [];
1808     var k, i, len;
1809     for (k in _data)
1810     {
1811       if (_data.hasOwnProperty(k))
1812       {
1813         keys.push(k);
1814       }
1815     }
1816     keys.sort();
1817     len = keys.length;
1818     for (i = 0; i < len; i++)
1819     {
1820       k = keys[i];
1821       _sorted_data[k] = _data[k];
1822     }
1823     var parameterString = "";
1824     for (k in _sorted_data)
1825     {
1826       if (_sorted_data.hasOwnProperty(k))
1827       {
1828         if (parameterString != "") {
1829           parameterString += "&";
1830         };
1831         parameterString = parameterString + k + "=" + _sorted_data[k]; 
1832       }
1833     }
1834     var forEncodeString = _method + "\n" + _fqdn + "\n" + _path + "\n" + parameterString;
1835     var hash = CryptoJS.HmacSHA256(forEncodeString, _clientKey);
1836     var signature = CryptoJS.enc.Base64.stringify(hash);                 
1837     return signature;
1838   }
1839 
1840   // AJAX リクエストを処理するための関数 
1841   NCMB._ajax = function(route, className, method, url, data, signature, timestamp, success, error) {
1842     var options = {
1843       success: success,
1844       error: error
1845     };
1846 
1847     var promise = new NCMB.Promise();
1848     var handled = false;
1849 
1850     var xhr = new NCMB.XMLHttpRequest();
1851     xhr.onreadystatechange = function() {
1852       if (xhr.readyState === 4) {
1853         if (handled) {
1854           return;
1855         }
1856         handled = true;
1857         if (xhr.status >= 200 && xhr.status < 300) {
1858           var response;
1859           try {
1860             if (xhr.responseText) {
1861               if (route != "files" || method != "GET" ||  className == null) { // check the situtation ファイル収得
1862                 response = JSON.parse(xhr.responseText);
1863               } else {
1864                 response = xhr.responseText;
1865               }
1866             } 
1867             else {
1868               response = {};
1869             }
1870           } catch (e) {
1871             promise.reject(e);
1872           }
1873           if (response) {
1874             promise.resolve(response, xhr.status, xhr);
1875           }
1876         } else {
1877           promise.reject(xhr);
1878         }
1879       }
1880     };
1881 
1882     xhr.open(method, url, true); 
1883     xhr.setRequestHeader("X-NCMB-Application-Key", NCMB.applicationKey );
1884     xhr.setRequestHeader("X-NCMB-Timestamp", timestamp);
1885     xhr.setRequestHeader("X-NCMB-Signature", signature);  
1886     //Fileの場合の設定
1887     if( route == "files" && method == "POST") {
1888       var formData = new FormData();
1889       formData.append("file", data.file);
1890       formData.append("acl", data.acl);
1891       xhr.send(formData);
1892     } else {
1893       //そのほかの場合
1894       data = JSON.stringify(data);
1895       xhr.setRequestHeader("Content-Type", "application/json");  // avoid pre-flight. 
1896       xhr.send(data);
1897     }
1898     return promise._thenRunCallbacks(options);
1899   };
1900 
1901   // A self-propagating extend function.
1902   NCMB._extend = function(protoProps, classProps) {
1903     var child = inherits(this, protoProps, classProps);
1904     child.extend = this.extend;
1905     return child;
1906   };
1907 
1908   /**
1909    * route　はclasses, users, loginなどAPIのURLに応じて設定
1910    * objectId　はオブジェクトID
1911    * method REST APIの HTTPのメソッド（GET/POST/PUT）
1912    * dataObject　はデーターオブジェクトかnullのオブジェクト。
1913    * @ignore
1914    */
1915   NCMB._request = function(route, className, objectId, method, dataObject) {
1916     if (!NCMB.applicationKey) {
1917       throw "You must specify your applicationKey using NCMB.initialize";
1918     }
1919 
1920     if ( !NCMB.clientKey ) {
1921       throw "You must specify a key using NCMB.initialize";
1922     }
1923 
1924     //Process route of file/user/push/class
1925     if(className == "file" && route == "classes"){
1926       route = "files";
1927       className = null;
1928     }
1929 
1930     if(className == "user" && route == "classes"){
1931       route = "users";
1932       className = null;
1933     }
1934  
1935     if(className == "push" && route == "classes"){
1936       route = "push";
1937       className = null;
1938     }
1939 
1940     if(className == "role" && route == "classes"){
1941       route = "roles";
1942       className = null;
1943     }
1944     //Check route
1945     if (route !== "classes" &&
1946         route !== "batch" &&
1947         route !== "users" &&
1948         route !== "files" &&
1949         route !== "requestPasswordReset" &&
1950         route !== "mailAddressConfirm" &&
1951         route !== "login" &&
1952         route !== "logout" &&
1953         route !== "push" &&
1954         route !== "roles" &&
1955         route !== "installations"
1956         ) {
1957       throw "Bad route: '" + route + "'.";
1958     }
1959 
1960     var url = NCMB.serverURL;
1961     if (url.charAt(url.length - 1) !== "/") {
1962       url += "/";
1963     }
1964     url += route;
1965     if (className) {
1966       url += "/" + className;
1967     }
1968     if (objectId) {
1969       url += "/" + objectId;
1970     }
1971 
1972     //where, include, order, skip, count, limitの処理 (json data to inUrl parameter)
1973     if(dataObject){
1974       if(dataObject["where"] || dataObject["include"] || dataObject["order"] || dataObject["skip"] || dataObject["count"] || dataObject["limit"] ) {
1975         url += "?";
1976       } 
1977       if(route == "login") {
1978         if(dataObject["userName"] || dataObject["password"]) {
1979           url += "?";
1980         }        
1981       }
1982 
1983       if(dataObject["where"]) {
1984         if (url.charAt(url.length - 1) == '?') {
1985           url += "where=" + JSON.stringify(dataObject["where"]);
1986         } else {
1987           url += "&where=" + JSON.stringify(dataObject["where"]);
1988         }
1989         delete dataObject["where"];
1990       }
1991 
1992       if(dataObject["include"]) {
1993         if (url.charAt(url.length - 1) == '?') {
1994           url += "include=" + dataObject["include"];          
1995         } else {
1996           url += "&include=" + dataObject["include"];
1997         }
1998         delete dataObject["include"];
1999       }
2000 
2001       if(dataObject["order"]) {
2002         if (url.charAt(url.length - 1) == '?') {
2003           url += "order=" + dataObject["order"];
2004         } else {
2005           url += "&order=" + dataObject["order"];
2006         }
2007         delete dataObject["order"];
2008       }
2009 
2010       if(dataObject["skip"]) {
2011         if (url.charAt(url.length - 1) == '?') {
2012           url += "skip=" + JSON.stringify(dataObject["skip"]);
2013         } else {
2014           url += "&skip=" + JSON.stringify(dataObject["skip"]);
2015         }
2016         delete dataObject["skip"];
2017       }
2018 
2019       if(dataObject["count"]) {
2020         if (url.charAt(url.length - 1) == '?') {
2021           url += "count=" + JSON.stringify(dataObject["count"]);
2022         } else {
2023           url += "&count=" + JSON.stringify(dataObject["count"]);
2024         }
2025         delete dataObject["count"];
2026       }
2027 
2028       if(dataObject["limit"]) {
2029         if (url.charAt(url.length - 1) == "?") {
2030           url += "limit=" + JSON.stringify(dataObject["limit"]);
2031         } else {
2032           url += "&limit=" + JSON.stringify(dataObject["limit"]);
2033         }
2034         delete dataObject["limit"];
2035       }
2036 
2037       if(route == "login") {
2038         if(dataObject["userName"]) {
2039           if (url.charAt(url.length - 1) == "?") {
2040             url += "userName=" + dataObject["userName"];
2041           } else {
2042             url += "&userName=" + dataObject["userName"];
2043           }
2044           delete dataObject["userName"];
2045         }
2046 
2047         if(dataObject["password"]) {
2048           if (url.charAt(url.length - 1) == "?") {
2049             url += "password=" + dataObject["password"];
2050           } else {
2051             url += "&password=" + dataObject["password"];
2052           }
2053           delete dataObject["password"];
2054         }        
2055       }
2056     }
2057     var now = new Date();
2058     //Function to check and correct the compatibility of toISOString
2059     if ( !Date.prototype.toISOString ) {
2060       ( function() {
2061         
2062         function pad(number) {
2063           var r = String(number);
2064           if ( r.length === 1 ) {
2065             r = '0' + r;
2066           }
2067           return r;
2068         }
2069      
2070         Date.prototype.toISOString = function() {
2071           return this.getUTCFullYear()
2072             + '-' + pad( this.getUTCMonth() + 1 )
2073             + '-' + pad( this.getUTCDate() )
2074             + 'T' + pad( this.getUTCHours() )
2075             + ':' + pad( this.getUTCMinutes() )
2076             + ':' + pad( this.getUTCSeconds() )
2077             + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
2078             + 'Z';
2079         };
2080       
2081       }() );
2082     }
2083     var timestring = now.toISOString();
2084     while (timestring.indexOf(":") > -1) {
2085       timestring = timestring.replace(":","%3A");
2086     }
2087     var timestamp = timestring;
2088 
2089     //create signature, pass to _ajax()
2090     signature = NCMB._createSignature(route, className, objectId, url, method, timestamp);
2091     var data = dataObject;
2092     return NCMB._ajax(route, className, method, url, data, signature, timestamp).then(null,
2093       function(response) {
2094       // Transform the error into an instance of NCMB.Error by trying to NCMB
2095       // the error string as JSON.
2096       var error;
2097       if (response && response.responseText) {
2098         try {
2099           var errorJSON = JSON.parse(response.responseText);
2100           if (errorJSON) {
2101             error = new NCMB.Error(errorJSON.code, errorJSON.error);
2102           }
2103         } catch (e) {
2104           // If we fail to NCMB the error text, that's okay.
2105         }
2106       }
2107       error = error || new NCMB.Error(-1, response.responseText);
2108       // By explicitly returning a rejected Promise, this will work with
2109       // either jQuery or Promises/A semantics.
2110       return NCMB.Promise.error(error);
2111     });
2112   };
2113 
2114   // Backbonejs 対応するため、Backboneオブジェクトの属性か関数の値を取得するHelper関数
2115 
2116   NCMB._getValue = function(object, prop) {
2117     if (!(object && object[prop])) {
2118       return null;
2119     }
2120     return NCMB._.isFunction(object[prop]) ? object[prop]() : object[prop];
2121   };
2122 
2123   /**
2124    * 
2125    * NCMBオブジェクトの値を適切な表式を変換する関数。
2126    * seenObjectsが不正の場合、JavaのNCMB.maybeReferenceAndEncode(Object)と同等であり、適切な表式に変換する。
2127    * そのほかの場合、seenObjectに含まらないNCMB.Objectは、ポインタとしてエンコードされるより、
2128    * 完全に組み込まれる。この配列は無限ループを防ぐため、使われている。
2129    *
2130    */
2131   NCMB._encode = function(value, seenObjects, disallowObjects) {
2132     var _ = NCMB._;
2133     if (value instanceof NCMB.Object) {
2134       if (disallowObjects) {
2135         throw "NCMB.Objects not allowed here";
2136       }
2137       if (!seenObjects || _.include(seenObjects, value) || !value._hasData) {
2138         return value._toPointer();
2139       }
2140       if (!value.dirty()) {
2141         seenObjects = seenObjects.concat(value);
2142         return NCMB._encode(value._toFullJSON(seenObjects),
2143                              seenObjects,
2144                              disallowObjects);
2145       }
2146       throw "Tried to save an object with a pointer to a new, unsaved object.";
2147     }
2148     if (value instanceof NCMB.ACL) {
2149       return value.toJSON();
2150     }
2151     if (_.isDate(value)) {
2152       return { "__type": "Date", "iso": value.toJSON() };
2153     }
2154     if (_.isArray(value)) {
2155       return _.map(value, function(x) {
2156         return NCMB._encode(x, seenObjects, disallowObjects);
2157       });
2158     }
2159     if (_.isRegExp(value)) {
2160       return value.source;
2161     }
2162     if (value instanceof NCMB.Relation) {
2163       return value.toJSON();
2164     }
2165     if (value instanceof NCMB.Op) {
2166       return value.toJSON();
2167     }
2168     if (value instanceof NCMB.File) {
2169       if (!value.url()) {
2170         throw "Tried to save an object containing an unsaved file.";
2171       }
2172       return {
2173         __type: "File",
2174         name: value.name(),
2175         url: value.url()
2176       };
2177     }
2178     if (_.isObject(value)) {
2179       var output = {};
2180       NCMB._objectEach(value, function(v, k) {
2181         output[k] = NCMB._encode(v, seenObjects, disallowObjects);
2182       });
2183       return output;
2184     }
2185     return value;
2186   };
2187 
2188   /**
2189    * NCMB._encodeの逆関数である。
2190    * TODO: make decode not mutate value.
2191    */
2192   NCMB._decode = function(key, value) {
2193     var _ = NCMB._;
2194     if (key == "authData") {  //認証するためのデーター
2195       return value;
2196     }
2197     if (!_.isObject(value)) {
2198       return value;
2199     }
2200     if (_.isArray(value)) {
2201       NCMB._arrayEach(value, function(v, k) {
2202         value[k] = NCMB._decode(k, v);
2203       });
2204       return value;
2205     }
2206     if (value instanceof NCMB.Object) {
2207       return value;
2208     }
2209     if (value instanceof NCMB.File) {
2210       return value;
2211     }
2212     if (value instanceof NCMB.Op) {
2213       return value;
2214     }
2215     if (value.__op) {
2216       return NCMB.Op._decode(value);
2217     }
2218     if (value.__type === "Pointer") {
2219       var pointer = NCMB.Object._create(value.className);
2220       pointer._finishFetch({ objectId: value.objectId }, false);
2221       return pointer;
2222     }
2223     if (value.__type === "Object") {
2224       // It's an Object included in a query result.
2225       var className = value.className;
2226       delete value.__type;
2227       delete value.className;
2228       var object = NCMB.Object._create(className);
2229       object._finishFetch(value, true);
2230       return object;
2231     }
2232     if (value.__type === "Date") {
2233       return NCMB._NCMBDate(value.iso);
2234     }
2235     if (key === "ACL") {
2236       if (value instanceof NCMB.ACL) {
2237         return value;
2238       }
2239       return new NCMB.ACL(value);
2240     }
2241     if (value.__type === "Relation") {
2242       var relation = new NCMB.Relation(null, key);
2243       relation.targetClassName = value.className;
2244       return relation;
2245     }
2246     if (value.__type === "File") {
2247       var file = new NCMB.File(value.name);
2248       file._url = value.url;
2249       return file;
2250     }
2251     NCMB._objectEach(value, function(v, k) {
2252       value[k] = NCMB._decode(k, v);
2253     });
2254     return value;
2255   };
2256 
2257   NCMB._arrayEach = NCMB._.each;
2258 
2259   /**
2260    * オブジェクトobjectの中の項目を取得し、func関数を実行させる。
2261    * @param {Object} object The object or array to traverse deeply.取得するためのオブジェクトか配列
2262    * @param {Function} それぞれ項目で実行させるfunc 関数。実行した結果は正確の値であれば、
2263    *                   その結果を現在の親コンテイナの項目に切り替える。
2264    * @returns {} object自体で実行した結果を取得
2265    */
2266   NCMB._traverse = function(object, func, seen) {
2267     if (object instanceof NCMB.Object) {
2268       seen = seen || [];
2269       if (NCMB._.indexOf(seen, object) >= 0) {
2270         // We've already visited this object in this call.
2271         return;
2272       }
2273       seen.push(object);
2274       NCMB._traverse(object.attributes, func, seen);
2275       return func(object);
2276     }
2277     if (object instanceof NCMB.Relation || object instanceof NCMB.File) {
2278       // Nothing needs to be done, but we don't want to recurse into the
2279       // object's parent infinitely, so we catch this case.
2280       return func(object);
2281     }
2282     if (NCMB._.isArray(object)) {
2283       NCMB._.each(object, function(child, index) {
2284         var newChild = NCMB._traverse(child, func, seen);
2285         if (newChild) {
2286           object[index] = newChild;
2287         }
2288       });
2289       return func(object);
2290     }
2291     if (NCMB._.isObject(object)) {
2292       NCMB._each(object, function(child, key) {
2293         var newChild = NCMB._traverse(child, func, seen);
2294         if (newChild) {
2295           object[key] = newChild;
2296         }
2297       });
2298       return func(object);
2299     }
2300     return func(object);
2301   };
2302 
2303   /**
2304    * _.eachに似ている、しかし、
2305    * * 配列のようなオブジェクトは利用しない
2306    * * lengthの属性のオブジェクトは問題
2307    */
2308   NCMB._objectEach = NCMB._each = function(obj, callback) {
2309     var _ = NCMB._;
2310     if (_.isObject(obj)) {
2311       _.each(_.keys(obj), function(key) {
2312         callback(obj[key], key);
2313       });
2314     } else {
2315       _.each(obj, callback);
2316     }
2317   };
2318 
2319   // Helper function to check null or undefined.
2320   NCMB._isNullOrUndefined = function(x) {
2321     return NCMB._.isNull(x) || NCMB._.isUndefined(x);
2322   };
2323 
2324   //UUIDを生成するため
2325   NCMB._createUuid = function(){
2326     var S4 = function() {
2327         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
2328     }  
2329     return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4() +S4());
2330   };
2331 }(this));
2332 
2333 /************************************************* NCMB Promise class ********************************************/
2334 
2335 (function(root) {
2336   root.NCMB = root.NCMB || {};
2337   var NCMB = root.NCMB;
2338   var _ = NCMB._;
2339 
2340   /**
2341    * プロミスを実施。プロミスは非同期の処理を行った後に予約したコールバックを呼び出す。
2342    *
2343    * <p>利用例:<pre>
2344    *    query.findAsync().then(function(results) {
2345    *      results[0].set("foo", "bar");
2346    *      return results[0].saveAsync();
2347    *    }).then(function(result) {
2348    *      console.log("Updated " + result.id);
2349    *    });
2350    * </pre></p>
2351    *
2352    * @see NCMB.Promise.prototype.next
2353    * @class
2354    */
2355   NCMB.Promise = function() {
2356     this._resolved = false;
2357     this._rejected = false;
2358     this._resolvedCallbacks = [];
2359     this._rejectedCallbacks = [];
2360   };
2361 
2362   _.extend(NCMB.Promise, /** @lends NCMB.Promise */ {
2363 
2364     /**
2365      * Promiseのオブジェクトであるかどうか判断するための関数である。
2366      * Promiseのインターフェイスを満たすオブジェクトの場合、Trueとして返却する。
2367      * @return {Boolean}
2368      */
2369     is: function(promise) {
2370       if(promise && promise.then && _.isFunction(promise.then))
2371         return promise && promise.then && _.isFunction(promise.then);
2372       else
2373         return false;
2374     },
2375 
2376     /**
2377      * 渡された値で解決された新しいPromiseを返却する。
2378      * @return {NCMB.Promise} 新しいプロミス
2379      */
2380     as: function() {
2381       var promise = new NCMB.Promise();
2382       promise.resolve.apply(promise, arguments);
2383       return promise;
2384     },
2385 
2386     /**
2387      * 新しい失敗Promiseと渡されたErrorを返却する。
2388      * @return {NCMB.Promise} 新しいプロミス
2389      */
2390     error: function() {
2391       var promise = new NCMB.Promise();
2392       promise.reject.apply(promise, arguments);
2393       return promise;
2394     },
2395 
2396     /**
2397     　* すべてpromisesが成功に実行されたら、
2398      * 新しいPromiseを返す。実行したPromisesの中にエラーが発生したら、
2399      * 最後に実行したPromiseのエラーと共に、失敗Promiseとして返す。
2400      * すべて成功した場合、実行した結果の配列と共に成功Promiseとして返す。
2401      * @param {Array} promises 実行する予定Promisesのリスト。
2402      * @return {NCMB.Promise} 新しいPromiseを返却する。
2403      */
2404     when: function(promises) {
2405       // Allow passing in Promises as separate arguments instead of an Array.
2406       var objects;
2407       if (promises && NCMB._isNullOrUndefined(promises.length)) {
2408         objects = arguments;
2409       } else {
2410         objects = promises;
2411       }
2412 
2413       var total = objects.length;
2414       var hadError = false;
2415       var results = [];
2416       var errors = [];
2417       results.length = objects.length;
2418       errors.length = objects.length;
2419 
2420       if (total === 0) {
2421         return NCMB.Promise.as.apply(this, results);
2422       }
2423 
2424       var promise = new NCMB.Promise();
2425 
2426       var resolveOne = function() {
2427         total = total - 1;
2428         if (total === 0) {
2429           if (hadError) {
2430             promise.reject(errors);
2431           } else {
2432             promise.resolve.apply(promise, results);
2433           }
2434         }
2435       };
2436 
2437       NCMB._arrayEach(objects, function(object, i) {
2438         if (NCMB.Promise.is(object)) {
2439           object.then(function(result) {
2440             results[i] = result;
2441             resolveOne();
2442           }, function(error) {
2443             errors[i] = error;
2444             hadError = true;
2445             resolveOne();
2446           });
2447         } else {
2448           results[i] = object;
2449           resolveOne();
2450         }
2451       });
2452 
2453       return promise;
2454     },
2455 
2456     /**
2457      * Runs the given asyncFunction repeatedly, as long as the predicate
2458      * function returns a truthy value. Stops repeating if asyncFunction returns
2459      * a rejected promise.
2460      * @param {Function} predicate should return false when ready to stop.
2461      * @param {Function} asyncFunction should return a Promise.
2462      */
2463     _continueWhile: function(predicate, asyncFunction) {
2464       if (predicate()) {
2465         return asyncFunction().then(function() {
2466           return NCMB.Promise._continueWhile(predicate, asyncFunction);
2467         });
2468       }
2469       return NCMB.Promise.as();
2470     }
2471   });
2472 
2473   _.extend(NCMB.Promise.prototype, /** @lends NCMB.Promise.prototype */ {
2474 
2475     /**
2476      * Promiseを完了させ、成功コールバックを実行させる。
2477      * @param {Object} result コールバックに渡すresult。
2478      */
2479     resolve: function(result) {
2480       if (this._resolved || this._rejected) {
2481         throw "A promise was resolved even though it had already been " +
2482           (this._resolved ? "resolved" : "rejected") + ".";
2483       }
2484       this._resolved = true;
2485       this._result = arguments;
2486       var results = arguments;
2487       NCMB._arrayEach(this._resolvedCallbacks, function(resolvedCallback) {
2488         resolvedCallback.apply(this, results);
2489       });
2490       this._resolvedCallbacks = [];
2491       this._rejectedCallbacks = [];
2492     },
2493 
2494     /**
2495      * Promiseを完了させ、失敗コールバックを実行させる。
2496      * @param {Object} error コールバックに渡すエラー
2497      */
2498     reject: function(error) {
2499       if (this._resolved || this._rejected) {
2500         throw "A promise was rejected even though it had already been " +
2501           (this._resolved ? "resolved" : "rejected") + ".";
2502       }
2503       this._rejected = true;
2504       this._error = error;
2505       NCMB._arrayEach(this._rejectedCallbacks, function(rejectedCallback) {
2506         rejectedCallback(error);
2507       });
2508       this._resolvedCallbacks = [];
2509       this._rejectedCallbacks = [];
2510     },
2511 
2512     /**
2513      * Promiseが終了させた時にコールバックを追加。
2514      * コールバックが完了させた後、新しいPromiseを返却。
2515      * チェイニングをサポートする。
2516      * コールバックがPromiseとして返却する場合、
2517      * thenで実行させるコールバックはcallbackで実行させるPromiseが完成しないと完了できない。
2518      * @param {Function} resolvedCallback プロミスが完成させたら、実行させる関数。
2519      * コールバックが完了すると、"then"で返却されたプロミスが成功させる。
2520      * @param {Function} rejectedCallback プロミスがエラーとして拒否された場合。
2521      * コールバックが完了すると、"then"で返却されたプロミスが成功させる。
2522      * rejectedCallbackがnullか拒否のプロミスとして返却された場合、
2523      * "then"で返却されたプロミスがエラーと拒否される。
2524 
2525      * @return {NCMB.Promise} プロミスが完了したかコールバックが実行させた後の新しい成功させたプロミスを返却する。
2526      * コールバックがプロミスを返却した場合、そのプロミスが完了しない限り、プロミスが完了できない。
2527      */
2528     then: function(resolvedCallback, rejectedCallback) {
2529       var promise = new NCMB.Promise();
2530       var wrappedResolvedCallback = function() {
2531         var result = arguments;
2532         if (resolvedCallback) {
2533           result = [resolvedCallback.apply(this, result)];
2534         }
2535         if (result.length === 1 && NCMB.Promise.is(result[0])) {
2536           result[0].then(function() {
2537             promise.resolve.apply(promise, arguments);
2538           }, function(error) {
2539             promise.reject(error);
2540           });
2541         } else {
2542           promise.resolve.apply(promise, result);
2543         }
2544       };
2545 
2546       var wrappedRejectedCallback = function(error) {
2547         var result = [];
2548         if (rejectedCallback) {
2549           result = [rejectedCallback(error)];
2550           if (result.length === 1 && NCMB.Promise.is(result[0])) {
2551             result[0].then(function() {
2552               promise.resolve.apply(promise, arguments);
2553             }, function(error) {
2554               promise.reject(error);
2555             });
2556           } else {
2557             // A Promises/A+ compliant implementation would call:
2558             // promise.resolve.apply(promise, result);
2559             promise.reject(result[0]);
2560           }
2561         } else {
2562           promise.reject(error);
2563         }
2564       };
2565 
2566       if (this._resolved) {
2567         wrappedResolvedCallback.apply(this, this._result);
2568       } else if (this._rejected) {
2569         wrappedRejectedCallback(this._error);
2570       } else {
2571         this._resolvedCallbacks.push(wrappedResolvedCallback);
2572         this._rejectedCallbacks.push(wrappedRejectedCallback);
2573       }
2574 
2575       return promise;
2576     },
2577 
2578     /**
2579      * Run the given callbacks after this promise is fulfilled.
2580      * @param optionsOrCallback {} A Backbone-style options callback, or a
2581      * callback function. If this is an options object and contains a "model"
2582      * attributes, that will be passed to error callbacks as the first argument.
2583      * @param model {} If truthy, this will be passed as the first result of
2584      * error callbacks. This is for Backbone-compatability.
2585      * @return {NCMB.Promise} A promise that will be resolved after the
2586      * callbacks are run, with the same result as this.
2587      */
2588     _thenRunCallbacks: function(optionsOrCallback, model) {
2589       var options;
2590       if (_.isFunction(optionsOrCallback)) {
2591         var callback = optionsOrCallback;
2592         options = {
2593           success: function(result) {
2594             callback(result, null);
2595           },
2596           error: function(error) {
2597             callback(null, error);
2598           }
2599         };
2600       } else {
2601         options = _.clone(optionsOrCallback);
2602       }
2603       options = options || {};
2604 
2605       return this.then(function(result) {
2606         if (options.success) {
2607           options.success.apply(this, arguments);
2608         } else if (model) {
2609           // When there's no callback, a sync event should be triggered.
2610           model.trigger('sync', model, result, options);
2611         }
2612         return NCMB.Promise.as.apply(NCMB.Promise, arguments);
2613       }, function(error) {
2614         if (options.error) {
2615           if (!_.isUndefined(model)) {
2616             options.error(model, error);
2617           } else {
2618             options.error(error);
2619           }
2620         } else if (model) {
2621           // When there's no error callback, an error event should be triggered.
2622           model.trigger('error', model, error, options);
2623         }
2624         // By explicitly returning a rejected Promise, this will work with
2625         // either jQuery or Promises/A semantics.
2626         return NCMB.Promise.error(error);
2627       });
2628     },
2629 
2630     /**
2631      * Adds a callback function that should be called regardless of whether
2632      * this promise failed or succeeded. The callback will be given either the
2633      * array of results for its first argument, or the error as its second,
2634      * depending on whether this Promise was rejected or resolved. Returns a
2635      * new Promise, like "then" would.
2636      * @param {Function} continuation the callback.
2637      */
2638     _continueWith: function(continuation) {
2639       return this.then(function() {
2640         return continuation(arguments, null);
2641       }, function(error) {
2642         return continuation(null, error);
2643       });
2644     }
2645 
2646   });
2647 }(this));
2648 
2649 /************************************************** NCMB Error class *****************************************/
2650 
2651 (function(root) {
2652   root.NCMB = root.NCMB || {};
2653   var NCMB = root.NCMB;
2654   var _ = NCMB._;
2655 
2656   /**
2657    * 渡されたエラーコードとメッセージから新しいNCMB.Errorのオブジェクトを生成、返却する。
2658    * @param {Number} code <code>NCMB.Error</code>から定義されたエラーコード定数とする。
2659    * @param {String} message エラーの詳細メッセージ
2660    * @class
2661    *
2662    * <p>エラーコールバックに渡されたオブジェクトのために利用する。</p>
2663    */
2664   NCMB.Error = function(code, message) {
2665     this.code = code;
2666     this.message = message;
2667   };
2668 
2669   _.extend(NCMB.Error, /** @lends NCMB.Error */ {
2670     /**
2671      * ほかの原因でのエラーコード。
2672      * @constant
2673      */
2674     OTHER_CAUSE: -1,
2675 
2676     /**
2677      * サーバー問題を発生する関連のエラーコード。
2678      * @constant
2679      */
2680     INTERNAL_SERVER_ERROR: 1,
2681 
2682     /**
2683      * NCMBサーバーの接続問題のエラーコード。
2684      * @constant
2685      */
2686     CONNECTION_FAILED: 100,
2687 
2688     /**
2689      * 指定オブジェクトが存在しないエラーコード。
2690      * @constant
2691      */
2692     OBJECT_NOT_FOUND: 101,
2693 
2694     /**
2695      * オブジェクトか配列にマッチするためのクエリにデータータイプがサポートされていないエラーコード。
2696      * @constant
2697      */
2698     INVALID_QUERY: 102,
2699 
2700     /**
2701      * クラス名が存在しないエラーコード。文字か数字かアンダスコアで始まる文字列が許可される。
2702      * @constant
2703      */
2704     INVALID_CLASS_NAME: 103,
2705 
2706     /**
2707      * 指定オブジェクトIDが存在しないエラーコード。
2708      * @constant
2709      */
2710     MISSING_OBJECT_ID: 104,
2711 
2712     /**
2713      * キーが存在しないエラーコード。文字か数字かアンダスコアで始まる文字列が許可される。
2714      * @constant
2715      */
2716     INVALID_KEY_NAME: 105,
2717 
2718     /**
2719      * 間違うポインターのエラーコード。
2720      * @constant
2721      */
2722     INVALID_POINTER: 106,
2723 
2724     /**
2725      * JSONデーター形式にエラーが発生するエラーコード。
2726      * @constant
2727      */
2728     INVALID_JSON: 107,
2729 
2730     /**
2731      * テスト範囲でアクセスできない機能のエラーコード。
2732      * @constant
2733      */
2734     COMMAND_UNAVAILABLE: 108,
2735 
2736     /**
2737      * NCMBがまだ初期化されていないエラーコード。NCMB.initializeを実行する必要がある。
2738      * @constant
2739      */
2740     NOT_INITIALIZED: 109,
2741 
2742     /**
2743      * フィールドのタイプが適切ではないエラーコード。
2744      * @constant
2745      */
2746     INCORRECT_TYPE: 111,
2747 
2748     /**
2749      * 許可しないチャネル名のエラーコード。
2750      * @constant
2751      */
2752     INVALID_CHANNEL_NAME: 112,
2753 
2754     /**
2755      * プッシュが未設定のエラーコード。
2756      * @constant
2757      */
2758     PUSH_MISCONFIGURED: 115,
2759 
2760     /**
2761      * オブジェクトが大きすぎるのエラーコード。
2762      * @constant
2763      */
2764     OBJECT_TOO_LARGE: 116,
2765 
2766     /**
2767      * ユーザーに許可しない操作のエラーコード。
2768      * @constant
2769      */
2770     OPERATION_FORBIDDEN: 119,
2771 
2772     /**
2773      * キャッシュに結果が見つけていないエラーコード。
2774      * @constant
2775      */
2776     CACHE_MISS: 120,
2777 
2778     /**
2779      * 許可しないキーが使用された時のエラーコード。
2780      * JSONObject.
2781      * @constant
2782      */
2783     INVALID_NESTED_KEY: 121,
2784 
2785     /**
2786      * ファイル名は適切ではない時のエラーコード。
2787      * 文字か数字かアンダスコアで始まる文字列が許可され、キャラクター数は1~128である。
2788      * @constant
2789      */
2790     INVALID_FILE_NAME: 122,
2791 
2792     /**
2793      * 許可しないACLのエラーコード。
2794      * @constant
2795      */
2796     INVALID_ACL: 123,
2797 
2798     /**
2799      * サーバーリクエストのタイムアウトエラーコード。
2800      * @constant
2801      */
2802     TIMEOUT: 124,
2803 
2804     /**
2805      * 許可しないメールアドレスのエラーコード。
2806      * @constant
2807      */
2808     INVALID_EMAIL_ADDRESS: 125,
2809 
2810     /**
2811      * コンテンツタイプが不足のエラーコード。
2812      * @constant
2813      */
2814     MISSING_CONTENT_TYPE: 126,
2815 
2816     /**
2817      * コンテンツの長さが不足のエラーコード。
2818      * @constant
2819      */
2820     MISSING_CONTENT_LENGTH: 127,
2821 
2822     /**
2823      * コンテンツの長さが許可しないのエラーコード。
2824      * @constant
2825      */
2826     INVALID_CONTENT_LENGTH: 128,
2827 
2828     /**
2829      * ファイルが大きすぎのエラーコード。
2830      * @constant
2831      */
2832     FILE_TOO_LARGE: 129,
2833 
2834     /**
2835      * ファイルを保存するのエラーコード。
2836      * @constant
2837      */
2838     FILE_SAVE_ERROR: 130,
2839 
2840     /**
2841      * ファイルを削除するのエラーコード。
2842      * @constant
2843      */
2844     FILE_DELETE_ERROR: 153,
2845 
2846     /**
2847      * ユニックのフィールドにわたされた値が存在するのエラーコード。
2848      * @constant
2849      */
2850     DUPLICATE_VALUE: 137,
2851 
2852     /**
2853      * ロール名が許可しないのエラーコード。
2854      * @constant
2855      */
2856     INVALID_ROLE_NAME: 139,
2857 
2858     /**
2859      * 定量に超えたのエラーコード。アップグレードが必要である。
2860      * @constant
2861      */
2862     EXCEEDED_QUOTA: 140,
2863 
2864     /**
2865      * イメージデーターが許可されないのエラーコード。
2866      * @constant
2867      */
2868     INVALID_IMAGE_DATA: 150,
2869 
2870     /**
2871      * ファイルを保存する時のエラーコード。
2872      * @constant
2873      */
2874     UNSAVED_FILE_ERROR: 151,
2875 
2876     /**
2877      * プッシュの時間関連のエラーコード。
2878      */
2879     INVALID_PUSH_TIME_ERROR: 152,
2880 
2881     /**
2882      * ユーザー名が不足のエラーコード。
2883      * @constant
2884      */
2885     USERNAME_MISSING: 200,
2886 
2887     /**
2888      * パスワードが不足のエラーコード。
2889      * @constant
2890      */
2891     PASSWORD_MISSING: 201,
2892 
2893     /**
2894      * ユーザー名がすでに存在しているのエラーコード。
2895      * @constant
2896      */
2897     USERNAME_TAKEN: 202,
2898 
2899     /**
2900      * メールアドレスがすでに存在するのエラーコード。
2901      * @constant
2902      */
2903     EMAIL_TAKEN: 203,
2904 
2905     /**
2906      * メールアドレスが不足のエラーコード。指定が必要である。
2907      * @constant
2908      */
2909     EMAIL_MISSING: 204,
2910 
2911     /**
2912      * Error code indicating that メールアドレスが見つからないのエラーコード。
2913      * @constant
2914      */
2915     EMAIL_NOT_FOUND: 205,
2916 
2917     /**
2918      * 許可するセッションのエラーコード。
2919      * @constant
2920      */
2921     SESSION_MISSING: 206,
2922 
2923     /**
2924      * サインアップしない、作成されたユーザーのエラーコード。
2925      * @constant
2926      */
2927     MUST_CREATE_USER_THROUGH_SIGNUP: 207,
2928 
2929     /**
2930      * リンクしようアカウントがリンクされたのエラーコード。
2931      * @constant
2932      */
2933     ACCOUNT_ALREADY_LINKED: 208,
2934 
2935     /**
2936      * アカウントIDが不足のためリンクができないのエラーコード。
2937      * @constant
2938      */
2939     LINKED_ID_MISSING: 250,
2940 
2941     /**
2942      * リンクされたアカウントに許可しないセッションのエラーコード。
2943      * @constant
2944      */
2945     INVALID_LINKED_SESSION: 251,
2946 
2947     /**
2948      * リンクするサービスがサポートされていないのエラーコード。
2949      * @constant
2950      */
2951     UNSUPPORTED_SERVICE: 252
2952   });
2953 }(this));
2954 
2955 /************************************************** NCMB Events class *****************************************/
2956 
2957 /*global _: false */
2958 (function() {
2959   var root = this;
2960   var NCMB = (root.NCMB || (root.NCMB = {}));
2961   var eventSplitter = /\s+/;
2962   var slice = Array.prototype.slice;
2963   
2964   /**
2965    * @class
2966    *
2967    * <p>NCMB.EventsはBackboneのEventsモジュールの分枝。</p>
2968    *
2969    * <p>このモジュールはどんなオブジェクトでも組み合わせ、
2970    * オブジェクトのイベントをカスタマイズすることができる。　
2971    * イベントに'on'にコールバック関数を追加し、'off'に関数を削除する。
2972    *　イベントを発火させると、'on'からの順番ですべてコールバックが起こさせる。
2973    *
2974    * <pre>
2975    *     var object = {};
2976    *     _.extend(object, NCMB.Events);
2977    *     object.on('expand', function(){ alert('expanded'); });
2978    *     object.trigger('expand');</pre></p>
2979    *
2980    * <p>詳細はこちらでご確認ください。
2981    * <a href="http://documentcloud.github.com/backbone/#Events">Backbone
2982    * documentation</a>.</p>
2983    */
2984   NCMB.Events = {
2985     /**
2986      * スペースで区別するイベントのリスト'events'をコールバックcallbackにバインドする。
2987      *　'all'を渡せる場合、すべてイベントが発生すると、コールバックがバインドされる。
2988      */
2989     on: function(events, callback, context) {
2990 
2991       var calls, event, node, tail, list;
2992       if (!callback) {
2993         return this;
2994       }
2995       events = events.split(eventSplitter);
2996       calls = this._callbacks || (this._callbacks = {});
2997 
2998       // Create an immutable callback list, allowing traversal during
2999       // modification.  The tail is an empty object that will always be used
3000       // as the next node.
3001       event = events.shift();
3002       while (event) {
3003         list = calls[event];
3004         node = list ? list.tail : {};
3005         node.next = tail = {};
3006         node.context = context;
3007         node.callback = callback;
3008         calls[event] = {tail: tail, next: list ? list.next : node};
3009         event = events.shift();
3010       }
3011 
3012       return this;
3013     },
3014 
3015     /**
3016      * コールバックを取り除く関数。'context'がnullの場合、functionのコールバックをすべて取り除く。
3017      *'callback'がnullの場合、イベントのコールバックをすべて取り除く。
3018      * 'events'がnullの場合、すべてのイベントのすべてコールバックを取り除く。
3019      */
3020     off: function(events, callback, context) {
3021       var event, calls, node, tail, cb, ctx;
3022       
3023       // No events, or removing *all* events.
3024       if (!(calls = this._callbacks)) {
3025         return;
3026       }
3027       if (!(events || callback || context)) {
3028         delete this._callbacks;
3029         return this;
3030       }
3031 
3032       // Loop through the listed events and contexts, splicing them out of the
3033       // linked list of callbacks if appropriate.
3034       events = events ? events.split(eventSplitter) : _.keys(calls);
3035       event = events.shift();
3036       while (event) {
3037         node = calls[event];
3038         delete calls[event];
3039         if (!node || !(callback || context)) {
3040           continue;
3041         }
3042         // Create a new list, omitting the indicated callbacks.
3043         tail = node.tail;
3044         node = node.next;
3045         while (node !== tail) {
3046           cb = node.callback;
3047           ctx = node.context;
3048           if ((callback && cb !== callback) || (context && ctx !== context)) {
3049             this.on(event, cb, ctx);
3050           }
3051           node = node.next;
3052         }
3053         event = events.shift();
3054       }
3055       return this;
3056     },
3057 
3058     /**
3059      * 一つか複数イベントを発火し、コールバックを起こさせる。
3060      *　イベント名以外コールバックは'trigger'と同じ変数が渡される。
3061      * 'all'のイベントを待つ場合、本当の名前を一番目の変数としてもらう。
3062      */
3063     trigger: function(events) {
3064       var event, node, calls, tail, args, all, rest;
3065       if (!(calls = this._callbacks)) {
3066         return this;
3067       }
3068       all = calls.all;
3069       events = events.split(eventSplitter);
3070       rest = slice.call(arguments, 1);
3071 
3072       // For each event, walk through the linked list of callbacks twice,
3073       // first to trigger the event, then to trigger any `"all"` callbacks.
3074       event = events.shift();
3075       while (event) {
3076         node = calls[event];
3077         if (node) {
3078           tail = node.tail;
3079           while ((node = node.next) !== tail) {
3080             node.callback.apply(node.context || this, rest);
3081           }
3082         }
3083         node = all;
3084         if (node) {
3085           tail = node.tail;
3086           args = [event].concat(rest);
3087           while ((node = node.next) !== tail) {
3088             node.callback.apply(node.context || this, args);
3089           }
3090         }
3091         event = events.shift();
3092       }
3093 
3094       return this;
3095     }
3096   };  
3097 
3098   /**
3099    * @function
3100    */
3101   NCMB.Events.bind = NCMB.Events.on;
3102 
3103   /**
3104    * @function
3105    */
3106   NCMB.Events.unbind = NCMB.Events.off;
3107 }.call(this));
3108 
3109 /************************************************** NCMB Object class *****************************************/
3110 
3111 // JAVAのNCMBObjectを対応するクラス。Backboneのモデルと同じインターフェースを実施するクラス。
3112 
3113 (function(root) {
3114   root.NCMB = root.NCMB || {};
3115   var NCMB = root.NCMB;
3116   var _ = NCMB._;
3117 
3118   /**
3119    * 定義された属性からモデルを作成する。
3120    * クライアントid(cid)は自動的に生成され、渡される。
3121    *
3122    * <p>普段は直接メソッド利用しない。 
3123    * <code>extend</code>を使用し、<code>NCMB.Object</code>サブクラスを使用することがお勧めする。</p>
3124    *
3125    * <p>サブクラスを利用したくない場合、以下のフォーマットを利用することができる:
3126    * <pre>
3127    *     var object = new NCMB.Object("ClassName");
3128    * </pre>
3129    * 次の利用方法と同じである:<pre>
3130    *     var MyClass = NCMB.Object.extend("ClassName");
3131    *     var object = new MyClass();
3132    * </pre></p>
3133    *
3134    * @param {Object} attributes オブジェクトに保存するための初期データーセット
3135    * @param {Object} options オブジェクトを作成するに当たって、Backbone対応オプションセット。
3136    *                 現時点、"collection"のみサポートしていない。
3137    * @see NCMB.Object.extend
3138    *
3139    * @class
3140    *
3141    * <p>Backboneモデルインターフェイスを実行するNCMBデータの基本クラス。</p>
3142    */
3143   NCMB.Object = function(attributes, options) {
3144     // 新しいNCMB.Object("ClassName")のショートカットを作成。
3145     if (_.isString(attributes)) { 
3146       return NCMB.Object._create.apply(this, arguments);
3147     }
3148 
3149     attributes = attributes || {};
3150     if (options && options.parse) {
3151       attributes = this.parse(attributes);
3152     }
3153     var defaults = NCMB._getValue(this, 'defaults');
3154     if (defaults) {
3155       attributes = _.extend({}, defaults, attributes);
3156     }
3157     if (options && options.collection) {
3158       this.collection = options.collection;
3159     }
3160 
3161     this._serverData = {};  // The last known data for this object from cloud.
3162     this._opSetQueue = [{}];  // List of sets of changes to the data.
3163     this.attributes = {};  // The best estimate of this's current data.
3164 
3165     this._hashedJSON = {};  // Hash of values of containers at last save.
3166     this._escapedAttributes = {};
3167     this.cid = _.uniqueId('c');
3168     this.changed = {};
3169     this._silent = {};
3170     this._pending = {};
3171     if (!this.set(attributes, {silent: true})) {
3172       throw new Error("Can't create an invalid NCMB.Object");
3173     }
3174     this.changed = {};
3175     this._silent = {};
3176     this._pending = {};
3177     this._hasData = true;
3178     this._previousAttributes = _.clone(this.attributes);
3179     this.initialize.apply(this, arguments);
3180   };
3181 
3182   /**
3183    * @lends NCMB.Object.prototype
3184    * @property {String} id Object.NCMBオブジェクトのObjectId
3185    */
3186 
3187   /**
3188    * NCMB.Objectのオブジェクトリストを保存する。
3189    * エラーがある場合、エラー処理を実行する。
3190    *　使用方法は二つがある。
3191    * 
3192    *
3193    * Backboneのような方法：<pre>
3194    *   NCMB.Object.saveAll([object1, object2, ...], {
3195    *     success: function(list) {
3196    *       // All the objects were saved.
3197    *     },
3198    *     error: function(error) {
3199    *       // An error occurred while saving one of the objects.
3200    *     },
3201    *   });
3202    * </pre>
3203    * 簡易化方法：
3204    * <pre>
3205    *   NCMB.Object.saveAll([object1, object2, ...], function(list, error) {
3206    *     if (list) {
3207    *       // All the objects were saved.
3208    *     } else {
3209    *       // An error occurred.
3210    *     }
3211    *   });
3212    * </pre>
3213    *
3214    * @param {Array} list <code>NCMB.Object</code>のリスト。
3215    * @param {Object} options Backboneスタイルのコールバックオブジェクト。
3216    */
3217   NCMB.Object.saveAll = function(list, options) {
3218     return NCMB.Object._deepSaveAsync(list)._thenRunCallbacks(options);
3219   };
3220 
3221   // Attach all inheritable methods to the NCMB.Object prototype.
3222   _.extend(NCMB.Object.prototype, NCMB.Events,
3223     /** @lends NCMB.Object.prototype */ 
3224     {
3225     _existed: false,
3226 
3227     /**
3228      * 初期化関数のデフォルトは空関数。好みの初期化ロジックはここで設定し、関数をオーバーライドしてください。
3229      */
3230     initialize: function(){},
3231 
3232     /**
3233      * NCMBに保存するため、オブジェクトのJSONバージョンとして返却
3234      * @return {Object}
3235      */
3236     toJSON: function() {
3237       var json = this._toFullJSON();
3238       NCMB._arrayEach(["__type", "className"],
3239                        function(key) { delete json[key]; });
3240       return json;
3241     },
3242 
3243     _toFullJSON: function(seenObjects) {
3244       var json = _.clone(this.attributes);
3245       NCMB._objectEach(json, function(val, key) {
3246         json[key] = NCMB._encode(val, seenObjects);
3247       });
3248       NCMB._objectEach(this._operations, function(val, key) {
3249         json[key] = val;
3250       });
3251 
3252       if (_.has(this, "id")) {
3253         json.objectId = this.id;
3254       }
3255       if (_.has(this, "createdAt")) {
3256         if (_.isDate(this.createdAt)) {
3257           json.createdAt = this.createdAt.toJSON();
3258         } else {
3259           json.createdAt = this.createdAt;
3260         }
3261       }
3262 
3263       if (_.has(this, "updatedAt")) {
3264         if (_.isDate(this.updatedAt)) {
3265           json.updatedAt = this.updatedAt.toJSON();
3266         } else {
3267           json.updatedAt = this.updatedAt;
3268         }
3269       }
3270       json.__type = "Object";
3271       json.className = this.className;
3272       return json;
3273     },
3274 
3275     /**
3276      * _hashedJSONを更新し、現在のオブジェクト状態を反映する。
3277      * 未完了変更のセットに変更されたハッシュ値を追加する。
3278      */
3279     _refreshCache: function() {
3280       var self = this;
3281       if (self._refreshingCache) {
3282         return;
3283       }
3284       self._refreshingCache = true;
3285       NCMB._objectEach(this.attributes, function(value, key) {
3286         if (value instanceof NCMB.Object) {
3287           value._refreshCache();
3288         } else if (_.isObject(value)) {
3289           if (self._resetCacheForKey(key)) {
3290             self.set(key, new NCMB.Op.Set(value), { silent: true });
3291           }
3292         }
3293       });
3294       delete self._refreshingCache;
3295     },
3296 
3297     /**
3298      * 最後の保存・リフレッシュした時からオブジェクトが変更された場合trueを返却
3299      * 属性が指定された場合、その属性が変更されたら、trueとして返却する。
3300      * @param {String} key 属性の名前（任意）
3301      * @return {Boolean}
3302      */
3303     dirty: function(key) {
3304       this._refreshCache();
3305 
3306       var currentChanges = _.last(this._opSetQueue);
3307 
3308       if (key) {
3309         return (currentChanges[key] ? true : false);
3310       }
3311       if (!this.id) {
3312         return true;
3313       }
3314       if (_.keys(currentChanges).length > 0) {
3315         return true;
3316       }
3317       return false;
3318     },
3319 
3320     /**
3321      * オブジェクトに参照するポインター。
3322      */
3323     _toPointer: function() {
3324       if (!this.id) {
3325         throw new Error("Can't serialize an unsaved NCMB.Object");
3326       }
3327       return { __type: "Pointer",
3328                className: this.className,
3329                objectId: this.id };
3330     },
3331 
3332     /**
3333      * 属性に対する値を返却する。
3334      * @param {String} key 属性の名前
3335      */
3336     get: function(key) {
3337       return this.attributes[key];
3338     },
3339 
3340     /**
3341      * オブジェクトの属性に対する関連オブジェクトを返却する。
3342      * @param String key 関連を取るための属性
3343      */
3344     relation: function(key) {
3345       var value = this.get(key);
3346       if (value) {    
3347         if (!(value instanceof NCMB.Relation)) {
3348           throw "Called relation() on non-relation field " + key;
3349         }
3350         value._ensureParentAndKey(this, key);
3351         return value;
3352       } else {
3353         return new NCMB.Relation(this, key);
3354       }
3355     },
3356 
3357     /**
3358      * 指定した属性のHTML-エスケープ値を取得
3359      */
3360     escape: function(key) {
3361       var html = this._escapedAttributes[key];
3362       if (html) {
3363         return html;
3364       }
3365       var val = this.attributes[key];
3366       var escaped;
3367       if (NCMB._isNullOrUndefined(val)) {
3368         escaped = '';
3369       } else {
3370         escaped = _.escape(val.toString());
3371       }
3372       this._escapedAttributes[key] = escaped;
3373       return escaped;
3374     },
3375 
3376     /**
3377      * nullかundefinedではない値を持っている属性が存在する場合、<code>true</code>として返却する。
3378      * @param {String} key 属性の名前
3379      * @return {Boolean}
3380      */
3381     has: function(key) {
3382       return !NCMB._isNullOrUndefined(this.attributes[key]);
3383     },
3384 
3385     /**
3386      * objectId, createdAtのような特別なフィールドを取だし、
3387      * 現在のオブジェクトに直接追加する。
3388      * @param attrs - このNCMB.Objectのデータ辞書
3389      */
3390     _mergeMagicFields: function(attrs) {
3391       // Check for changes of magic fields.
3392       var model = this;
3393       var specialFields = ["id", "objectId", "createdAt", "updatedAt"];
3394       NCMB._arrayEach(specialFields, function(attr) {
3395         if (attrs[attr]) {
3396           if (attr === "objectId") {
3397             model.id = attrs[attr];
3398           } else if ((attr === "createdAt" || attr === "updatedAt") &&
3399                      !_.isDate(attrs[attr])) {
3400             model[attr] = NCMB._NCMBDate(attrs[attr]);
3401           } else {
3402             model[attr] = attrs[attr];
3403           }
3404           delete attrs[attr];
3405         }
3406       });
3407     },
3408 
3409     /**
3410      * Returns the json to be sent to the server.
3411      */
3412     _startSave: function() {
3413       this._opSetQueue.push({});
3414     },
3415 
3416     /**
3417      * Called when a save fails because of an error. Any changes that were part
3418      * of the save need to be merged with changes made after the save. This
3419      * might throw an exception is you do conflicting operations. For example,
3420      * if you do:
3421      *   object.set("foo", "bar");
3422      *   object.set("invalid field name", "baz");
3423      *   object.save();
3424      *   object.increment("foo");
3425      * then this will throw when the save fails and the client tries to merge
3426      * "bar" with the +1.
3427      */
3428     _cancelSave: function() {
3429       var self = this;
3430       var failedChanges = _.first(this._opSetQueue);
3431       this._opSetQueue = _.rest(this._opSetQueue);
3432       var nextChanges = _.first(this._opSetQueue);
3433       NCMB._objectEach(failedChanges, function(op, key) {
3434         var op1 = failedChanges[key];
3435         var op2 = nextChanges[key];
3436         if (op1 && op2) {
3437           nextChanges[key] = op2._mergeWithPrevious(op1);
3438         } else if (op1) {
3439           nextChanges[key] = op1;
3440         }
3441       });
3442       this._saving = this._saving - 1;
3443     },
3444 
3445     /**
3446      * Called when a save completes successfully. This merges the changes that
3447      * were saved into the known server data, and overrides it with any data
3448      * sent directly from the server.
3449      */
3450     _finishSave: function(serverData) {
3451       // Grab a copy of any object referenced by this object. These instances
3452       // may have already been fetched, and we don't want to lose their data.
3453       // Note that doing it like this means we will unify separate copies of the
3454       // same object, but that's a risk we have to take.
3455       var fetchedObjects = {};
3456       NCMB._traverse(this.attributes, function(object) {
3457         if (object instanceof NCMB.Object && object.id && object._hasData) {
3458           fetchedObjects[object.id] = object;
3459         }
3460       });
3461 
3462       var savedChanges = _.first(this._opSetQueue);
3463       this._opSetQueue = _.rest(this._opSetQueue);
3464       this._applyOpSet(savedChanges, this._serverData);
3465       this._mergeMagicFields(serverData);
3466       var self = this;
3467       NCMB._objectEach(serverData, function(value, key) {
3468         self._serverData[key] = NCMB._decode(key, value);
3469 
3470         // Look for any objects that might have become unfetched and fix them
3471         // by replacing their values with the previously observed values.
3472         var fetched = NCMB._traverse(self._serverData[key], function(object) {
3473           if (object instanceof NCMB.Object && fetchedObjects[object.id]) {
3474             return fetchedObjects[object.id];
3475           }
3476         });
3477         if (fetched) {
3478           self._serverData[key] = fetched;
3479         }
3480       });
3481       this._rebuildAllEstimatedData();
3482       this._saving = this._saving - 1;
3483     },
3484 
3485     /**
3486      * Called when a fetch or login is complete to set the known server data to
3487      * the given object.
3488      */
3489     _finishFetch: function(serverData, hasData) {
3490       // Clear out any changes the user might have made previously.
3491       this._opSetQueue = [{}];
3492 
3493       // Bring in all the new server data.
3494       this._mergeMagicFields(serverData);
3495       var self = this;
3496       NCMB._objectEach(serverData, function(value, key) {
3497         self._serverData[key] = NCMB._decode(key, value);
3498       });
3499 
3500       // Refresh the attributes.
3501       this._rebuildAllEstimatedData();
3502 
3503       // Clear out the cache of mutable containers.
3504       this._refreshCache();
3505       this._opSetQueue = [{}];
3506 
3507       this._hasData = hasData;
3508     },
3509 
3510     /**
3511      * Applies the set of NCMB.Op in opSet to the object target.
3512      */
3513     _applyOpSet: function(opSet, target) {
3514       var self = this;
3515       NCMB._objectEach(opSet, function(change, key) {
3516         target[key] = change._estimate(target[key], self, key);
3517         if (target[key] === NCMB.Op._UNSET) {
3518           delete target[key];
3519         }
3520       });
3521     },
3522 
3523     /**
3524      * Replaces the cached value for key with the current value.
3525      * Returns true if the new value is different than the old value.
3526      */
3527     _resetCacheForKey: function(key) {
3528       var value = this.attributes[key];
3529       if (_.isObject(value) &&
3530           !(value instanceof NCMB.Object) &&
3531           !(value instanceof NCMB.File)) {
3532         value = value.toJSON ? value.toJSON() : value;
3533         var json = JSON.stringify(value);
3534         if (this._hashedJSON[key] !== json) {
3535           this._hashedJSON[key] = json;
3536           return true;
3537         }
3538       }
3539       return false;
3540     },
3541 
3542     /**
3543      * Populates attributes[key] by starting with the last known data from the
3544      * server, and applying all of the local changes that have been made to that
3545      * key since then.
3546      */
3547     _rebuildEstimatedDataForKey: function(key) {
3548       var self = this;
3549       delete this.attributes[key];
3550       if (this._serverData[key]) {
3551         this.attributes[key] = this._serverData[key];
3552       }
3553       NCMB._arrayEach(this._opSetQueue, function(opSet) {
3554         var op = opSet[key];
3555         if (op) {
3556           self.attributes[key] = op._estimate(self.attributes[key], self, key);
3557           if (self.attributes[key] === NCMB.Op._UNSET) {
3558             delete self.attributes[key];
3559           } else {
3560             self._resetCacheForKey(key);
3561           }
3562         }
3563       });
3564     },
3565 
3566     /**
3567      * Populates attributes by starting with the last known data from the
3568      * server, and applying all of the local changes that have been made since
3569      * then.
3570      */
3571     _rebuildAllEstimatedData: function() {
3572       var self = this;
3573 
3574       var previousAttributes = _.clone(this.attributes);
3575 
3576       this.attributes = _.clone(this._serverData);
3577       NCMB._arrayEach(this._opSetQueue, function(opSet) {
3578         self._applyOpSet(opSet, self.attributes);
3579         NCMB._objectEach(opSet, function(op, key) {
3580           self._resetCacheForKey(key);
3581         });
3582       });
3583 
3584       // Trigger change events for anything that changed because of the fetch.
3585       NCMB._objectEach(previousAttributes, function(oldValue, key) {
3586         if (self.attributes[key] !== oldValue) {
3587           self.trigger('change:' + key, self, self.attributes[key], {});
3588         }
3589       });
3590       NCMB._objectEach(this.attributes, function(newValue, key) {
3591         if (!_.has(previousAttributes, key)) {
3592           self.trigger('change:' + key, self, newValue, {});
3593         }
3594       });
3595     },
3596 
3597     /**
3598      * オブジェクトのモデル属性のハッシュをセットし、
3599      * silenceの設定をしない限り、<code>"change"</code>を発生させる。
3600      *
3601      * 
3602      * <p>キーと値を持っているオブジェクトか（キー、値）でも実行可能である。
3603      * 例えば：
3604      * <pre>
3605      *   gameTurn.set({
3606      *     player: player1,
3607      *     diceRoll: 2
3608      *   }, {
3609      *     error: function(gameTurnAgain, error) {
3610      *       // The set failed validation.
3611      *     }
3612      *   });
3613      *
3614      *   game.set("currentPlayer", player2, {
3615      *     error: function(gameTurnAgain, error) {
3616      *       // The set failed validation.
3617      *     }
3618      *   });
3619      *
3620      *   game.set("finished", true);</pre></p>
3621      * 
3622      * @param {String} key 　セットするキー
3623      * @param {} value セットする値
3624      * @param {Object} options Backbone対応オプションのセット。
3625      *     現時点、<code>silent</code>, <code>error</code>, <code>promise</code>のみサポートされてない。
3626      * @return {Boolean} 成功にセットを行った場合、trueとして返却する。
3627      * @see NCMB.Object#validate
3628      * @see NCMB.Error
3629      */
3630     set: function(key, value, options) {
3631       var attrs, attr;
3632       if (_.isObject(key) || NCMB._isNullOrUndefined(key)) {
3633         attrs = key;
3634         NCMB._objectEach(attrs, function(v, k) {
3635           attrs[k] = NCMB._decode(k, v);
3636         });
3637         options = value;
3638       } else {
3639         attrs = {};
3640         attrs[key] = NCMB._decode(key, value);
3641       }
3642       // Extract attributes and options.
3643       options = options || {};
3644       if (!attrs) {
3645         return this;
3646       }
3647   
3648       if (attrs instanceof NCMB.Object) {
3649         attrs = attrs.attributes;
3650       }
3651 
3652       // If the unset option is used, every attribute should be a Unset.
3653       if (options.unset) {
3654         NCMB._objectEach(attrs, function(unused_value, key2) {
3655           attrs[key2] = new NCMB.Op.Unset();
3656         });
3657       }
3658 
3659       // Apply all the attributes to get the estimated values.
3660       var dataToValidate = _.clone(attrs);
3661       var self = this;
3662 
3663       /*checking*/
3664       NCMB._objectEach(dataToValidate, function(value2, key2) {
3665         if (value2 instanceof NCMB.Op) {
3666           dataToValidate[key2] = value2._estimate(self.attributes[key2],
3667                                                 self, key2);
3668           if (dataToValidate[key2] === NCMB.Op._UNSET) {
3669             delete dataToValidate[key2];
3670           }
3671          }
3672       });
3673       // Run validation.
3674       if (!this._validate(attrs, options)) {
3675         return false;
3676       }
3677 
3678 
3679       this._mergeMagicFields(attrs);
3680 
3681       options.changes = {};
3682       var escaped = this._escapedAttributes;
3683       var prev = this._previousAttributes || {};
3684 
3685       // Update attributes.
3686       NCMB._arrayEach(_.keys(attrs), function(attr) {
3687         var val = attrs[attr];
3688 
3689         // If this is a relation object we need to set the parent correctly,
3690         // since the location where it was NCMBd does not have access to
3691         // this object.
3692         if (val instanceof NCMB.Relation) {
3693           val.parent = self;
3694         }
3695 
3696         if (!(val instanceof NCMB.Op)) {
3697           val = new NCMB.Op.Set(val);
3698         }
3699 
3700         // See if this change will actually have any effect.
3701         var isRealChange = true;
3702         if (val instanceof NCMB.Op.Set &&
3703             _.isEqual(self.attributes[attr], val.value)) {
3704           isRealChange = false;
3705         }
3706 
3707         if (isRealChange) {
3708           delete escaped[attr];
3709           if (options.silent) {
3710             self._silent[attr] = true;
3711           } else {
3712             options.changes[attr] = true;
3713           }
3714         }
3715 
3716         var currentChanges = _.last(self._opSetQueue);
3717         currentChanges[attr] = val._mergeWithPrevious(currentChanges[attr]);
3718         self._rebuildEstimatedDataForKey(attr);
3719 
3720         if (isRealChange) {
3721           self.changed[attr] = self.attributes[attr];
3722           if (!options.silent) {
3723             self._pending[attr] = true;
3724           }
3725         } else {
3726           delete self.changed[attr];
3727           delete self._pending[attr];
3728         }
3729       });
3730 
3731       if (!options.silent) {
3732         this.change(options);
3733       }
3734       return this;
3735     },
3736 
3737     /**
3738      * 属性をモデルから削除し、silenceを指定しない場合、<code>"change"</code>を実行させる。
3739      * 属性が存在しない場合、noopとして実行する。
3740      */
3741     unset: function(key, options) {
3742       options = options || {};
3743       return this.set(key, null, options);
3744     },
3745 
3746     /**
3747      * 次に保存を行う時、原子的に属性の値を増加させる。
3748      * 増加する値が指定されない場合、デフォルト値は1となる。
3749      *
3750      * @param key {String} キー名
3751      * @param amount {Number} 増加する値
3752      */
3753     increment: function(key, amount) {
3754       if (_.isUndefined(amount) || _.isNull(amount)) {
3755         amount = 1;
3756       }
3757       return this.set(key, new NCMB.Op.Increment(amount));
3758     },
3759 
3760     /**
3761      * キーの配列末にオブジェクトを追加する
3762      * @param key {String} キー名
3763      * @param value {} 追加項目
3764      */
3765     add: function(key, value) {
3766       return this.set(key, new NCMB.Op.Add([value]));
3767     },
3768 
3769     /**
3770      * オブジェクトがキー値の配列に存在しない場合だけ、配列にオブジェクトの追加を行う。追加位置は確定されていない。
3771      *
3772      * @param key {String} キー名
3773      * @param value {} 追加オブジェクト
3774      */
3775     addUnique: function(key, value) {
3776       return this.set(key, new NCMB.Op.AddUnique([value]));
3777     },
3778 
3779     /**
3780      * キー値の配列からオブジェクトのすべてのインスタンスを取り除く。
3781      *
3782      * @param key {String} キー名
3783      * @param item {} 取り除くオブジェクト
3784      */
3785     remove: function(key, item) {
3786       return this.set(key, new NCMB.Op.Remove([item]));
3787     },
3788 
3789     /**
3790      * 最後に保存された時から、フィールドの値にどんな変更があったかを表現するNCMB.Opのサブクラスのインスタンスを取得する。
3791      * 例えば、object.increment("x")を行った後、object.op("x")がNCMB.Op.Incrementを返却する。
3792      *
3793      * @param key {String} キー名
3794      * @returns {NCMB.Op} 操作かnoneの場合、不明確
3795      */
3796     op: function(key) {
3797       return _.last(this._opSetQueue)[key];
3798     },
3799 
3800     /**
3801      * モデルのすべての属性をクリアする、silenceをセットしない限り、<code>"change"</code>を実行させる。
3802      */
3803     clear: function(options) {
3804       options = options || {};
3805       options.unset = true;
3806       var keysToClear = _.extend(this.attributes, this._operations);
3807       return this.set(keysToClear, options);
3808     },
3809 
3810     /**
3811      * 次の保存リクエストと共に送信する操作セットのJSONエンコードを取得する。
3812      */
3813     _getSaveJSON: function() {
3814       var json = _.clone(_.first(this._opSetQueue));
3815       NCMB._objectEach(json, function(op, key) {
3816         json[key] = op.toJSON();
3817       });
3818       return json;
3819     },
3820 
3821     /**
3822      * 
3823      * Returns true if this object can be serialized for saving.
3824      */
3825     _canBeSerialized: function() {
3826       return NCMB.Object._canBeSerializedAsValue(this.attributes);
3827     },
3828 
3829     /**
3830      * サーバーからモデルを取得する。　サーバーの表現式は現在の属性と違う場合、
3831      * 現在の属性がoverridentされ、<code>"change"</code>のイベントを起動させる。
3832      * @return {NCMB.Promise} フェッチが完了されたら、成功のプロミスを返却する。
3833      */
3834     fetch: function(options) {
3835       var self = this;
3836       var request = NCMB._request("classes", this.className, this.id, 'GET');
3837       return request.then(function(response, status, xhr) {
3838         self._finishFetch(self.parse(response, status, xhr), true);
3839         return self;
3840       })._thenRunCallbacks(options, this);
3841     },
3842 
3843     /**
3844      * モデルの属性のハッシュセットを作成し、サーバーにモデルを保存する。
3845      * リクエストを返す時、updatedAtが更新される。
3846      * 以下のように、メソッドを利用する方法を紹介する。
3847      * <pre>
3848      *   object.save();</pre>
3849      * か<pre>
3850      *   object.save(null, options);</pre>
3851      * もしくは<pre>
3852      *   object.save(attrs, options);</pre>
3853      * か<pre>
3854      *   object.save(key, value, options);</pre>
3855      *
3856      * 例えば、
3857      * <pre>
3858      *   gameTurn.save({
3859      *     player: "Jake Cutter",
3860      *     diceRoll: 2
3861      *   }, {
3862      *     success: function(gameTurnAgain) {
3863      *       // The save was successful.
3864      *     },
3865      *     error: function(gameTurnAgain, error) {
3866      *       // The save failed.  Error is an instance of NCMB.Error.
3867      *     }
3868      *   });</pre>
3869      * かプロミス利用方法:<pre>
3870      *   gameTurn.save({
3871      *     player: "Jake Cutter",
3872      *     diceRoll: 2
3873      *   }).then(function(gameTurnAgain) {
3874      *     // The save was successful.
3875      *   }, function(error) {
3876      *     // The save failed.  Error is an instance of NCMB.Error.
3877      *   });</pre>
3878      * 
3879      * @return {NCMB.Promise} 保存が完了されたら、成功のプロミスを返却する。
3880      * @see NCMB.Error
3881      */
3882     save: function(keys, options) {      
3883       var i, attrs, current, saved; 
3884       attrs = keys;
3885       // Make save({ success: function() {} }) work.
3886       if (!options && attrs) {
3887         var extra_keys = _.reject(attrs, function(value, key) {
3888           return _.include(["success", "error", "wait"], key);
3889         });
3890         if (extra_keys.length === 0) {
3891           var all_functions = true;
3892           if (_.has(attrs, "success") && !_.isFunction(attrs.success)) {
3893             all_functions = false;
3894           }
3895           if (_.has(attrs, "error") && !_.isFunction(attrs.error)) {
3896             all_functions = false;
3897           }
3898           if (all_functions) {
3899             // This attrs object looks like it's really an options object,
3900             // and there's no other options object, so let's just use it.
3901             return this.save(null, attrs);
3902           }
3903         }
3904       }
3905 
3906       options = _.clone(options) || {};
3907       if (options.wait) {
3908         current = _.clone(this.attributes);
3909       }
3910 
3911       var setOptions = _.clone(options) || {};
3912       if (setOptions.wait) {
3913         setOptions.silent = true;
3914       }
3915       var setError;
3916       setOptions.error = function(model, error) {
3917         setError = error;
3918       };
3919       if (attrs && !this.set(attrs, setOptions)) {
3920         return NCMB.Promise.error(setError)._thenRunCallbacks(options, this);
3921       }
3922 
3923       var model = this;
3924 
3925       // If there is any unsaved child, save it first.
3926       model._refreshCache();     
3927 
3928       var unsavedChildren = [];
3929       var unsavedFiles = [];
3930       NCMB.Object._findUnsavedChildren(model.attributes,
3931                                         unsavedChildren,
3932                                         unsavedFiles);
3933 
3934       if (unsavedChildren.length + unsavedFiles.length > 0) {
3935         return NCMB.Object._deepSaveAsync(this.attributes).then(function() {
3936           return model.save(null, options);
3937         }, function(error) {
3938           return NCMB.Promise.error(error)._thenRunCallbacks(options, model);
3939         });
3940       }
3941 
3942       this._startSave();
3943       this._saving = (this._saving || 0) + 1;
3944 
3945       this._allPreviousSaves = this._allPreviousSaves || NCMB.Promise.as();
3946       this._allPreviousSaves = this._allPreviousSaves._continueWith(function() {
3947         var method = model.id ? 'PUT' : 'POST';
3948 
3949         var json = model._getSaveJSON();
3950         var route = "classes";
3951         var className = model.className;
3952         var request = NCMB._request(route, className, model.id, method, json);
3953         request = request.then(function(resp, status, xhr) {
3954           var serverAttrs = model.parse(resp, status, xhr);
3955           if (options.wait) {
3956             serverAttrs = _.extend(attrs || {}, serverAttrs);
3957           }
3958           model._finishSave(serverAttrs);
3959           if (options.wait) {
3960             model.set(current, setOptions);
3961           }
3962           return model;
3963 
3964         }, function(error) {
3965           model._cancelSave();
3966           return NCMB.Promise.error(error);
3967 
3968         })._thenRunCallbacks(options, model);
3969 
3970         return request;
3971       });
3972       return this._allPreviousSaves;
3973     },
3974 
3975     /**
3976      * 現在のオブジェクトはサーバーに存在する場合、削除を行う。コレクションに存在する場合、コレクションから削除も行う。
3977      * オプションに`wait: true`が渡された場合、サーバーから反応があるまで、削除を待つ。
3978      *　
3979      * @return {NCMB.Promise} 削除が完了されたら、成功のプロミスを返却する。
3980      */
3981     destroy: function(options) {
3982       options = options || {};
3983       var model = this;
3984 
3985       var triggerDestroy = function() {
3986         model.trigger('destroy', model, model.collection, options);
3987       };
3988 
3989       if (!this.id) {
3990         var _fileName = this.get("fileName");
3991         if(_fileName) {
3992           this.id = _fileName;
3993         }
3994         else{
3995           return triggerDestroy();
3996         }
3997       }
3998 
3999       if (!options.wait) {
4000         triggerDestroy();
4001       }
4002 
4003       var request =
4004           NCMB._request("classes", this.className, this.id, 'DELETE');
4005       return request.then(function() {
4006         if (options.wait) {
4007           triggerDestroy();
4008         }
4009         return model;
4010       })._thenRunCallbacks(options, this);
4011     },
4012 
4013     /**
4014      * レスポンスを属性のハッシュに変換する。
4015      * @ignore
4016      */
4017     parse: function(resp, status, xhr) {
4018       var output = _.clone(resp);
4019       _(["createdAt", "updatedAt"]).each(function(key) {
4020         if (output[key]) {
4021           output[key] = NCMB._NCMBDate(output[key]);
4022         }
4023       });
4024       if (!output.updatedAt) {
4025         output.updatedAt = output.createdAt;
4026       }
4027       if (status) {
4028         this._existed = (status !== 201);
4029       }
4030       return output;
4031     },
4032 
4033     /**
4034      * 現在のオブジェクトと同じ属性のモデルを新しく作成する。
4035      * @return {NCMB.Object}
4036      */
4037     clone: function() {
4038       return new this.constructor(this.attributes);
4039     },
4040 
4041     /**
4042      * NCMBに保存されたことない場合、trueを返却する。
4043      * @return {Boolean}
4044      */
4045     isNew: function() {
4046       return !this.id;
4047     },
4048 
4049     /**
4050      * 属性の`"change:attribute"`イベントと、モデルの`"change"`イベントを手動的に実行させる。
4051      * この関数を実行すると、モデルのすべて関連オブジェクトが変更される。
4052      */
4053 
4054     change: function(options) {
4055       options = options || {};
4056       var changing = this._changing;
4057       this._changing = true;
4058 
4059       // Silent changes become pending changes.
4060       var self = this;
4061       NCMB._objectEach(this._silent, function(attr) {
4062         self._pending[attr] = true;
4063       });
4064 
4065       // Silent changes are triggered.
4066       var changes = _.extend({}, options.changes, this._silent);
4067       this._silent = {};
4068       NCMB._objectEach(changes, function(unused_value, attr) {
4069         self.trigger('change:' + attr, self, self.get(attr), options);
4070       });
4071       if (changing) {
4072         return this;
4073       }
4074 
4075       // This is to get around lint not letting us make a function in a loop.
4076       var deleteChanged = function(value, attr) {
4077         if (!self._pending[attr] && !self._silent[attr]) {
4078           delete self.changed[attr];
4079         }
4080       };
4081 
4082       // Continue firing `"change"` events while there are pending changes.
4083       while (!_.isEmpty(this._pending)) {
4084         this._pending = {};
4085         this.trigger('change', this, options);
4086         // Pending and silent changes still remain.
4087         NCMB._objectEach(this.changed, deleteChanged);
4088         self._previousAttributes = _.clone(this.attributes);
4089       }
4090 
4091       this._changing = false;
4092       return this;
4093     },
4094     
4095     
4096     /**
4097      * NCMBサーバーにオブジェクトが存在するかどうか確認し、true/false返却する。
4098      */
4099     existed: function() {
4100       return this._existed;
4101     },
4102 
4103     /**
4104      * 属性に対するすべて変更を持っているオブジェクトか、属性に変更がない時falseを返却する。
4105      * ビューがどんな部分は更新が必要かの確認とどんな属性がサーバーに持続するかの確認が便利になる。
4106      * セットされてない属性はundefinedとしてセットする。　属性オブジェクトdiffを渡す時、モデルに変更は行うかどうか判断し、返却する。
4107      */
4108     changedAttributes: function(diff) {
4109       if (!diff) {
4110         return this.hasChanged() ? _.clone(this.changed) : false;
4111       }
4112       var changed = {};
4113       var old = this._previousAttributes;
4114       NCMB._objectEach(diff, function(diffVal, attr) {
4115         if (!_.isEqual(old[attr], diffVal)) {
4116           changed[attr] = diffVal;
4117         }
4118       });
4119       return changed;
4120     },
4121 
4122     /**
4123      * 属性の前の値を取得する。この値は<code>"change"</code>イベントを実行した時に記録した値である。
4124      * @param {String} attr 取得したい属性名。
4125      */
4126     previous: function(attr) {
4127       if (!arguments.length || !this._previousAttributes) {
4128         return null;
4129       }
4130       return this._previousAttributes[attr];
4131     },
4132 
4133     /**
4134      * 前回の<code>"change"</code>イベントが発生した時のすべて属性を取得する。
4135      * @return {Object}　オブジェクト
4136      */
4137     previousAttributes: function() {
4138       return _.clone(this._previousAttributes);
4139     },
4140 
4141     /**
4142      * モデルは現在有効的な状態であるかどうか確認する。　
4143      * silent変更を利用する時だけ、invalid状態になる可能性がある。
4144      * @return {Boolean}
4145      */
4146     isValid: function() {
4147       return !this.validate(this.attributes);
4148     },
4149 
4150     /**
4151      * <code>NCMB.Object</code>をサブクラスをする方法以外、この関数は直接実行しない方がお勧めする。
4152      * この関数をオーバーライドし、メソッドに追加<code>set</code>と<code>save</code>のバリデーションを提供する可能。
4153      * 実装は以下のように可能である。
4154      * @param {Object} attrs 現在のバリデーションデーター。
4155      * @param {Object} options Backbone対応のオプションオブジェクト。
4156      * @return {} データーが正しくない場合、Falseを返却する。
4157      * @see NCMB.Object#set
4158      */
4159     validate: function(attrs, options) {
4160       if (_.has(attrs, "ACL") && !(attrs.ACL instanceof NCMB.ACL)) {
4161         return new NCMB.Error(NCMB.Error.OTHER_CAUSE,
4162                                "ACL must be a NCMB.ACL.");
4163       }
4164       return false;
4165     },
4166 
4167     /**
4168      * attrs の属性をバリデーションを実行し、成功の場合trueを返却する。 `error`コールバックが返却された場合、
4169      * `"errorイベントが"実行させるより、コールバックを使用した方がいい。
4170      */
4171     _validate: function(attrs, options) {
4172       if (options.silent || !this.validate) {
4173         return true;
4174       }
4175       attrs = _.extend({}, this.attributes, attrs);
4176       var error = this.validate(attrs, options);
4177       if (!error) {
4178         return true;
4179       }
4180       if (options && options.error) {
4181         options.error(this, error, options);
4182       } else {
4183         this.trigger('error', this, error, options);
4184       }
4185       return false;
4186     },
4187 
4188     /**
4189      * オブジェクトのACLを返却する。
4190      * @returns {NCMB.ACL} NCMB.ACLのインスタンス
4191      * @see NCMB.Object#get
4192      */
4193     getACL: function() {
4194       return this.get("acl");
4195     },
4196 
4197     /**
4198      * このオブジェクトにACLを設定する。
4199      * @param {NCMB.ACL} acl NCMB.ACLのインスタンス
4200      * @param {Object} options 　セットするためのBackbone対応のオプションオブジェクト(任意)
4201      * @return {Boolean} バリデーションに合格するかどうか結果を返却する。
4202      * @see NCMB.Object#set
4203      */
4204     setACL: function(acl, options) {
4205       return this.set("acl", acl, options);
4206     }
4207 
4208   });
4209 
4210   /**
4211    * Returns the appropriate subclass for making new instances of the given
4212    * className string.
4213    */
4214   NCMB.Object._getSubclass = function(className) {
4215     if (!_.isString(className)) {
4216       throw "NCMB.Object._getSubclass requires a string argument.";
4217     }
4218     var ObjectClass = NCMB.Object._classMap[className];
4219     if (!ObjectClass) {
4220       ObjectClass = NCMB.Object.extend(className);
4221       NCMB.Object._classMap[className] = ObjectClass;
4222     }
4223     return ObjectClass;
4224   };
4225 
4226   /**
4227    * Creates an instance of a subclass of NCMB.Object for the given classname.
4228    */
4229   NCMB.Object._create = function(className, attributes, options) {
4230     var ObjectClass = NCMB.Object._getSubclass(className);
4231     return new ObjectClass(attributes, options);
4232   };
4233 
4234   // Set up a map of className to class so that we can create new instances of
4235   // NCMB Objects from JSON automatically.
4236   NCMB.Object._classMap = {};
4237 
4238   NCMB.Object._extend = NCMB._extend;
4239 
4240   /**
4241   　* 渡されたNCMBクラス名からNCMB.Objectのサブクラスを作成する。
4242    *
4243    * <p>NCMBクラスの拡張はクラス拡張の最新のものから継承をする。　JSONをパースすることによりNCMB.
4244    * Objectは自動的に作成される場合、クラスの一番最近拡張を使用する。</p>
4245    *
4246    * <p>以下の方法で利用する:<pre>
4247    *     var MyClass = NCMB.Object.extend("MyClass", {
4248    *         <i>Instance properties</i>
4249    *     }, {
4250    *         <i>Class properties</i>
4251    *     });</pre>
4252    * か、Backbone対応の利用方法：or, for Backbone compatibility:<pre>
4253    *     var MyClass = NCMB.Object.extend({
4254    *         className: "MyClass",
4255    *         <i>Other instance properties</i>
4256    *     }, {
4257    *         <i>Class properties</i>
4258    *     });</pre></p>
4259    *
4260    * @param {String} className このモデルのNCMBクラス名
4261    * @param {Object} protoProps 関数にて返却したクラスのインスタンスにインスタンスの属性を追加
4262    * @param {Object} classProps 関数にて返却した値にクラスの属性の追加
4263    * @return {Class} 新しいNCMB.Objectのサブクラス。
4264    */
4265   NCMB.Object.extend = function(className, protoProps, classProps) {
4266     // Handle the case with only two args.
4267     if (!_.isString(className)) {
4268       if (className && _.has(className, "className")) {
4269         return NCMB.Object.extend(className.className, className, protoProps);
4270       } else {
4271         throw new Error(
4272             "NCMB.Object.extend's first argument should be the className.");
4273       }
4274     }
4275 
4276     // If someone tries to subclass "User", coerce it to the right type.
4277     if (className === "User") {
4278       classname = "user";
4279     }
4280 
4281     var NewClassObject = null;
4282     if (_.has(NCMB.Object._classMap, className)) {
4283       var OldClassObject = NCMB.Object._classMap[className];
4284       // This new subclass has been told to extend both from "this" and from
4285       // OldClassObject. This is multiple inheritance, which isn't supported.
4286       // For now, let's just pick one.
4287       NewClassObject = OldClassObject._extend(protoProps, classProps);
4288     } else {
4289       protoProps = protoProps || {};
4290       protoProps.className = className;
4291       NewClassObject = this._extend(protoProps, classProps);
4292     }
4293     // Extending a subclass should reuse the classname automatically.
4294     NewClassObject.extend = function(arg0) {
4295       if (_.isString(arg0) || (arg0 && _.has(arg0, "className"))) {
4296         return NCMB.Object.extend.apply(NewClassObject, arguments);
4297       }
4298       var newArguments = [className].concat(NCMB._.toArray(arguments));
4299       return NCMB.Object.extend.apply(NewClassObject, newArguments);
4300     };
4301     NCMB.Object._classMap[className] = NewClassObject;
4302     return NewClassObject;
4303   };
4304   NCMB.Object._findUnsavedChildren = function(object, children, files) {
4305     NCMB._traverse(object, function(object) {
4306       if (object instanceof NCMB.Object) {
4307         object._refreshCache();
4308         if (object.dirty()) {
4309           children.push(object);
4310         }
4311         return;
4312       }
4313 
4314       if (object instanceof NCMB.File) {
4315         if (!object.url()) {
4316           files.push(object);
4317         }
4318         return;
4319       }
4320     });
4321   };
4322 
4323   NCMB.Object._canBeSerializedAsValue = function(object) {
4324     var canBeSerializedAsValue = true;
4325 
4326     if (object instanceof NCMB.Object) {
4327       canBeSerializedAsValue = !!object.id;
4328 
4329     } else if (_.isArray(object)) {
4330       NCMB._arrayEach(object, function(child) {
4331         if (!NCMB.Object._canBeSerializedAsValue(child)) {
4332           canBeSerializedAsValue = false;
4333         }
4334       });
4335 
4336     } else if (_.isObject(object)) {
4337       NCMB._objectEach(object, function(child) {
4338         if (!NCMB.Object._canBeSerializedAsValue(child)) {
4339           canBeSerializedAsValue = false;
4340         }
4341       });
4342     }
4343 
4344     return canBeSerializedAsValue;
4345   };
4346 
4347   NCMB.Object._deepSaveAsync = function(object) {
4348     var unsavedChildren = [];
4349     var unsavedFiles = [];
4350     NCMB.Object._findUnsavedChildren(object, unsavedChildren, unsavedFiles);
4351     var promise = NCMB.Promise.as();
4352     _.each(unsavedFiles, function(file) {
4353       promise = promise.then(function() {
4354         return file.save();
4355       });
4356     });
4357 
4358     var objects = _.uniq(unsavedChildren);
4359     var remaining = _.uniq(objects);
4360 
4361     return promise.then(function() {
4362       return NCMB.Promise._continueWhile(function() {
4363         return remaining.length > 0;
4364       }, function() {
4365 
4366         // Gather up all the objects that can be saved in this batch.
4367         var batch = [];
4368         var newRemaining = [];
4369         NCMB._arrayEach(remaining, function(object) {
4370           // Limit batches to 20 objects.
4371           if (batch.length > 20) {
4372             newRemaining.push(object);
4373             return;
4374           }
4375 
4376           if (object._canBeSerialized()) {
4377             batch.push(object);
4378           } else {
4379             newRemaining.push(object);
4380           }
4381         });
4382         remaining = newRemaining;
4383 
4384         // If we can't save any objects, there must be a circular reference.
4385         if (batch.length === 0) {
4386           return NCMB.Promise.error(
4387             new NCMB.Error(NCMB.Error.OTHER_CAUSE,
4388                             "Tried to save a batch with a cycle."));
4389         }
4390 
4391         // Reserve a spot in every object's save queue.
4392         var readyToStart = NCMB.Promise.when(_.map(batch, function(object) {
4393           return object._allPreviousSaves || NCMB.Promise.as();
4394         }));
4395         var batchFinished = new NCMB.Promise();
4396         NCMB._arrayEach(batch, function(object) {
4397           object._allPreviousSaves = batchFinished;
4398         });
4399 
4400         // Save a single batch, whether previous saves succeeded or failed.
4401         return readyToStart._continueWith(function() {
4402           return NCMB._request("batch", null, null, "POST", {
4403             requests: _.map(batch, function(object) {
4404               var json = object._getSaveJSON();
4405               var method = "POST";
4406 
4407               var path = "/2013-09-01/classes/" + object.className; //★パス！
4408               if (object.id) {
4409                 path = path + "/" + object.id;
4410                 method = "PUT";
4411               }
4412 
4413               object._startSave();
4414 
4415               return {
4416                 method: method,
4417                 path: path,
4418                 body: json
4419               };
4420             })
4421 
4422           }).then(function(response, status, xhr) {
4423             var error;
4424             NCMB._arrayEach(batch, function(object, i) {
4425               if (response[i].success) {
4426                 object._finishSave(
4427                   object.parse(response[i].success, status, xhr));
4428               } else {
4429                 error = error || response[i].error;
4430                 object._cancelSave();
4431               }
4432             });
4433             if (error) {
4434               return NCMB.Promise.error(
4435                 new NCMB.Error(error.code, error.error));
4436             }
4437 
4438           }).then(function(results) {
4439             batchFinished.resolve(results);
4440             return results;
4441           }, function(error) {
4442             batchFinished.reject(error);
4443             return NCMB.Promise.error(error);
4444           });
4445         });
4446       });
4447     }).then(function() {
4448       return object;
4449     });
4450   };
4451 }(this));
4452 
4453 /************************************************** NCMB Relation class *****************************************/
4454 
4455 (function(root) {
4456   root.NCMB = root.NCMB || {};
4457   var NCMB = root.NCMB;
4458   var _ = NCMB._;
4459 
4460   /**
4461    * 渡されたオブジェクトとキーに対する新しいレリレーションを作成。コンストラクターは直接利用しない方がお勧めする。
4462    * @param {NCMB.Object} parent リレーションの親オブジェクト
4463    * @param {String} key 親でのリレーションのキー名
4464    * @see NCMB.Object#relation
4465    * @class
4466    *
4467    * <p>
4468    * 多対多のリレーションのオブジェクトをアクセスするため利用。 
4469    * NCMB.Relationのインスタンスは特定の親オブジェクトとキーと関連させる。
4470    * </p>
4471    */
4472   NCMB.Relation = function(parent, key) {
4473     this.parent = parent;
4474     this.key = key;
4475     this.targetClassName = null;
4476   };
4477 
4478   NCMB.Relation.prototype = {
4479     /**
4480      * 親とキーが正しいかを確認するリレーション
4481      */
4482     _ensureParentAndKey: function(parent, key) {
4483       this.parent = this.parent || parent;
4484       this.key = this.key || key;
4485       if (this.parent !== parent) {
4486         throw "Internal Error. Relation retrieved from two different Objects.";
4487       }
4488       if (this.key !== key) {
4489         throw "Internal Error. Relation retrieved from two different keys.";
4490       }
4491     },
4492 
4493     /**
4494      * NCMB.ObjectかNCMB.Objectsの配列をリレーションに追加する。
4495      * @param {} objects 追加する項目。
4496      */
4497     add: function(objects) {
4498       if (!_.isArray(objects)) {
4499         objects = [objects];
4500       }
4501 
4502       var change = new NCMB.Op.Relation(objects, []);
4503       this.parent.set(this.key, change);
4504       this.targetClassName = change._targetClassName;
4505     },
4506 
4507     /**
4508      * リレーションからNCMB.Objectか配列を削除する。
4509      * @param {} objects 削除する項目。
4510      */
4511     remove: function(objects) {
4512       if (!_.isArray(objects)) {
4513         objects = [objects];
4514       }
4515 
4516       var change = new NCMB.Op.Relation([], objects);
4517       this.parent.set(this.key, change);
4518       this.targetClassName = change._targetClassName;
4519     },
4520 
4521     /**
4522      * ディスクに保存するため、オブジェクトのJSONバージョンを返却する。
4523      * @return {Object}
4524      */
4525     toJSON: function() {
4526       return { "__type": "Relation", "className": this.targetClassName };
4527     },
4528 
4529     /**
4530      * リレーションオブジェクトに制限するNCMB.Queryを返却する。
4531      * @return {NCMB.Query}　クエリオブジェクト
4532      */
4533     query: function() {
4534       var targetClass;
4535       var query;
4536       if (!this.targetClassName) {
4537         targetClass = NCMB.Object._getSubclass(this.parent.className);
4538         query = new NCMB.Query(targetClass);
4539         query._extraOptions.redirectClassNameForKey = this.key;
4540       } else {
4541         targetClass = NCMB.Object._getSubclass(this.targetClassName);
4542         query = new NCMB.Query(targetClass);
4543       }
4544       query._addCondition("$relatedTo", "object", this.parent._toPointer());
4545       query._addCondition("$relatedTo", "key", this.key);
4546       return query;
4547     }
4548   };
4549 }(this));
4550 
4551 /************************************************** NCMB Operation class *****************************************/
4552 
4553 (function(root) {
4554   root.NCMB = root.NCMB || {};
4555   var NCMB = root.NCMB;
4556   var _ = NCMB._;
4557 
4558   /**
4559    * @class
4560    * NCMB.OpはNCMB.Objectのフィールドに適応できる操作単位である。例えば、<code>object.set("foo", "bar")</code>
4561    * はNCMB.Op.Setの例である。 <code>object.unset("foo")</code>はNCMB.Op.Unsetの一つの例である。
4562    * このような操作はNCMB.Objectに保存され、<code>object.save()</code> の一部としてサーバーに送信する。
4563    * NCMB.Opのインスタンスは不変性である。直接NCMB.
4564    * Opのサブクラスを作成しない方がお勧めする。
4565    */
4566   NCMB.Op = function() {
4567     this._initialize.apply(this, arguments);
4568   };
4569 
4570   NCMB.Op.prototype = {
4571     _initialize: function() {}
4572   };
4573 
4574   _.extend(NCMB.Op, {
4575     /**
4576      * To create a new Op, call NCMB.Op._extend();
4577      */
4578     _extend: NCMB._extend,
4579 
4580     // A map of __op string to decoder function.
4581     _opDecoderMap: {},
4582 
4583     /**
4584      * Registers a function to convert a json object with an __op field into an
4585      * instance of a subclass of NCMB.Op.
4586      */
4587     _registerDecoder: function(opName, decoder) {
4588       NCMB.Op._opDecoderMap[opName] = decoder;
4589     },
4590 
4591     /**
4592      * Converts a json object into an instance of a subclass of NCMB.Op.
4593      */
4594     _decode: function(json) {
4595       var decoder = NCMB.Op._opDecoderMap[json.__op];
4596       if (decoder) {
4597         return decoder(json);
4598       } else {
4599         return undefined;
4600       }
4601     }
4602   });
4603 
4604   /*
4605    * バッチopsのハンドラーを追加する
4606    */
4607   NCMB.Op._registerDecoder("Batch", function(json) {
4608     var op = null;
4609     NCMB._arrayEach(json.ops, function(nextOp) {
4610       nextOp = NCMB.Op._decode(nextOp);
4611       op = nextOp._mergeWithPrevious(op);
4612     });
4613     return op;
4614   });
4615 
4616   /**
4617    * @class
4618    * 
4619    * Setの操作、 NCMB.Object.setによってフィールドが変更されたか、可変のコンテナーが変更されたかを表す。
4620    */
4621   NCMB.Op.Set = NCMB.Op._extend(/** @lends NCMB.Op.Set.prototype */ {
4622     _initialize: function(value) {
4623       this._value = value;
4624     },
4625 
4626     /**
4627      * セットした新しい値を取得する。
4628      */
4629     value: function() {
4630       return this._value;
4631     },
4632 
4633     /**
4634      * 操作のNCMBに送信する時に対応するJSONバージョンを取得する。
4635      * @return {Object}　JSONオブジェクト
4636      */
4637     toJSON: function() {
4638       return NCMB._encode(this.value());
4639     },
4640 
4641     _mergeWithPrevious: function(previous) {
4642       return this;
4643     },
4644 
4645     _estimate: function(oldValue) {
4646       return this.value();
4647     }
4648   });
4649 
4650   /**
4651    * どんなフィールドを削除するか指定するNCMB.Op.Unset._estimateが返却した値である。　
4652    * 基本的には_UNSETがオブジェクトの値である場合、キーの値を取り除く必要がある。
4653    */
4654   NCMB.Op._UNSET = {};
4655 
4656   /**
4657    * @class
4658    * Unset操作はこのフィールドが削除されたことを指定する。
4659    */
4660   NCMB.Op.Unset = NCMB.Op._extend(/** @lends NCMB.Op.Unset.prototype */ {
4661     /**
4662      * NCMBに送信するための対応JSON表式を取得する。
4663      * @return {Object}
4664      */
4665     toJSON: function() {
4666       return { __op: "Unset" };
4667     },
4668 
4669     _mergeWithPrevious: function(previous) {
4670       return this;
4671     },
4672 
4673     _estimate: function(oldValue) {
4674       return NCMB.Op._UNSET;
4675     }
4676   });
4677 
4678   NCMB.Op._registerDecoder("Delete", function(json) {
4679     return new NCMB.Op.Unset();
4680   });
4681 
4682   /**
4683    * @class
4684    * Increment操作は単位の操作であり、フィールドの数値を渡された量で増加させる。
4685    */
4686   NCMB.Op.Increment = NCMB.Op._extend(
4687       /** @lends NCMB.Op.Increment.prototype */ {
4688 
4689     _initialize: function(amount) {
4690       this._amount = amount;
4691     },
4692 
4693     /**
4694      * 増加させた量を取得する。
4695      * @return {Number} 増加させた量を返却する。
4696      */
4697     amount: function() {
4698       return this._amount;
4699     },
4700 
4701     /**
4702      * NCMBに送信するための対応JSON表式を取得する。
4703      * @return {Object}
4704      */
4705     toJSON: function() {
4706       return { __op: "Increment", amount: this._amount };
4707     },
4708 
4709     _mergeWithPrevious: function(previous) {
4710       if (!previous) {
4711         return this;
4712       } else if (previous instanceof NCMB.Op.Unset) {
4713         return new NCMB.Op.Set(this.amount());
4714       } else if (previous instanceof NCMB.Op.Set) {
4715         return new NCMB.Op.Set(previous.value() + this.amount());
4716       } else if (previous instanceof NCMB.Op.Increment) {
4717         return new NCMB.Op.Increment(this.amount() + previous.amount());
4718       } else {
4719         throw "Op is invalid after previous op.";
4720       }
4721     },
4722 
4723     _estimate: function(oldValue) {
4724       if (!oldValue) {
4725         return this.amount();
4726       }
4727       return oldValue + this.amount();
4728     }
4729   });
4730 
4731   NCMB.Op._registerDecoder("Increment", function(json) {
4732     return new NCMB.Op.Increment(json.amount);
4733   });
4734 
4735   /**
4736    * @class
4737    * Addは単位の操作であり、フィールドに保持された配列に、渡されたオブジェクトを付加させる。
4738    */
4739   NCMB.Op.Add = NCMB.Op._extend(/** @lends NCMB.Op.Add.prototype */ {
4740     _initialize: function(objects) {
4741       this._objects = objects;
4742     },
4743 
4744     /**
4745      * 配列に付加されるオブジェクトを取得する。
4746      * @return {Array} 配列に付加されるオブジェクトかオブジェクトの配列。
4747      */
4748     objects: function() {
4749       return this._objects;
4750     },
4751 
4752     /**
4753      * NCMBに送信するための対応JSON表式を取得する。
4754      * @return {Object}
4755      */
4756     toJSON: function() {
4757       return { __op: "Add", objects: NCMB._encode(this.objects()) };
4758     },
4759 
4760     _mergeWithPrevious: function(previous) {
4761       if (!previous) {
4762         return this;
4763       } else if (previous instanceof NCMB.Op.Unset) {
4764         return new NCMB.Op.Set(this.objects());
4765       } else if (previous instanceof NCMB.Op.Set) {
4766         return new NCMB.Op.Set(this._estimate(previous.value()));
4767       } else if (previous instanceof NCMB.Op.Add) {
4768         return new NCMB.Op.Add(previous.objects().concat(this.objects()));
4769       } else {
4770         throw "Op is invalid after previous op.";
4771       }
4772     },
4773 
4774     _estimate: function(oldValue) {
4775       if (!oldValue) {
4776         return _.clone(this.objects());
4777       } else {
4778         return oldValue.concat(this.objects());
4779       }
4780     }
4781   });
4782 
4783   NCMB.Op._registerDecoder("Add", function(json) {
4784     return new NCMB.Op.Add(NCMB._decode(undefined, json.objects));
4785   });
4786 
4787   /**
4788    * @class
4789    * AddUniqueは単位操作であり、フィールドに保持されている配列に存在しない限り、渡されたオブジェクトを配列に追加を行う操作である。
4790    */
4791   NCMB.Op.AddUnique = NCMB.Op._extend(
4792       /** @lends NCMB.Op.AddUnique.prototype */ {
4793 
4794     _initialize: function(objects) {
4795       this._objects = _.uniq(objects);
4796     },
4797 
4798     /**
4799      * 配列に追加するオブジェクトを取得する。
4800      * @return {Array} 　配列に追加するオブジェクトを返却する。
4801      */
4802     objects: function() {
4803       return this._objects;
4804     },
4805 
4806     /**
4807      * NCMBに送信するための対応JSON表式を取得する。
4808      * @return {Object}
4809      */
4810     toJSON: function() {
4811       return { __op: "AddUnique", objects: NCMB._encode(this.objects()) };
4812     },
4813 
4814     _mergeWithPrevious: function(previous) {
4815       if (!previous) {
4816         return this;
4817       } else if (previous instanceof NCMB.Op.Unset) {
4818         return new NCMB.Op.Set(this.objects());
4819       } else if (previous instanceof NCMB.Op.Set) {
4820         return new NCMB.Op.Set(this._estimate(previous.value()));
4821       } else if (previous instanceof NCMB.Op.AddUnique) {
4822         return new NCMB.Op.AddUnique(this._estimate(previous.objects()));
4823       } else {
4824         throw "Op is invalid after previous op.";
4825       }
4826     },
4827 
4828     _estimate: function(oldValue) {
4829       if (!oldValue) {
4830         return _.clone(this.objects());
4831       } else {
4832         // We can't just take the _.uniq(_.union(...)) of oldValue and
4833         // this.objects, because the uniqueness may not apply to oldValue
4834         // (especially if the oldValue was set via .set())
4835         var newValue = _.clone(oldValue);
4836         NCMB._arrayEach(this.objects(), function(obj) {
4837           if (obj instanceof NCMB.Object && obj.id) {
4838             var matchingObj = _.find(newValue, function(anObj) {
4839               return (anObj instanceof NCMB.Object) && (anObj.id === obj.id);
4840             });
4841             if (!matchingObj) {
4842               newValue.push(obj);
4843             } else {
4844               var index = _.indexOf(newValue, matchingObj);
4845               newValue[index] = obj;
4846             }
4847           } else if (!_.contains(newValue, obj)) {
4848             newValue.push(obj);
4849           }
4850         });
4851         return newValue;
4852       }
4853     }
4854   });
4855 
4856   NCMB.Op._registerDecoder("AddUnique", function(json) {
4857     return new NCMB.Op.AddUnique(NCMB._decode(undefined, json.objects));
4858   });
4859 
4860   /**
4861    * @class
4862    * Removeは単位操作である。フィールドに保持されている配列から、渡されたオブジェクトを取り除く。
4863    */
4864   NCMB.Op.Remove = NCMB.Op._extend(/** @lends NCMB.Op.Remove.prototype */ {
4865     _initialize: function(objects) {
4866       this._objects = _.uniq(objects);
4867     },
4868 
4869     /**
4870      * 取り除くオブジェクトを取得する。
4871      * @return {Array} 取り除くオブジェクトかオブジェクトの配列
4872      */
4873     objects: function() {
4874       return this._objects;
4875     },
4876 
4877     /**
4878      * NCMBに送信するための対応JSON表式を取得する。
4879      * @return {Object}
4880      */
4881     toJSON: function() {
4882       return { __op: "Remove", objects: NCMB._encode(this.objects()) };
4883     },
4884 
4885     _mergeWithPrevious: function(previous) {
4886       if (!previous) {
4887         return this;
4888       } else if (previous instanceof NCMB.Op.Unset) {
4889         return previous;
4890       } else if (previous instanceof NCMB.Op.Set) {
4891         return new NCMB.Op.Set(this._estimate(previous.value()));
4892       } else if (previous instanceof NCMB.Op.Remove) {
4893         return new NCMB.Op.Remove(_.union(previous.objects(), this.objects()));
4894       } else {
4895         throw "Op is invalid after previous op.";
4896       }
4897     },
4898 
4899     _estimate: function(oldValue) {
4900       if (!oldValue) {
4901         return [];
4902       } else {
4903         var newValue = _.difference(oldValue, this.objects());
4904         // If there are saved NCMB Objects being removed, also remove them.
4905         NCMB._arrayEach(this.objects(), function(obj) {
4906           if (obj instanceof NCMB.Object && obj.id) {
4907             newValue = _.reject(newValue, function(other) {
4908               return (other instanceof NCMB.Object) && (other.id === obj.id);
4909             });
4910           }
4911         });
4912         return newValue;
4913       }
4914     }
4915   });
4916 
4917   NCMB.Op._registerDecoder("Remove", function(json) {
4918     return new NCMB.Op.Remove(NCMB._decode(undefined, json.objects));
4919   });
4920 
4921   /**
4922    * @class
4923    * Relationは単位操作です。　フィールドはNCMB.Relationのインスタンスであり、
4924    * リレーションにオブジェクトを追加、削除されているか指定する操作である。
4925    */
4926   NCMB.Op.Relation = NCMB.Op._extend(
4927       /** @lends NCMB.Op.Relation.prototype */ {
4928 
4929     _initialize: function(adds, removes) {
4930       this._targetClassName = null;
4931 
4932       var self = this;
4933 
4934       var pointerToId = function(object) {
4935         if (object instanceof NCMB.Object) {
4936           if (!object.id) {
4937             throw "You can't add an unsaved NCMB.Object to a relation.";
4938           }
4939           if (!self._targetClassName) {
4940             self._targetClassName = object.className;
4941           }
4942           if (self._targetClassName !== object.className) {
4943             throw "Tried to create a NCMB.Relation with 2 different types: " +
4944                   self._targetClassName + " and " + object.className + ".";
4945           }
4946           return object.id;
4947         }
4948         return object;
4949       };
4950 
4951       this.relationsToAdd = _.uniq(_.map(adds, pointerToId));
4952       this.relationsToRemove = _.uniq(_.map(removes, pointerToId));
4953     },
4954 
4955     /**
4956      * リレーションに追加する予定のフェッチしていないNCMB.Objectの配列を取得する。
4957      * @return {Array}
4958      */
4959     added: function() {
4960       var self = this;
4961       return _.map(this.relationsToAdd, function(objectId) {
4962         var object = NCMB.Object._create(self._targetClassName);
4963         object.id = objectId;
4964         return object;
4965       });
4966     },
4967 
4968     /**
4969      * リレーションから削除する予定のフェッチしていないNCMB.Objectの配列を取得する。
4970      * @return {Array}
4971      */
4972     removed: function() {
4973       var self = this;
4974       return _.map(this.relationsToRemove, function(objectId) {
4975         var object = NCMB.Object._create(self._targetClassName);
4976         object.id = objectId;
4977         return object;
4978       });
4979     },
4980 
4981     /**
4982      * NCMBに送信するための対応JSON表式を取得する。
4983      * @return {Object}
4984      */
4985     toJSON: function() {
4986       var adds = null;
4987       var removes = null;
4988       var self = this;
4989       var idToPointer = function(id) {
4990         return { __type: 'Pointer',
4991                  className: self._targetClassName,
4992                  objectId: id };
4993       };
4994       var pointers = null;
4995       if (this.relationsToAdd.length > 0) {
4996         pointers = _.map(this.relationsToAdd, idToPointer);
4997         adds = { "__op": "AddRelation", "objects": pointers };
4998       }
4999 
5000       if (this.relationsToRemove.length > 0) {
5001         pointers = _.map(this.relationsToRemove, idToPointer);
5002         removes = { "__op": "RemoveRelation", "objects": pointers };
5003       }
5004 
5005       if (adds && removes) {
5006         return { "__op": "Batch", "ops": [adds, removes]};
5007       }
5008 
5009       return adds || removes || {};
5010     },
5011 
5012     _mergeWithPrevious: function(previous) {
5013       if (!previous) {
5014         return this;
5015       } else if (previous instanceof NCMB.Op.Unset) {
5016         throw "You can't modify a relation after deleting it.";
5017       } else if (previous instanceof NCMB.Op.Relation) {
5018         if (previous._targetClassName &&
5019             previous._targetClassName !== this._targetClassName) {
5020           throw "Related object must be of class " + previous._targetClassName +
5021               ", but " + this._targetClassName + " was passed in.";
5022         }
5023         var newAdd = _.union(_.difference(previous.relationsToAdd,
5024                                           this.relationsToRemove),
5025                              this.relationsToAdd);
5026         var newRemove = _.union(_.difference(previous.relationsToRemove,
5027                                              this.relationsToAdd),
5028                                 this.relationsToRemove);
5029 
5030         var newRelation = new NCMB.Op.Relation(newAdd, newRemove);
5031         newRelation._targetClassName = this._targetClassName;
5032         return newRelation;
5033       } else {
5034         throw "Op is invalid after previous op.";
5035       }
5036     },
5037 
5038     _estimate: function(oldValue, object, key) {
5039       if (!oldValue) {
5040         var relation = new NCMB.Relation(object, key);
5041         relation.targetClassName = this._targetClassName;
5042       } else if (oldValue instanceof NCMB.Relation) {
5043         if (this._targetClassName) {
5044           if (oldValue.targetClassName) {
5045             if (oldValue.targetClassName !== this._targetClassName) {
5046               throw "Related object must be a " + oldValue.targetClassName +
5047                   ", but a " + this._targetClassName + " was passed in.";
5048             }
5049           } else {
5050             oldValue.targetClassName = this._targetClassName;
5051           }
5052         }
5053         return oldValue;
5054       } else {
5055         throw "Op is invalid after previous op.";
5056       }
5057     }
5058   });
5059 
5060   NCMB.Op._registerDecoder("AddRelation", function(json) {
5061     return new NCMB.Op.Relation(NCMB._decode(undefined, json.objects), []);
5062   });
5063   NCMB.Op._registerDecoder("RemoveRelation", function(json) {
5064     return new NCMB.Op.Relation([], NCMB._decode(undefined, json.objects));
5065   });
5066 }(this));
5067 
5068 /************************************************** NCMB File class *****************************************/
5069 
5070 (function(root) {
5071   root.NCMB = root.NCMB || {};
5072   var NCMB = root.NCMB;
5073   var _ = NCMB._;
5074 
5075   var b64Digit = function(number) {
5076     if (number < 26) {
5077       return String.fromCharCode(65 + number);
5078     }
5079     if (number < 52) {
5080       return String.fromCharCode(97 + (number - 26));
5081     }
5082     if (number < 62) {
5083       return String.fromCharCode(48 + (number - 52));
5084     }
5085     if (number === 62) {
5086       return "+";
5087     }
5088     if (number === 63) {
5089       return "/";
5090     }
5091     throw "Tried to encode large digit " + number + " in base64.";
5092   };
5093 
5094   var encodeBase64 = function(array) {
5095     var chunks = [];
5096     chunks.length = Math.ceil(array.length / 3);
5097     _.times(chunks.length, function(i) {
5098       var b1 = array[i * 3];
5099       var b2 = array[i * 3 + 1] || 0;
5100       var b3 = array[i * 3 + 2] || 0;
5101 
5102       var has2 = (i * 3 + 1) < array.length;
5103       var has3 = (i * 3 + 2) < array.length;
5104 
5105       chunks[i] = [
5106         b64Digit((b1 >> 2) & 0x3F),
5107         b64Digit(((b1 << 4) & 0x30) | ((b2 >> 4) & 0x0F)),
5108         has2 ? b64Digit(((b2 << 2) & 0x3C) | ((b3 >> 6) & 0x03)) : "=",
5109         has3 ? b64Digit(b3 & 0x3F) : "="
5110       ].join("");
5111     });
5112     return chunks.join("");
5113   };
5114 
5115   
5116   // ファイルの拡張子とMIMEタイプのリストは以下リンクに参考：
5117   // http://stackoverflow.com/questions/58510/using-net-how-can-you-find-the-
5118   //     mime-type-of-a-file-based-on-the-file-signature
5119   var mimeTypes = {
5120     ai: "application/postscript",
5121     aif: "audio/x-aiff",
5122     aifc: "audio/x-aiff",
5123     aiff: "audio/x-aiff",
5124     asc: "text/plain",
5125     atom: "application/atom+xml",
5126     au: "audio/basic",
5127     avi: "video/x-msvideo",
5128     bcpio: "application/x-bcpio",
5129     bin: "application/octet-stream",
5130     bmp: "image/bmp",
5131     cdf: "application/x-netcdf",
5132     cgm: "image/cgm",
5133     "class": "application/octet-stream",
5134     cpio: "application/x-cpio",
5135     cpt: "application/mac-compactpro",
5136     csh: "application/x-csh",
5137     css: "text/css",
5138     dcr: "application/x-director",
5139     dif: "video/x-dv",
5140     dir: "application/x-director",
5141     djv: "image/vnd.djvu",
5142     djvu: "image/vnd.djvu",
5143     dll: "application/octet-stream",
5144     dmg: "application/octet-stream",
5145     dms: "application/octet-stream",
5146     doc: "application/msword",
5147     docx: "application/vnd.openxmlformats-officedocument.wordprocessingml." +
5148           "document",
5149     dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml." +
5150           "template",
5151     docm: "application/vnd.ms-word.document.macroEnabled.12",
5152     dotm: "application/vnd.ms-word.template.macroEnabled.12",
5153     dtd: "application/xml-dtd",
5154     dv: "video/x-dv",
5155     dvi: "application/x-dvi",
5156     dxr: "application/x-director",
5157     eps: "application/postscript",
5158     etx: "text/x-setext",
5159     exe: "application/octet-stream",
5160     ez: "application/andrew-inset",
5161     gif: "image/gif",
5162     gram: "application/srgs",
5163     grxml: "application/srgs+xml",
5164     gtar: "application/x-gtar",
5165     hdf: "application/x-hdf",
5166     hqx: "application/mac-binhex40",
5167     htm: "text/html",
5168     html: "text/html",
5169     ice: "x-conference/x-cooltalk",
5170     ico: "image/x-icon",
5171     ics: "text/calendar",
5172     ief: "image/ief",
5173     ifb: "text/calendar",
5174     iges: "model/iges",
5175     igs: "model/iges",
5176     jnlp: "application/x-java-jnlp-file",
5177     jp2: "image/jp2",
5178     jpe: "image/jpeg",
5179     jpeg: "image/jpeg",
5180     jpg: "image/jpeg",
5181     js: "application/x-javascript",
5182     kar: "audio/midi",
5183     latex: "application/x-latex",
5184     lha: "application/octet-stream",
5185     lzh: "application/octet-stream",
5186     m3u: "audio/x-mpegurl",
5187     m4a: "audio/mp4a-latm",
5188     m4b: "audio/mp4a-latm",
5189     m4p: "audio/mp4a-latm",
5190     m4u: "video/vnd.mpegurl",
5191     m4v: "video/x-m4v",
5192     mac: "image/x-macpaint",
5193     man: "application/x-troff-man",
5194     mathml: "application/mathml+xml",
5195     me: "application/x-troff-me",
5196     mesh: "model/mesh",
5197     mid: "audio/midi",
5198     midi: "audio/midi",
5199     mif: "application/vnd.mif",
5200     mov: "video/quicktime",
5201     movie: "video/x-sgi-movie",
5202     mp2: "audio/mpeg",
5203     mp3: "audio/mpeg",
5204     mp4: "video/mp4",
5205     mpe: "video/mpeg",
5206     mpeg: "video/mpeg",
5207     mpg: "video/mpeg",
5208     mpga: "audio/mpeg",
5209     ms: "application/x-troff-ms",
5210     msh: "model/mesh",
5211     mxu: "video/vnd.mpegurl",
5212     nc: "application/x-netcdf",
5213     oda: "application/oda",
5214     ogg: "application/ogg",
5215     pbm: "image/x-portable-bitmap",
5216     pct: "image/pict",
5217     pdb: "chemical/x-pdb",
5218     pdf: "application/pdf",
5219     pgm: "image/x-portable-graymap",
5220     pgn: "application/x-chess-pgn",
5221     pic: "image/pict",
5222     pict: "image/pict",
5223     png: "image/png", 
5224     pnm: "image/x-portable-anymap",
5225     pnt: "image/x-macpaint",
5226     pntg: "image/x-macpaint",
5227     ppm: "image/x-portable-pixmap",
5228     ppt: "application/vnd.ms-powerpoint",
5229     pptx: "application/vnd.openxmlformats-officedocument.presentationml." +
5230           "presentation",
5231     potx: "application/vnd.openxmlformats-officedocument.presentationml." +
5232           "template",
5233     ppsx: "application/vnd.openxmlformats-officedocument.presentationml." +
5234           "slideshow",
5235     ppam: "application/vnd.ms-powerpoint.addin.macroEnabled.12",
5236     pptm: "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
5237     potm: "application/vnd.ms-powerpoint.template.macroEnabled.12",
5238     ppsm: "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
5239     ps: "application/postscript",
5240     qt: "video/quicktime",
5241     qti: "image/x-quicktime",
5242     qtif: "image/x-quicktime",
5243     ra: "audio/x-pn-realaudio",
5244     ram: "audio/x-pn-realaudio",
5245     ras: "image/x-cmu-raster",
5246     rdf: "application/rdf+xml",
5247     rgb: "image/x-rgb",
5248     rm: "application/vnd.rn-realmedia",
5249     roff: "application/x-troff",
5250     rtf: "text/rtf",
5251     rtx: "text/richtext",
5252     sgm: "text/sgml",
5253     sgml: "text/sgml",
5254     sh: "application/x-sh",
5255     shar: "application/x-shar",
5256     silo: "model/mesh",
5257     sit: "application/x-stuffit",
5258     skd: "application/x-koan",
5259     skm: "application/x-koan",
5260     skp: "application/x-koan",
5261     skt: "application/x-koan",
5262     smi: "application/smil",
5263     smil: "application/smil",
5264     snd: "audio/basic",
5265     so: "application/octet-stream",
5266     spl: "application/x-futuresplash",
5267     src: "application/x-wais-source",
5268     sv4cpio: "application/x-sv4cpio",
5269     sv4crc: "application/x-sv4crc",
5270     svg: "image/svg+xml",
5271     swf: "application/x-shockwave-flash",
5272     t: "application/x-troff",
5273     tar: "application/x-tar",
5274     tcl: "application/x-tcl",
5275     tex: "application/x-tex",
5276     texi: "application/x-texinfo",
5277     texinfo: "application/x-texinfo",
5278     tif: "image/tiff",
5279     tiff: "image/tiff",
5280     tr: "application/x-troff",
5281     tsv: "text/tab-separated-values",
5282     txt: "text/plain",
5283     ustar: "application/x-ustar",
5284     vcd: "application/x-cdlink",
5285     vrml: "model/vrml",
5286     vxml: "application/voicexml+xml",
5287     wav: "audio/x-wav",
5288     wbmp: "image/vnd.wap.wbmp",
5289     wbmxl: "application/vnd.wap.wbxml",
5290     wml: "text/vnd.wap.wml",
5291     wmlc: "application/vnd.wap.wmlc",
5292     wmls: "text/vnd.wap.wmlscript",
5293     wmlsc: "application/vnd.wap.wmlscriptc",
5294     wrl: "model/vrml",
5295     xbm: "image/x-xbitmap",
5296     xht: "application/xhtml+xml",
5297     xhtml: "application/xhtml+xml",
5298     xls: "application/vnd.ms-excel",
5299     xml: "application/xml",
5300     xpm: "image/x-xpixmap",
5301     xsl: "application/xml",
5302     xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
5303     xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml." +
5304           "template",
5305     xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
5306     xltm: "application/vnd.ms-excel.template.macroEnabled.12",
5307     xlam: "application/vnd.ms-excel.addin.macroEnabled.12",
5308     xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
5309     xslt: "application/xslt+xml",
5310     xul: "application/vnd.mozilla.xul+xml",
5311     xwd: "image/x-xwindowdump",
5312     xyz: "chemical/x-xyz",
5313     zip: "application/zip"
5314   };
5315 
5316   /**
5317    * 
5318    * FileReaderを利用し、ファイルを読み込む
5319    * @param file {File} 読み込むファイル
5320    * @param type {String}  オーバーライドのためのMIMEタイプ（任意）
5321    * @return {NCMB.Promise} base64-encodedデーターの列とMIMEタイプを返却するプロミス
5322    */
5323    
5324   var readAsync = function(file, type) {
5325     var promise = new NCMB.Promise();
5326 
5327     if (typeof(FileReader) === "undefined") {
5328       return NCMB.Promise.error(new NCMB.Error(
5329           -1, "Attempted to use a FileReader on an unsupported browser."));
5330     }
5331 
5332     var reader = new FileReader();
5333     reader.onloadend = function() {
5334       if (reader.readyState !== 2) {
5335         promise.reject(new NCMB.Error(-1, "Error reading file."));
5336         return;
5337       }
5338       var dataURL = reader.result;
5339       // Guess the content type from the extension i//f we need to.
5340       var extension = /\.([^.]*)$/.exec(file.name);
5341       if (extension) {
5342         extension = extension[1].toLowerCase();
5343       }
5344       var guessedType = type || mimeTypes[extension] || "text/plain";
5345 
5346       //On chrome return the suitable file
5347       if (dataURL === "data:") {
5348         if (type)
5349           dataURL = "data:" + type + ";base64,";
5350         else {
5351           // Insert the datatype　手動的
5352           dataURL = "data:" + guessedType + ";base64,";
5353         }
5354       }
5355       
5356       var matches = /^data:([^;]*);base64,(.*)$/.exec(dataURL);
5357       var matches_android = /^data:base64,(.*)$/.exec(dataURL);
5358       if (!matches) {
5359         if (!matches_android) {
5360           promise.reject(
5361               new NCMB.Error(-1, "Unable to interpret data URL: " + dataURL));
5362           return;          
5363         }
5364         else { //android        
5365           promise.resolve(matches_android[1], type || guessedType);  
5366         }
5367       } else {
5368         promise.resolve(matches[2], type || matches[1]);        
5369       }
5370     };
5371     reader.readAsDataURL(file);
5372     return promise;
5373   };
5374   
5375 
5376   /**
5377    * NCMBのファイルを操作するクラスである。
5378    * @name NCMB.File
5379    * @namespace
5380    */
5381 
5382 
5383   NCMB.File = NCMB.Object.extend("File", 
5384   /** @lends NCMB.File.prototype */
5385   {
5386   /**
5387    *
5388    * NCMB.FileはNCMBに保存するためのファイルのロカール表現。　
5389    * @param name {String} ファイル名、ファイル名はユニークな値である。
5390    * @param data {Array} ファイルデーター、以下のフォーマットががる。
5391    *     1. or文字数字などのようなバイト値か
5392    *     2. { base64: "..." }のbase64エンコードされたオブジェクト
5393    *     3. ファイルアップロードコントロールから選択したファイルオブジェクト。
5394    * (3)は以下のブラウザー対象となる。Firefox 3.6+, Safari 6.0.2+, Chrome 7+, and IE 10+.
5395    *        例:<pre>
5396    * var fileUploadControl = $("#profilePhotoFileUpload")[0];
5397    * if (fileUploadControl.files.length > 0) {
5398    *   var file = fileUploadControl.files[0];
5399    *   var name = "photo.jpg";
5400    *   var NCMBFile = new NCMB.File(name, file);
5401    *   NCMBFile.save().then(function() {
5402    *     // The file has been saved to NCMB.
5403    *   }, function(error) {
5404    *     // The file either could not be read, or could not be saved to NCMB.
5405    *   });
5406    * }</pre>
5407    * @param type {String} 任意、ファイル用のコンテンツタイプのヘッダー。指定しない場合、拡張子からコンテンツタイプが判断される。
5408    * @memberOf
5409    */
5410 
5411     constructor: function(name, data, type, acl) {
5412       this._name = name;
5413       this._data = data;
5414       this._type = type; 
5415       if (_.isString(name) && (acl instanceof NCMB.ACL)) {
5416         NCMB.Object.prototype.constructor.call(this, null, null);
5417         this.ACL = acl;
5418       } else {
5419         NCMB.Object.prototype.constructor.call(this, name, data, type, acl);
5420       }
5421       // Guess the content type from the extension i//f we need to.
5422       var extension = /\.([^.]*)$/.exec(name);
5423       if (extension) {
5424         extension = extension[1].toLowerCase();
5425       }
5426       var guessedType = type || mimeTypes[extension] || "text/plain";
5427       if(!type) this._type = guessedType; //set type
5428 
5429       //this to change to file data -> no need
5430       if (_.isArray(data)) {
5431         this._source = NCMB.Promise.as(encodeBase64(data), guessedType);
5432       } else if (data && data.base64) {
5433         this._source = NCMB.Promise.as(data.base64, guessedType);
5434       } else if (typeof(File) !== "undefined" && data instanceof File) {
5435         this._source = readAsync(data, type);
5436       } else if (_.isString(data)) {
5437         throw "Creating a NCMB.File from a String is not yet supported.";
5438       }
5439     },
5440 
5441   /**
5442    * ファイルの名前を取得する。保存する前、ファイル名はユーザーに渡された値である。保存を行った後、名前が確定される。
5443    */
5444     getName: function() {
5445       return this._name;
5446     },
5447 
5448   /**
5449    * NCMBクラウドにファイルを保存する。
5450    * @param {Object} options Backbone対応するオプション
5451    * @return {NCMB.Promise} 保存が完了した後に、解決したプロミスを返却する。
5452    * @function
5453    */
5454     save: function(options) {
5455       var self = this;
5456       if (!self._previousSave) {
5457         self._previousSave = self._source.then(function(base64, type) {
5458           self._dataBase64 = base64;
5459           var data = {};
5460           data.file = self._data;
5461           if(self.ACL) {
5462             data.acl = JSON.stringify(self.ACL);
5463           }
5464           else {
5465             data.acl = JSON.stringify({ "*" : { "read" : true , "write" : true }}); //default is public read write
5466           }
5467 
5468           return NCMB._request("files", self._name, null, 'POST', data);
5469         }).then(function(response) {
5470           self._name = response.fileName;
5471           return self;
5472         });
5473       }
5474       return self._previousSave._thenRunCallbacks(options);
5475     },
5476 
5477     _destroy: function(options) {
5478       options = options || {};
5479       var model = this;
5480 
5481       var triggerDestroy = function() {
5482         model.trigger('destroy', model, model.collection, options);
5483       };
5484       var request =
5485           NCMB._request("files", self._name, null, 'DELETE');
5486       return request.then(function() {
5487         if (options.wait) {
5488           triggerDestroy();
5489         }
5490         return model;
5491       })._thenRunCallbacks(options, this);
5492     },
5493 
5494     _fetch: function(options) {
5495     }, 
5496 
5497     _getContentType: function() {
5498       return this._type;
5499     },
5500 
5501     _getData: function(options) {
5502       return this._data;
5503     },
5504   });
5505 
5506 }(this));
5507 
5508 /************************************************** NCMB ACL class *****************************************/
5509 
5510 /*global navigator: false */
5511 (function(root) {
5512   root.NCMB = root.NCMB || {};
5513   var NCMB = root.NCMB;
5514   var _ = NCMB._;
5515 
5516   var PUBLIC_KEY = "*";
5517 
5518   /**
5519    * 新しいACL Access control を作成する。
5520    * 変数がない時、ACLはすべてユーザーに権限なしを指定する。
5521    * 変数はNCMB.Userの場合、ACLはそのユーザーに読み込みと更新権限を指定する。
5522    * 変数がJSONオブジェクトである場合、そのオブジェクトがtoJSON()でACLとして読み取る。
5523    * @see NCMB.Object#setACL
5524    * @class
5525    *
5526    * <p>ユーザーのアクセスを制限させるため、ACLアクセスコントロールリストはすべて<code>NCMB.Object</code>に追加可能である。</p>
5527    */
5528   NCMB.ACL = function(arg1) {
5529     var self = this;
5530     self.permissionsById = {};
5531     if (_.isObject(arg1)) {
5532       if (arg1 instanceof NCMB.User) {
5533         self.setReadAccess(arg1, true);
5534         self.setWriteAccess(arg1, true);
5535       } else {
5536         if (_.isFunction(arg1)) {
5537           throw "NCMB.ACL() called with a function.  Did you forget ()?";
5538         }
5539         NCMB._objectEach(arg1, function(accessList, userId) {
5540           if (!_.isString(userId)) {
5541             throw "Tried to create an ACL with an invalid userId.";
5542           }
5543           self.permissionsById[userId] = {};
5544           NCMB._objectEach(accessList, function(allowed, permission) {
5545             if (permission !== "read" && permission !== "write") {
5546               throw "Tried to create an ACL with an invalid permission type.";
5547             }
5548             if (!_.isBoolean(allowed)) {
5549               throw "Tried to create an ACL with an invalid permission value.";
5550             }
5551             self.permissionsById[userId][permission] = allowed;
5552           });
5553         });
5554       }
5555     }
5556   };
5557 
5558   /**
5559    * ACLのJSONエンコードされたデーター。
5560    * @return {Object}　オブジェクト
5561    */
5562   NCMB.ACL.prototype.toJSON = function() {
5563     return _.clone(this.permissionsById);
5564   };
5565 
5566   NCMB.ACL.prototype._setAccess = function(accessType, userId, allowed) {
5567     if (userId instanceof NCMB.User) {
5568       userId = userId.id;
5569     } else if (userId instanceof NCMB.Role) {
5570       userId = "role:" + userId.getName();
5571     }
5572 
5573     if (!_.isString(userId)) {
5574       throw "userId must be a string.";
5575     }
5576     if (!_.isBoolean(allowed)) {
5577       throw "allowed must be either true or false.";
5578     }
5579     var permissions = this.permissionsById[userId];
5580     if (!permissions) {
5581       if (!allowed) {
5582         // The user already doesn't have this permission, so no action needed.
5583         return;
5584       } else {
5585         permissions = {};
5586         this.permissionsById[userId] = permissions;
5587       }
5588     }
5589 
5590     if (allowed) {
5591       this.permissionsById[userId][accessType] = true;
5592     } else {
5593       delete permissions[accessType];
5594       if (_.isEmpty(permissions)) {
5595         delete permissions[userId];
5596       }
5597     }
5598   };
5599 
5600   NCMB.ACL.prototype._getAccess = function(accessType, userId) {
5601     if (userId instanceof NCMB.User) {
5602       userId = userId.id;
5603     } else if (userId instanceof NCMB.Role) {
5604       userId = "role:" + userId.getName();
5605     }
5606     var permissions = this.permissionsById[userId];
5607     if (!permissions) {
5608       return false;
5609     }
5610     return permissions[accessType] ? true : false;
5611   };
5612 
5613   /**
5614    * 渡されたユーザーがオブジェクトを読み込み権限を許可する。
5615    * @param userId NCMB.UserのインスタンスかユーザーのオブジェクトID。
5616    * @param {Boolean} allowed ユーザーがアクセス権限を許可するかどうか。
5617    */
5618   NCMB.ACL.prototype.setReadAccess = function(userId, allowed) {
5619     this._setAccess("read", userId, allowed);
5620   };
5621 
5622   /**
5623    * 渡されたユーザーIDが明確にオブジェクトを読み込み権限を持っているかどうか。 
5624    * getPublicReadAccessがtrueの場合かユーザーが属するロールはアクセス許可される場合、
5625    * この関数でfalseが返却されたとしても、ユーザーがアクセス可能である。
5626    * @param userId NCMB.UserのインスタンスかユーザーのオブジェクトIDかNCMB.Role.
5627    * @return {Boolean}
5628    */
5629   NCMB.ACL.prototype.getReadAccess = function(userId) {
5630     return this._getAccess("read", userId);
5631   };
5632 
5633   /** 
5634    * 渡されたユーザーがオブジェクトを更新する権限を許可する。
5635    * @param userId NCMB.UserのインスタンスかユーザーのオブジェクトID。
5636    * @param {Boolean} allowed ユーザーがアクセス権限を許可するかどうか。
5637    */
5638   NCMB.ACL.prototype.setWriteAccess = function(userId, allowed) {
5639     this._setAccess("write", userId, allowed);
5640   };
5641 
5642   /**渡されたユーザーIDが明確にオブジェクトを更新する権限を持っているかどうか。
5643    * getPublicWriteAccessがtrueの場合かユーザーが属するロールはアクセス許可される場合、
5644    * この関数でfalseが返却されたとしても、ユーザーがアクセス可能である。
5645    * @param userId NCMB.UserのインスタンスかユーザーのオブジェクトIDかNCMB.Role.
5646    * @return {Boolean}
5647    */
5648   NCMB.ACL.prototype.getWriteAccess = function(userId) {
5649     return this._getAccess("write", userId);
5650   };
5651 
5652   /**パブリックがオブジェクトを読み込みが許可するかどうかを指定する。
5653    * @param {Boolean} allowed
5654    */
5655   NCMB.ACL.prototype.setPublicReadAccess = function(allowed) {
5656     this.setReadAccess(PUBLIC_KEY, allowed);
5657   };
5658 
5659   /**パブリックがオブジェクトを読み込みが許可するかどうかを取得する。
5660    * @return {Boolean}
5661    */
5662   NCMB.ACL.prototype.getPublicReadAccess = function() {
5663     return this.getReadAccess(PUBLIC_KEY);
5664   };
5665 
5666   /**パブリックがオブジェクトを更新が許可するかどうかを指定する。
5667    * @param {Boolean} allowed
5668    */
5669   NCMB.ACL.prototype.setPublicWriteAccess = function(allowed) {
5670     this.setWriteAccess(PUBLIC_KEY, allowed);
5671   };
5672 
5673   /**パブリックがオブジェクトを更新が許可するかどうかを取得する。
5674    * @return {Boolean}
5675    */
5676   NCMB.ACL.prototype.getPublicWriteAccess = function() {
5677     return this.getWriteAccess(PUBLIC_KEY);
5678   };
5679   
5680   /**渡されたロールが明確にオブジェクトを読み込む権限を持っているかどうか。 
5681    * 親ロールはアクセス許可される場合、この関数でfalseが返却されたとしても、ロールがアクセス可能である。
5682    * 
5683    * @param role ロール名かNCMB.Roleオブジェクト
5684    * @return {Boolean} ロールは読み込み許可かどうか。true：許可、false：そのほか
5685    * @throws {String} roleはNCMB.Roleか文字列ではない場合
5686    */
5687   NCMB.ACL.prototype.getRoleReadAccess = function(role) {
5688     if (role instanceof NCMB.Role) {
5689       // Normalize to the String name
5690       role = role.getName();
5691     }
5692     if (_.isString(role)) {
5693       return this.getReadAccess("role:" + role);
5694     }
5695     throw "role must be a NCMB.Role or a String";
5696   };
5697   
5698   /**渡されたロールが明確にオブジェクトを更新する権限を持っているかどうか。
5699    * 親ロールはアクセス許可される場合、この関数でfalseが返却されたとしても、ロールがアクセス可能である。
5700    * 
5701    * @param role ロール名かNCMB.Roleオブジェクト
5702    * @return {Boolean} ロールは読み込み許可かどうか。true：許可、false：そのほか
5703    * @throws {String} roleはNCMB.Roleか文字列ではない場合の例外
5704    */
5705   NCMB.ACL.prototype.getRoleWriteAccess = function(role) {
5706     if (role instanceof NCMB.Role) {
5707       // Normalize to the String name
5708       role = role.getName();
5709     }
5710     if (_.isString(role)) {
5711       return this.getWriteAccess("role:" + role);
5712     }
5713     throw "role must be a NCMB.Role or a String";
5714   };
5715   
5716   /**
5717    * ロールに属するユーザーがオブジェクトを読み込み許可するかどうかを指定する。
5718    * 
5719    * @param role ロール名かNCMB.Roleオブジェクト
5720    * @param {Boolean} allowed オブジェクトを読み込み可能かどうか
5721    * @throws {String} roleはNCMB.Roleか文字列ではない場合の例外
5722    */
5723   NCMB.ACL.prototype.setRoleReadAccess = function(role, allowed) {
5724     if (role instanceof NCMB.Role) {
5725       // Normalize to the String name
5726       role = role.getName();
5727     }
5728     if (_.isString(role)) {
5729       this.setReadAccess("role:" + role, allowed);
5730       return;
5731     }
5732     throw "role must be a NCMB.Role or a String";
5733   };
5734   
5735   /**
5736    * ロールに属するユーザーがオブジェクトを更新する許可するかどうかを指定する。
5737    * 
5738    * @param role ロール名かNCMB.Roleオブジェクト
5739    * @param {Boolean} allowed オブジェクトを読み込み可能かどうか
5740    * @throws {String} roleはNCMB.Roleか文字列ではない場合の例外
5741    */
5742   NCMB.ACL.prototype.setRoleWriteAccess = function(role, allowed) {
5743     if (role instanceof NCMB.Role) {
5744       // Normalize to the String name
5745       role = role.getName();
5746     }
5747     if (_.isString(role)) {
5748       this.setWriteAccess("role:" + role, allowed);
5749       return;
5750     }
5751     throw "role must be a NCMB.Role or a String";
5752   };
5753 }(this));
5754 
5755 /************************************************** NCMB Role class *****************************************/
5756 (function(root) {
5757   root.NCMB = root.NCMB || {};
5758   var NCMB = root.NCMB;
5759   var _ = NCMB._;
5760 
5761   /**
5762   　*　NCMBサーバーのロールを表現するクラス。　ロールの意味はユーザーをグルーピングさせ、権限を与える。
5763   　*　ロールは子ユーザーのセットと子ロールセットで指定される。子ユーザーおよび子ロールがすべて親ロールからの権限で指定される。
5764    *
5765    * <p>ロールはロール名を持っており、特定のACLが指定される。作成した後、ロール名が変更不可。</p>
5766    * @class
5767    * NCMB.RoleはNCMBクラウドのロールに対応するロカール表現である。
5768    */
5769   NCMB.Role = NCMB.Object.extend("role", /** @lends NCMB.Role.prototype */ {
5770     // Instance Methods
5771     
5772     /**
5773      * 渡された名前とACLからNCMBRoleオブジェクトを生成する。
5774      * 
5775      * @param {String} name 作成するロール。
5776      * @param {NCMB.ACL} acl ロールのACLオブジェクト（必須）
5777      */
5778     constructor: function(name, acl) {
5779       if (_.isString(name) && (acl instanceof NCMB.ACL)) {
5780         NCMB.Object.prototype.constructor.call(this, null, null);
5781         this.setName(name);
5782         this.setACL(acl);
5783       } else {
5784         NCMB.Object.prototype.constructor.call(this, name, acl);
5785       }
5786     },
5787     
5788     /**
5789      * ロール名を取得する。　role.get("name")でも取得可能である。
5790      * 
5791      * @return {String} ロール名
5792      */
5793     getName: function() {
5794       return this.get("roleName");
5795     },
5796     
5797     /**
5798      * ロール名を設定する。　ロールを保存する前、ロール名は必ず設定する必要がある。
5799      * ロールが保存されたら、再設定は不可になる。
5800      * 
5801      * <p>
5802      *   ロール名には英数字,_,-, スペースから含まれる。
5803      * </p>
5804      *
5805      * <p>この関数はrole.set("name", name)と同じ意味である。</p>
5806      * 
5807      * @param {String} name ロール名
5808      * @param {Object} options コールバック用の標準オプションsuccessとerrorがある。
5809      */
5810     setName: function(name, options) {
5811       return this.set("roleName", name, options);
5812     },
5813 
5814     _setRoles: function(roles, options) {
5815       return this.set("belongRole", roles, options);
5816     },
5817 
5818     _setUsers: function(users, options) {
5819       return this.set("belongUser", users, options);
5820     },        
5821     
5822     /**　
5823      * NCMB.Usersがロールの直接子ユーザーのNCMB.Relationを取得する。
5824     　*　子ユーザーはすべてロールの権限を持っている。リレーションからユーザーを追加およびロールから削除することができる。
5825      * 
5826      * <p>role.relation("users")と同じ意味である。</p>
5827      * 
5828      * @return {NCMB.Relation} 子ユーザーがロールに属するリレーションを返却する。
5829      */
5830     getUsers: function() {
5831       return this.relation("belongUser");
5832     },
5833     
5834     /**
5835      * ロールの直接子ロールのリレーションNCMB.Relationを取得する。
5836      *　子ロールはすべてロールの権限を持っている。
5837      *　リレーションからロールを追加およびロールから削除することができる。
5838      * 
5839      * <p> role.relation("roles")と同じ意味で実行する。</p>
5840      * 
5841      * @return {NCMB.Relation} 子ロールがロールに属するリレーションを返却する。
5842      */
5843     getRoles: function() {
5844       return this.relation("belongRole");
5845     },
5846     
5847     /**
5848      * @ignore
5849      */
5850     validate: function(attrs, options) {
5851       if ("roleName" in attrs && attrs.roleName !== this.getName()) {  
5852         var newName = attrs.roleName;
5853         if (this.id && this.id !== attrs.objectId) {
5854           // Check to see if the objectId being set matches this.id.
5855           // This happens during a fetch -- the id is set before calling fetch.
5856           // Let the name be set in this case.
5857           return new NCMB.Error(NCMB.Error.OTHER_CAUSE,
5858               "A role's name can only be set before it has been saved.");
5859         }
5860         if (!_.isString(newName)) {
5861           return new NCMB.Error(NCMB.Error.OTHER_CAUSE,
5862               "A role's name must be a String.");
5863         }
5864         if (!(/^[0-9a-zA-Z\-_ ]+$/).test(newName)) {
5865           return new NCMB.Error(NCMB.Error.OTHER_CAUSE,
5866               "A role's name can only contain alphanumeric characters, _," +
5867               " -, and spaces.");
5868         }
5869       }
5870       if (NCMB.Object.prototype.validate) {
5871         return NCMB.Object.prototype.validate.call(this, attrs, options);
5872       }
5873       return false;
5874     }
5875   });
5876 }(this));
5877 
5878 
5879 /************************************************** NCMB Query class *************************************/
5880 
5881 // NCMB.QueryはNCMB.Objectsのリストを取得するためクラスである。
5882 (function(root) {
5883   root.NCMB = root.NCMB || {};
5884   var NCMB = root.NCMB;
5885   var _ = NCMB._;
5886 
5887   /**指定されたNCMB.ObjectサブクラスからNCMB.Queryのクエリを作成する。
5888    * @param objectClass -　オブジェクトクラス、NCMB.Objectのサブクラスのインスタンスか、
5889    * string.NCMB.Objectのサブクラスインスタンス。
5890    * @class
5891    *
5892    * <p>NCMB.Queryはクエリを定義し、NCMB.Objectを取得するためのクエリを生成する。
5893    * 一番よく利用例はクエリを指定し、<code>find</code> メソッドを利用し、
5894    * すべてマッチしたオブジェクトの一覧を収得する使い方である。
5895    * 例えば、以下のサンプルコードで、すべて <code>MyClass</code>クラスのオブジェクトを取得可能である。
5896    * フェッチが成功したかどうかにより、コールバック関数がsuccessかerrorか実行させる。
5897    * <code>MyClass</code>クラスをフェッチする。
5898    * <pre>
5899    * var query = new NCMB.Query(MyClass);
5900    * query.find({
5901    *   success: function(results) {
5902    *     // results is an array of NCMB.Object.
5903    *   },
5904    *
5905    *   error: function(error) {
5906    *     // error is an instance of NCMB.Error.
5907    *   }
5908    * });</pre></p>
5909    * 
5910    * <p>クエリはIDが分かるオブジェクトの単体を取得す可能である。
5911    * 以下のサンプルコードにて、使用方法を確認できる。　
5912    * ものサンプルコードは <code>MyClass</code> クラスのオブジェクトと<code>myId</code>IDをフェッチするコードである。
5913    * フェッチが成功したかどうかにより、コールバック関数がsuccessかerrorか実行させる。
5914    * 
5915    * <pre>
5916    * var query = new NCMB.Query(MyClass);
5917    * query.get(myId, {
5918    *   success: function(object) {
5919    *     // object is an instance of NCMB.Object.NCMB.Objectのオブジェクトインスタンス
5920    *   },
5921    *
5922    *   error: function(object, error) {
5923    *     // error is an instance of NCMB.Error.NCMB.Errorのエラーインスタンス
5924    *   }
5925    * });</pre></p>
5926    * 
5927    * <p>NCMB.Queryを利用し、オブジェクトをすべて取得せず、オブジェクト数を把握することが可能である。
5928    * 例えば、以下のサンプルコードは<code>MyClass</code>クラスのオブジェクト数を取得する。
5929    * <pre>
5930    * var query = new NCMB.Query(MyClass);
5931    * query.count({
5932    *   success: function(number) {
5933    *     // There are number instances of MyClass.
5934    *   },
5935    *
5936    *   error: function(error) {
5937    *     // error is an instance of NCMB.Error.
5938    *   }
5939    * });</pre></p>
5940    */
5941   NCMB.Query = function(objectClass) {
5942     if (_.isString(objectClass)) {
5943       objectClass = NCMB.Object._getSubclass(objectClass);
5944     }
5945 
5946     this.objectClass = objectClass;
5947 
5948     this.className = objectClass.prototype.className;
5949     this._where = {};
5950     this._include = [];
5951     this._limit = -1; // negative limit means, do not send a limit
5952     this._skip = 0;
5953     this._extraOptions = {};
5954   };
5955 
5956   /**
5957    * NCMB.Queryの中にORが渡された時のクエリを生成する。例えば、以下のサンプルがある。
5958    * <pre>var compoundQuery = NCMB.Query.or(query1, query2, query3);</pre>
5959    *
5960    * query1, query2とquery3のOR条件で整合したクエリcompoundQueryが作成される。
5961    * @param {...NCMB.Query} var_args ORのクエリリスト
5962    * @return {NCMB.Query} OR条件が渡されたクエリ
5963    */
5964   NCMB.Query.or = function(queries) {
5965     var queries = _.toArray(arguments);
5966     var className = null;
5967     NCMB._arrayEach(queries, function(q) {
5968       if (_.isNull(className)) {
5969         className = q.className;
5970       }
5971 
5972       if (className !== q.className) {
5973         throw "All queries must be for the same class";
5974       }
5975     });
5976     var query = new NCMB.Query(className);
5977     query._orQuery(queries)
5978     return query;
5979   };
5980 
5981   NCMB.Query.prototype = {
5982     /**
5983      * 渡されたオブジェクトIDによりサーバーからオブジェクトをフェッチして、オブジェクトを生成する。　
5984      * フェッチが完了したら、options.successかoption.errorのコールバック関数は実行される。
5985      *
5986      * @param {} objectId フェッチするためのオブジェクトID
5987      * @param {Object} options オブジェクトのBackbone対応オプション
5988      */
5989     get: function(objectId, options) {
5990       var self = this;
5991       self.equalTo('objectId', objectId);
5992 
5993       return self.first().then(function(response) {
5994         if (response) {
5995           return response;
5996         }
5997 
5998         var errorObject = new NCMB.Error(NCMB.Error.OBJECT_NOT_FOUND,
5999                                           "Object not found.");
6000         return NCMB.Promise.error(errorObject);
6001 
6002       })._thenRunCallbacks(options, null);
6003     },
6004 
6005     /**
6006      * クエリのJSON表現を取得する。
6007      * @return {Object}　JSONオブジェクト
6008      */
6009     toJSON: function() {
6010       var params = {
6011         where: this._where
6012       };
6013 
6014       if (this._include.length > 0) {
6015         params.include = this._include.join(",");
6016       }
6017       if (this._select) {
6018         params.keys = this._select.join(",");
6019       }
6020       if (this._limit >= 0) {
6021         params.limit = this._limit;
6022       }
6023       if (this._skip > 0) {
6024         params.skip = this._skip;
6025       }
6026       if (this._order !== undefined) {
6027         params.order = this._order;
6028       }
6029 
6030       NCMB._objectEach(this._extraOptions, function(v, k) {
6031         params[k] = v;
6032       });
6033 
6034       return params;
6035     },
6036 
6037     /**
6038      * クエリに満たすNCMBオブジェクトのリストを取得する。
6039      * フェッチが完了したら、options.successかoption.errorのコールバック関数は実行される。
6040      *
6041      * @param {Object} options Backbone対応オプションオブジェクト
6042      * @return {NCMB.Promise} クエリが完了し、解決されたプロミスを返却する。
6043      */
6044     find: function(options) {
6045       var self = this;
6046 
6047       var request = NCMB._request("classes", this.className, null, "GET",
6048                                    this.toJSON());
6049 
6050       return request.then(function(response) {
6051         return _.map(response.results, function(json) {
6052           var obj;
6053           if (response.className) {
6054             obj = new NCMB.Object(response.className);
6055           } else {
6056             obj = new self.objectClass();
6057           }
6058           obj._finishFetch(json, true);
6059           return obj;
6060         });
6061       })._thenRunCallbacks(options);
6062     },
6063 
6064     /**
6065      * クエリにマッチするオブジェクトの数を取得する。
6066      * フェッチが完了したら、options.successかoption.errorのコールバック関数は実行される。 
6067      *
6068      * @param {Object} options Backbone対応オプションオブジェクト
6069      * @return {NCMB.Promise} クエリが完了し、解決されたプロミスを返却する。
6070      */
6071     count: function(options) {
6072       var params = this.toJSON();
6073       params.limit = 0;
6074       params.count = 1;
6075       var request = NCMB._request("classes", this.className, null, "GET",
6076                                    params);
6077 
6078       return request.then(function(response) {
6079         return response.count;
6080       })._thenRunCallbacks(options);
6081     },
6082 
6083     /**
6084      * クエリの条件に満たすNCMB.Objectを取得する。
6085      * フェッチが完了したら、options.successかoption.errorのコールバック関数は実行される。
6086      *
6087      * @param {Object} options Backbone対応オプションオブジェクト
6088      * @return {NCMB.Promise} クエリが完了し、解決されたプロミスを返却する。
6089      */
6090     first: function(options) {
6091       var self = this;
6092 
6093       var params = this.toJSON();
6094       params.limit = 1;
6095 
6096       var request = NCMB._request("classes", this.className, null, "GET",
6097                                    params);
6098 
6099       return request.then(function(response) {
6100         return _.map(response.results, function(json) {
6101           var obj = new self.objectClass();
6102           obj._finishFetch(json, true);
6103           return obj;
6104         })[0];
6105       })._thenRunCallbacks(options);
6106     },
6107 
6108     /**
6109      * クエリからNCMB.Collectionの新しいインスタンスを取得する。
6110      * @return {NCMB.Collection}　コレクション
6111      */
6112     collection: function(items, options) {
6113       options = options || {};
6114       return new NCMB.Collection(items, _.extend(options, {
6115         model: this.objectClass,
6116         query: this
6117       }));
6118     },
6119 
6120     /**
6121      * クエリの結果リストを取得する前に結果の項目をどのぐらいスキップするかをセットする。　
6122      * ページングをする時に便利のメソッド。
6123      * デフォルトは0件項目をスキップする。
6124      * @param {Number} n スキップするn個の結果
6125      * @return {NCMB.Query} チェーンにするクエリを返却する。
6126      */
6127     skip: function(n) {
6128       this._skip = n;
6129       return this;
6130     },
6131 
6132     /**
6133      * クエリの結果リストを取得する前に結果の項目をどのぐらい制限して取得するかをセットする。
6134      * 制限のデフォルト値は100である。1回リクエストすると、最大1000件の結果を取得可能である。
6135      * @param {Number} n 制限する数
6136      * @return {NCMB.Query} チェーンにするクエリを返却する。
6137      */
6138     limit: function(n) {
6139       this._limit = n;
6140       return this;
6141     },
6142 
6143     /**
6144      * 特定のキーの値が渡された値と同等する制限を追加する。
6145      * @param {String} key 　チェックするキー名
6146      * @param value NCMB.Objectが含まれる値
6147      * @return {NCMB.Query} チェーンにするクエリを返却する。
6148      */
6149     equalTo: function(key, value) {
6150       this._where[key] = NCMB._encode(value);
6151       return this;
6152     },
6153 
6154     /**
6155      * Helper for condition queries
6156      */
6157     _addCondition: function(key, condition, value) {
6158       // Check if we already have a condition
6159       if (!this._where[key]) {
6160         this._where[key] = {};
6161       }
6162       this._where[key][condition] = NCMB._encode(value);
6163       return this;
6164     },
6165 
6166     /**
6167      * 特定のキーの値が渡された値と同等しない制限を追加する。
6168      * 
6169      * @param {String} key 　チェックするキー名
6170      * @param value NCMB.Objectが含まれる値
6171      * @return {NCMB.Query} チェーンにするクエリを返却する。
6172      */
6173     notEqualTo: function(key, value) {
6174       this._addCondition(key, "$ne", value);
6175       return this;
6176     },
6177 
6178     /**
6179      * 特定のキーの値が渡された値と比べ、より小さい制限を追加する。
6180      * @param {String} key チェックするキー名
6181      * @param value 上限値
6182      * @return {NCMB.Query} チェーンにするクエリを返却する。
6183      */
6184     lessThan: function(key, value) {
6185       this._addCondition(key, "$lt", value);
6186       return this;
6187     },
6188 
6189     /**
6190      * 特定のキーの値が渡された値と比べ、より大きい制限を追加する。
6191      * @param {String} key 　チェックするキー名
6192      * @param value 最小限値
6193      * @return {NCMB.Query} チェーンにするクエリを返却する。
6194      */
6195     greaterThan: function(key, value) {
6196       this._addCondition(key, "$gt", value);
6197       return this;
6198     },
6199 
6200     /**
6201      * 特定のキーの値が渡された値と比べ、より小さいか同等かの制限を追加する。
6202      * 
6203      * @param {String} key 　チェックするキー名
6204      * @param value 上限値
6205      * @return {NCMB.Query} チェーンにするクエリを返却する。
6206      */
6207     lessThanOrEqualTo: function(key, value) {
6208       this._addCondition(key, "$lte", value);
6209       return this;
6210     },
6211 
6212     /**
6213      * 特定のキーの値が渡された値と比べ、より大きいか同等かの制限をクエリに追加する。
6214      * @param {String} key チェックするキー名
6215      * @param value 最小限値
6216      * @return {NCMB.Query} チェーンにするクエリを返却する。
6217      */
6218     greaterThanOrEqualTo: function(key, value) {
6219       this._addCondition(key, "$gte", value);
6220       return this;
6221     },
6222 
6223     /**
6224      * 特定のキーの値が値のリストに属する制限をクエリに追加する。
6225      * 
6226      * @param {String} key チェックするキー名
6227      * @param {Array} values マッチする値の配列。
6228      * @return {NCMB.Query} チェーンにするクエリを返却する。
6229      */
6230     containedIn: function(key, values) {
6231       this._addCondition(key, "$in", values);
6232       return this;
6233     },
6234 
6235     /**
6236      * 特定のキーの値が値のリストに属しない制限をクエリに追加する。
6237      * 
6238      * @param {String} key チェックするキー名
6239      * @param {Array} values マッチする値の配列。
6240      * @return {NCMB.Query} チェーンにするクエリを返却する。
6241      */
6242     notContainedIn: function(key, values) {
6243       this._addCondition(key, "$nin", values);
6244       return this;
6245     },
6246 
6247     /**
6248      * 特定のキーの値が値のリストはすべて値リストが含まれる制限をクエリに追加する。
6249      * @param {String} key 　チェックするキー名
6250      * @param {Array} values .マッチする値の配列。
6251      * @return {NCMB.Query} チェーンにするクエリを返却する。
6252      */
6253     containsAll: function(key, values) {
6254       this._addCondition(key, "$all", values);
6255       return this;
6256     },
6257 
6258 
6259     /**
6260      * 渡されたキーを含まれる制限を追加する。
6261      * @param {String} key 　チェックするキー名
6262      * @return {NCMB.Query} チェーンにするクエリを返却する。
6263      */
6264     exists: function(key) {
6265       this._addCondition(key, "$exists", true);
6266       return this;
6267     },
6268 
6269     /**
6270      * 渡されたキーが含まらないオブジェクトの制限を追加する。
6271      * @param {String} key チェックするキー名
6272      * @return {NCMB.Query} チェーンにするクエリを返却する。
6273      */
6274     doesNotExist: function(key) {
6275       this._addCondition(key, "$exists", false);
6276       return this;
6277     },
6278 
6279     /**
6280      * 正規表現にマッチする文字列を取得るすため、
6281      * 制限をクエリに追加する。
6282      * データーセットが大きい場合、実行速度に恐れがある。
6283      * @param {String} key マッチする文字列のキーである。
6284      * @param {RegExp} regex マッチする正規表現のパターン。
6285      * @return {NCMB.Query} チェーンにするクエリを返却する。
6286      */
6287     matches: function(key, regex, modifiers) {
6288       this._addCondition(key, "$regex", regex);
6289       if (!modifiers) { modifiers = ""; }
6290       // Javascript regex options support mig as inline options but store them 
6291       // as properties of the object. We support mi & should migrate them to
6292       // modifiers
6293       if (regex.ignoreCase) { modifiers += 'i'; }
6294       if (regex.multiline) { modifiers += 'm'; }
6295 
6296       if (modifiers && modifiers.length) {
6297         this._addCondition(key, "$options", modifiers);
6298       }
6299       return this;
6300     },
6301 
6302     /**
6303      * NCMB.Queryの制限にマッチする制限をクエリに追加する。
6304      * @param {String} key マッチするオブジェクトのキー名
6305      * @param {NCMB.Query} query マッチするクエリ
6306      * @return {NCMB.Query} チェーンにするクエリを返却する。
6307      */
6308     matchesQuery: function(key, query) {
6309       var queryJSON = query.toJSON();
6310       queryJSON.className = query.className;
6311       this._addCondition(key, "$inQuery", queryJSON);
6312       return this;
6313     },
6314 
6315    /** NCMB.Queryの制限にマッチしないようにする制限をクエリに追加する。
6316      * 
6317      * @param {String} key マッチしないオブジェクトのキー名
6318      * @param {NCMB.Query} query マッチしないクエリ
6319      * @return {NCMB.Query} チェーンにするクエリを返却する。
6320      */
6321     doesNotMatchQuery: function(key, query) {
6322       var queryJSON = query.toJSON();
6323       queryJSON.className = query.className;
6324       this._addCondition(key, "$notInQuery", queryJSON);
6325       return this;
6326     },
6327 
6328     /**ほかのNCMB.Queryの制限にマッチするキーの値を利用し、制限をクエリに追加する。
6329      * 
6330      * @param {String} key マッチする値を含まれるキー名
6331      * @param {String} queryKey 再マッチするためクエリから取得したオブジェクトのキー名
6332      * @param {NCMB.Query} query 実行するクエリ
6333      * @return {NCMB.Query} チェーンにするクエリを返却する。
6334      */
6335     matchesKeyInQuery: function(key, queryKey, query) {
6336 
6337       var queryJSON = query.toJSON();
6338       var newQueryJSON = {};
6339       newQueryJSON.className = query.className;
6340       newQueryJSON["where"] = queryJSON.where;
6341       this._addCondition(key, "$select", {query: newQueryJSON,  key: queryKey });
6342       return this;
6343     },
6344 
6345     /**
6346      * ほかのNCMB.Queryの制限にマッチするオブジェクトの値にキーの値をマッチしない制限をクエリに追加する。
6347      * 
6348      * @param {String} key マッチする値を含まれるキー名
6349      * @param {String} queryKey 再マッチするためクエリから取得したオブジェクトのキー名
6350      * @param {NCMB.Query} query 実行するクエリ
6351      * @return {NCMB.Query} チェーンにするクエリを返却する。
6352      */
6353     doesNotMatchKeyInQuery: function(key, queryKey, query) {
6354       var queryJSON = query.toJSON();
6355       queryJSON.className = query.className;
6356       this._addCondition(key, "$dontSelect",
6357                          { key: queryKey, query: queryJSON });
6358       return this;
6359     },
6360 
6361     /**
6362      * Add constraint that at least one of the passed in queries matches.
6363      * @param {Array} queries
6364      * @return {NCMB.Query} Returns the query, so you can chain this call.
6365      */
6366     _orQuery: function(queries) {
6367       var queryJSON = _.map(queries, function(q) {
6368         return q.toJSON().where;
6369       });
6370 
6371       this._where.$or = queryJSON;
6372       return this;
6373     },
6374 
6375     /**
6376      * Converts a string into a regex that matches it.
6377      * Surrounding with \Q .. \E does this, we just need to escape \E's in
6378      * the text separately.
6379      */
6380     _quote: function(s) {
6381       return "\\Q" + s.replace("\\E", "\\E\\\\E\\Q") + "\\E";
6382     },
6383 
6384     /**
6385      * 渡されたキーに対す値リストの結果を上昇順にソートする。
6386      * 
6387      * @param {String} key 　ソートするキー名
6388      * @return {NCMB.Query} チェーンにするクエリを返却する。
6389      */
6390     ascending: function(key) {
6391       this._order = key;
6392       return this;
6393     },
6394 
6395     /**
6396      * 渡されたキーに対す値リストの結果を降下順にソートする。
6397      * 
6398      * @param {String} key ソートするキー名
6399      * @return {NCMB.Query} チェーンにするクエリを返却する。
6400      */
6401     descending: function(key) {
6402       this._order = "-" + key;
6403       return this;
6404     },
6405 
6406    
6407     /**
6408      * 渡されたキーに対するNCMB.Objectsが含まれる。
6409      * ドットの記号を利用し、含まれたオブジェクトのどこのフィールドをフェッチするか指定可能である。
6410      * @param {String} key 含まれたキー名
6411      * @return {NCMB.Query} チェーンにするクエリを返却する。
6412      */
6413     include: function() {
6414       var self = this;
6415       NCMB._arrayEach(arguments, function(key) {
6416         if (_.isArray(key)) {
6417           self._include = self._include.concat(key);
6418         } else {
6419           self._include.push(key);
6420         }
6421       });
6422       return this;
6423     },
6424 
6425     relatedTo: function(object, className, key) {
6426       var self = this;
6427       var objectJSON = {};
6428       objectJSON.__type = "Pointer";
6429       objectJSON.className = className;
6430       objectJSON.objectId = object;
6431       self._addCondition("$relatedTo", "object", objectJSON);
6432       self._addCondition("$relatedTo", "key", key);
6433       return this;
6434     },
6435 
6436     /**
6437      * 渡されたキーが含まれるNCMB.Objects、フィールドを制限し、取得する。
6438      * @param {Array} keys 含まれるキー名
6439      * @return {NCMB.Query} チェーンにするクエリを返却する。
6440      */
6441     select: function() {
6442       var self = this;
6443       this._select = this._select || [];
6444       NCMB._arrayEach(arguments, function(key) {
6445         if (_.isArray(key)) {
6446           self._select = self._select.concat(key);
6447         } else {
6448           self._select.push(key);
6449         }
6450       });
6451       return this;
6452     },
6453 
6454     /**
6455      * 結果の一つずつ項目を繰り返し、コールバックを実施する。コールバックはプロミスとして返却する場合、
6456      * プロミスが成功に終了するまでに繰り返しを続かない。
6457      * コールバックは拒否コールバックとして返却する場合、繰り返しが終了になり、エラーを返却する。
6458      * 項目は指定しない順番で実施し、ソート順番および制限とスキップの指定は不可である。
6459      * @param callback {Function} それぞれのクエリの結果で実行されるコールバック
6460      * @param options {Object} Backbone対応のオプション。successかerrorか実行結果により、コールバック関数が実行される。
6461      * @return {NCMB.Promise} 繰り返しが完了した後、プロミスを返却する。
6462      */
6463     each: function(callback, options) {
6464       options = options || {};
6465 
6466       if (this._order || this._skip || (this._limit >= 0)) {
6467         var error =
6468           "Cannot iterate on a query with sort, skip, or limit.";
6469         return NCMB.Promise.error(error)._thenRunCallbacks(options);
6470       }
6471 
6472       var promise = new NCMB.Promise();
6473 
6474       var query = new NCMB.Query(this.objectClass);
6475       // We can override the batch size from the options.
6476       // This is undocumented, but useful for testing.
6477       query._limit = options.batchSize || 100;
6478       query._where = _.clone(this._where);
6479       query._include = _.clone(this._include);
6480 
6481       query.ascending('objectId');
6482 
6483       var finished = false;
6484       return NCMB.Promise._continueWhile(function() {
6485         return !finished;
6486 
6487       }, function() {
6488         return query.find().then(function(results) {
6489           var callbacksDone = NCMB.Promise.as();
6490           NCMB._.each(results, function(result) {
6491             callbacksDone = callbacksDone.then(function() {
6492               return callback(result);
6493             });
6494           });
6495 
6496           return callbacksDone.then(function() {
6497             if (results.length >= query._limit) {
6498               query.greaterThan("objectId", results[results.length - 1].id);
6499             } else {
6500               finished = true;
6501             }
6502           });
6503         });
6504       })._thenRunCallbacks(options);
6505     }
6506   };
6507 }(this));
6508 
6509 
6510 /************************************************** NCMB User class *************************************/
6511 
6512 (function(root) {
6513   root.NCMB = root.NCMB || {};
6514   var NCMB = root.NCMB;
6515   var _ = NCMB._;
6516 
6517   /**
6518    * @class
6519    *
6520    * <p>NCMB.UserオブジェクトはNCMBクラウドに保存するユーザーのロカール表現である。
6521    * NCMB.Objectのサブクラスであり、NCMB.Objectと同じ関数を持っており、ユーザー関数をより多くメソッドを拡張する。
6522    * 例えば、ユーザー認証、サインアップ、独自性のバリデーションなど.
6523    </p>
6524    */
6525     NCMB.User = NCMB.Object.extend("user", 
6526     /** @lends NCMB.User.prototype */ 
6527     {
6528     // Instance Variables
6529     _isCurrentUser: false,
6530 
6531     // Instance Methods
6532 
6533     /**
6534      * Internal method to handle special fields in a _User response.
6535      */
6536     _mergeMagicFields: function(keys) {
6537       if (keys.sessionToken) {
6538         this._sessionToken = keys.sessionToken;
6539         delete keys.sessionToken;
6540       }
6541       NCMB.User.__super__._mergeMagicFields.call(this, keys);
6542     },
6543 
6544     /**
6545      * Removes null values from authData (which exist temporarily for
6546      * unlinking)
6547      */
6548     _cleanupAuthData: function() {
6549       if (!this.isCurrent()) {
6550         return;
6551       }
6552       var authData = this.get('authData');
6553       if (!authData) {
6554         return;
6555       }
6556       NCMB._objectEach(this.get('authData'), function(value, key) {
6557         if (!authData[key]) {
6558           delete authData[key];
6559         }
6560       });
6561     },
6562 
6563     /**
6564      * Synchronizes authData for all providers.
6565      */
6566     _synchronizeAllAuthData: function() {
6567       var authData = this.get('authData');
6568       if (!authData) {
6569         return;
6570       }
6571 
6572       var self = this;
6573       NCMB._objectEach(this.get('authData'), function(value, key) {
6574         self._synchronizeAuthData(key);
6575       });
6576     },
6577 
6578     /**
6579      * Synchronizes auth data for a provider (e.g. puts the access token in the
6580      * right place to be used by the Facebook SDK).
6581      */
6582     _synchronizeAuthData: function(provider) {
6583       if (!this.isCurrent()) {
6584         return;
6585       }
6586       var authType;
6587       if (_.isString(provider)) {
6588         authType = provider;
6589         provider = NCMB.User._authProviders[authType];
6590       } else {
6591         authType = provider.getAuthType();
6592       }
6593       var authData = this.get('authData');
6594       if (!authData || !provider) {
6595         return;
6596       }
6597       var success = provider.restoreAuthentication(authData[authType]);
6598       if (!success) {
6599         this._unlinkFrom(provider);
6600       }
6601     },
6602 
6603     _handleSaveResult: function(makeCurrent) {
6604       // Clean up and synchronize the authData object, removing any unset values
6605       if (makeCurrent) {
6606         this._isCurrentUser = true;
6607       }
6608       this._cleanupAuthData();
6609       this._synchronizeAllAuthData();
6610       // Don't keep the password around.
6611       delete this._serverData.password;
6612       this._rebuildEstimatedDataForKey("password");
6613       this._refreshCache();
6614       if (makeCurrent || this.isCurrent()) {
6615         NCMB.User._saveCurrentUser(this);
6616       }
6617     },
6618 
6619     /**
6620      * Unlike in the Android/iOS SDKs, logInWith is unnecessary, since you can
6621      * call linkWith on the user (even if it doesn't exist yet on the server).
6622      */
6623     _linkWith: function(provider, options) {
6624       var authType;
6625       if (_.isString(provider)) {
6626         authType = provider;
6627         provider = NCMB.User._authProviders[provider];
6628       } else {
6629         authType = provider.getAuthType();
6630       }
6631       if (_.has(options, 'authData')) {
6632         var authData = this.get('authData') || {};
6633         authData[authType] = options.authData;
6634 
6635         //date 処理 
6636         if( authType == "facebook" ) {
6637           if(authData[authType]) 
6638             if(authData[authType]["expiration_date"]) {
6639               authData[authType]["expiration_date"] = {"__type": "Date", "iso": authData[authType]["expiration_date"]};
6640             }
6641         }
6642         this.set('authData', authData); 
6643         // Overridden so that the user can be made the current user.
6644         var newOptions = _.clone(options) || {};
6645         newOptions.success = function(model) {
6646           model._handleSaveResult(true);
6647           if (options.success) {
6648             options.success.apply(this, arguments);
6649           }
6650         };
6651 
6652         return this.save({'authData': authData}, newOptions);
6653       } else {
6654         var self = this;
6655         var promise = new NCMB.Promise();
6656         provider.authenticate({
6657           success: function(provider, result) {
6658             self._linkWith(provider, {
6659               authData: result,
6660               success: options.success,
6661               error: options.error
6662             }).then(function() {
6663               promise.resolve(self);
6664             });
6665           },
6666           error: function(provider, error) {
6667             if (options.error) {
6668               options.error(self, error);
6669             }
6670             promise.reject(error);
6671           }
6672         });
6673         return promise;
6674       }
6675     },
6676 
6677     /**
6678      * Unlinks a user from a service.
6679      */
6680     _unlinkFrom: function(provider, options) {
6681       var authType;
6682       if (_.isString(provider)) {
6683         authType = provider; 
6684       } else {
6685         authType = provider.getAuthType();
6686       }
6687       var newOptions = _.clone(options);
6688       var self = this;
6689       if(!newOptions) 
6690         newOptions = {};
6691       newOptions.authData = null;
6692       newOptions.success = function(model) {
6693         self._synchronizeAuthData(provider);
6694         if(options)
6695           if (options.success) {
6696             options.success.apply(this, arguments);
6697           }
6698       };
6699       return this._linkWith(provider, newOptions);
6700     },
6701 
6702     /**
6703      * Checks whether a user is linked to a service.
6704      */
6705     _isLinked: function(provider) {
6706       var authType;
6707       if (_.isString(provider)) {
6708         authType = provider;
6709       } else {
6710         authType = provider.getAuthType();
6711       }
6712       var authData = this.get('authData') || {};
6713       return !!authData[authType];
6714     },
6715 
6716     /**
6717      * Deauthenticates all providers.
6718      */
6719     _logOutWithAll: function() {
6720       var authData = this.get('authData');
6721       if (!authData) {
6722         return;
6723       }
6724       var self = this;
6725       NCMB._objectEach(this.get('authData'), function(value, key) {
6726         self._logOutWith(key);
6727       });
6728     },
6729 
6730     /**
6731      * Deauthenticates a single provider (e.g. removing access tokens from the
6732      * Facebook SDK).
6733      */
6734     _logOutWith: function(provider) {
6735       if (!this.isCurrent()) {
6736         return;
6737       }
6738       if (_.isString(provider)) {
6739         provider = NCMB.User._authProviders[provider];
6740       }
6741       if (provider && provider.deauthenticate) {
6742         provider.deauthenticate();
6743       }
6744     },
6745 
6746     /**
6747      * 新しいユーザーをサインアップする。NCMB.Usersのsave関数を利用するより、sign up関数を利用した方が良い。
6748      * サーバーに新しいNCMB.Userを作成し、サーバーに保存し、
6749      * ロカールでセッションを保持し、<code>current</code>で、現在のユーザーをアクセスできる。
6750      *
6751      * <p>サインアップする前、ユーザー名とパスワードをセットする必要がある。</p>
6752      *
6753      * <p>完了した後、options.successかoptions.errorを実行させる。</p>
6754      *
6755      * @param {Object} attrs nullか新しいユーザーに追加したいフィールド。
6756      * @param {Object} options Backbone対応のオプションオブジェクト。
6757      * @return {NCMB.Promise} サインアップを完了した後、解決したプロミス。
6758      * @see NCMB.User.signUp
6759      */
6760     signUp: function(attrs, options) {
6761       var error;
6762       options = options || {};
6763 
6764       var userName = (attrs && attrs.userName) || this.get("userName");
6765       if (!userName || (userName === "")) {
6766         error = new NCMB.Error(
6767             NCMB.Error.OTHER_CAUSE,
6768             "Cannot sign up user with an empty name.");
6769         if (options && options.error) {
6770           options.error(this, error);
6771         }
6772         return NCMB.Promise.error(error);
6773       }
6774       var password = (attrs && attrs.password) || this.get("password");
6775       if (!password || (password === "")) {
6776         error = new NCMB.Error(
6777             NCMB.Error.OTHER_CAUSE,
6778             "Cannot sign up user with an empty password.");
6779         if (options && options.error) {
6780           options.error(this, error);
6781         }
6782         return NCMB.Promise.error(error);
6783       }
6784 
6785       // Overridden so that the user can be made the current user.
6786       var newOptions = _.clone(options);
6787       newOptions.success = function(model) {
6788         model._handleSaveResult(true);
6789         if (options.success) {
6790           options.success.apply(this, arguments);
6791         }
6792       };
6793       return this.save(attrs, newOptions);
6794     },
6795 
6796     /**
6797      * NCMB.Userにログインする。成功する時、ロカールストレージにセッションが保存され、
6798      * 現在ログインしているユーザーのデーターが<code>current</code>にてアクセス可能である。
6799      *
6800      * <p>ログインする前に、ユーザー名とパスワードを設定する必要がある。</p>
6801      *
6802      * <p>完了した後、options.successかoptions.errorを実行させる。</p>
6803      *
6804      * @param {Object} 　Backbone対応のオプションオブジェクト。
6805      * @see NCMB.User.logIn
6806      * @return {NCMB.Promise} ログインを完了した後、解決したプロミス。
6807      */
6808     logIn: function(options) {
6809       var model = this;
6810       var request = NCMB._request("login", null, null, "GET", this.toJSON());
6811       return request.then(function(resp, status, xhr) {
6812         var serverAttrs = model.parse(resp, status, xhr);
6813         model._finishFetch(serverAttrs);
6814         model._handleSaveResult(true);
6815         return model;
6816       })._thenRunCallbacks(options, this);
6817     },
6818 
6819     /**
6820      * @see NCMB.Object#save
6821      */
6822     save: function(keys, options) {
6823       var i, attrs, current, options, saved;
6824       attrs = keys;
6825       options = options || {};
6826 
6827       var newOptions = _.clone(options);
6828       newOptions.success = function(model) {
6829         model._handleSaveResult(false);
6830         if (options.success) {
6831           options.success.apply(this, arguments);
6832         }
6833       };
6834       return NCMB.Object.prototype.save.call(this, attrs, newOptions);
6835     },
6836 
6837     /**
6838      * @see NCMB.Object#fetch
6839      */
6840     fetch: function(options) {
6841       var newOptions = options ? _.clone(options) : {};
6842       newOptions.success = function(model) {
6843         model._handleSaveResult(false);
6844         if (options && options.success) {
6845           options.success.apply(this, arguments);
6846         }
6847       };
6848       return NCMB.Object.prototype.fetch.call(this, newOptions);
6849     },
6850 
6851     /**
6852      * 現在のユーザーは<code>current</code>の場合、trueとして返却する。
6853      * @see NCMB.User#current
6854      */
6855     isCurrent: function() {
6856       return this._isCurrentUser;
6857     },
6858 
6859     /**
6860      * get("userName")を返却する。
6861      * @return {String}
6862      * @see NCMB.Object#get
6863      */
6864     getUsername: function() {
6865       return this.get("userName");
6866     },
6867 
6868     /**
6869      * set("userName", userName, options)を実行させ、結果を返却する。
6870      * @param {String} ユーザー名
6871      * @param {Object} options Backbone対応のオプションオブジェクト。
6872      * @return {Boolean}
6873      * @see NCMB.Object.set
6874      */
6875     setUsername: function(userName, options) {
6876       return this.set("userName", userName, options);
6877     },
6878 
6879     /**
6880      * set("password", password, options)を実行させ、結果を返却する。
6881      * @param {String} パスワード
6882      * @param {Object} options Backbone対応のオプションオブジェクト。
6883      * @return {Boolean}
6884      * @see NCMB.Object.set
6885      */
6886     setPassword: function(password, options) {
6887       return this.set("password", password, options);
6888     },
6889 
6890     /**
6891      * get("email")を返却する。
6892      * @return {String}
6893      * @see NCMB.Object#get
6894      */
6895     getEmail: function() {
6896       return this.get("mailAddress");
6897     },
6898 
6899     /**
6900      * set("email", email, options)を実行させ、結果を返却する。
6901      * @param {String} メールアドレス
6902      * @param {Object} options Backbone対応のオプションオブジェクト。
6903      * @return {Boolean}
6904      * @see NCMB.Object.set
6905      */
6906     setEmail: function(email, options) {
6907       return this.set("mailAddress", email, options);
6908     },
6909 
6910     /**
6911      * ユーザーオブジェクトは現在のユーザーかどうかと認証されたかどうかをチェックし、結果を返却する。
6912      * @return (Boolean) ユーザーは現在ユーザーかどうか、ログインしたかどうかを確認結果
6913      */
6914     authenticated: function() {
6915       return !!this._sessionToken &&
6916           (NCMB.User.current() && NCMB.User.current().id === this.id);
6917     }
6918 
6919   }, /** @lends NCMB.User */ {
6920     // Class Variables
6921 
6922     // The currently logged-in user.
6923     _currentUser: null,
6924 
6925     // Whether currentUser is known to match the serialized version on disk.
6926     // This is useful for saving a localstorage check if you try to load
6927     // _currentUser frequently while there is none stored.
6928     _currentUserMatchesDisk: false,
6929 
6930     // The localStorage key suffix that the current user is stored under.
6931     _CURRENT_USER_KEY: "currentUser",
6932 
6933     // The mapping of auth provider names to actual providers
6934     _authProviders: {},
6935 
6936 
6937     // Class Methods
6938 
6939     /**
6940      * 新しいユーザーをサインアップする。NCMB.Usersのsave関数を利用するより、sign up関数を利用した方が良い。
6941      *  サーバーに新しいNCMB.Userを作成し、サーバーに保存し、ロカールでセッションを保持し、
6942      *  <code>current</code>で、現在のユーザーをアクセスできる。
6943      *
6944      * <p>完了した後、options.successかoptions.errorを実行させる。</p>
6945      *
6946      * @param {String} username サインアップ用のユーザー名（メールアドレス）
6947      * @param {String} password サインアップ用のパスワード
6948      * @param {Object} attrs nullか新しいユーザーに追加したいフィールド.
6949      * @param {Object} options Backbone対応のオプションオブジェクト。
6950      * @return {NCMB.Promise} サインアップを完了した後、解決したプロミス。
6951      * @see NCMB.User#signUp
6952      */
6953     signUp: function(userName, password, attrs, options) {
6954       attrs = attrs || {};
6955       attrs.userName = userName;
6956       attrs.password = password;
6957       var user = NCMB.Object._create("user");
6958       return user.signUp(attrs, options);
6959     },
6960 
6961 
6962     /**
6963      * NCMB.Userにログインする。成功する時、ロカールストレージにセッションが保存され、
6964      * 現在ログインしているユーザーのデーターが<code>current</code>にてアクセス可能である。
6965      *
6966      * <p>完了した後、options.successかoptions.errorを実行させる。</p>
6967      *
6968      * @param {String} userName サインアップ用のユーザー名（メールアドレス）
6969      * @param {String} password サインアップ用のパスワード
6970      * @param {Object} options 　Backbone対応のオプションオブジェクト。
6971      * @see NCMB.User.logIn
6972      * @return {NCMB.Promise} ログインを完了した後、解決したプロミス。
6973      */
6974     logIn: function(userName, password, options) {
6975       var user = NCMB.Object._create("user");
6976       user._finishFetch({ userName: userName, password: password });
6977       return user.logIn(options);
6978     },
6979 
6980     /**
6981      * 現在ログイン中のユーザーセッションから、ログアウトする。　
6982      * ロカールからセッションを削除し、連携サービスをログアウトする。ログアウトが完了すると、
6983      * <code>current</code>の結果は<code>null</code>を返却する。
6984      */
6985     logOut: function() {
6986       if (NCMB.User._currentUser !== null) {
6987         NCMB.User._currentUser._logOutWithAll();
6988         NCMB.User._currentUser._isCurrentUser = false;
6989       }
6990       NCMB.User._currentUserMatchesDisk = true;
6991       NCMB.User._currentUser = null;
6992       NCMB.localStorage.removeItem(
6993           NCMB._getNCMBPath(NCMB.User._CURRENT_USER_KEY));
6994     },
6995 
6996     /**
6997      * ユーザーアカウントに登録した特定メールアドレスにパスワードリセット依頼メールを送信することを依頼する。
6998      * このメールで、安全にユーザーパスワードをリセットすることができる。
6999      *
7000      * <p>完了する時、options.successかoptions.errorを実行させる。</p>
7001      *
7002      * @param {String} email パスワードをリクエストユーザーのメールアドレス。
7003      * @param {Object} options Backbone対応のオプションオブジェクト
7004      */
7005     requestPasswordReset: function(email, options) {
7006       var json = { mailAddress: email };
7007       var request = NCMB._request("requestPasswordReset", null, null, "POST",
7008                                    json);
7009       return request._thenRunCallbacks(options);
7010     },
7011 
7012     /**
7013      *　現在ログイン中のユーザー NCMB.Userを取得する。
7014      * メモリかロカールストレージから適切なセッション情報を返却する。
7015      * @return {NCMB.Object} 現在ログインしているNCMB.User
7016      */
7017     current: function() {
7018       if (NCMB.User._currentUser) {
7019         return NCMB.User._currentUser;
7020       }
7021 
7022       if (NCMB.User._currentUserMatchesDisk) {       
7023         return NCMB.User._currentUser;
7024       }
7025 
7026       // Load the user from local storage.
7027       NCMB.User._currentUserMatchesDisk = true;
7028 
7029       var userData = NCMB.localStorage.getItem(NCMB._getNCMBPath(
7030           NCMB.User._CURRENT_USER_KEY));
7031       if (!userData) {
7032 
7033         return null;
7034       }
7035 
7036       NCMB.User._currentUser = NCMB.Object._create("user");
7037       NCMB.User._currentUser._isCurrentUser = true;
7038 
7039       var json = JSON.parse(userData);
7040       NCMB.User._currentUser.id = json._id;
7041       delete json._id;
7042       NCMB.User._currentUser._sessionToken = json._sessionToken;
7043       delete json._sessionToken;
7044       NCMB.User._currentUser.set(json);
7045 
7046       NCMB.User._currentUser._synchronizeAllAuthData();
7047       NCMB.User._currentUser._refreshCache();
7048       NCMB.User._currentUser._opSetQueue = [{}];
7049       return NCMB.User._currentUser;
7050     },
7051 
7052     /**
7053      * Persists a user as currentUser to localStorage, and into the singleton.
7054      */
7055     _saveCurrentUser: function(user) {
7056       if (NCMB.User._currentUser !== user) {
7057         NCMB.User.logOut();
7058       }
7059       user._isCurrentUser = true;
7060       NCMB.User._currentUser = user;
7061       NCMB.User._currentUserMatchesDisk = true;
7062 
7063       var json = user.toJSON();
7064       json._id = user.id;
7065       json._sessionToken = user._sessionToken;
7066       NCMB.localStorage.setItem(
7067           NCMB._getNCMBPath(NCMB.User._CURRENT_USER_KEY),
7068           JSON.stringify(json));
7069     },
7070 
7071     _registerAuthenticationProvider: function(provider) {
7072       NCMB.User._authProviders[provider.getAuthType()] = provider;
7073       // Synchronize the current user with the auth provider.
7074       if (NCMB.User.current()) {
7075         NCMB.User.current()._synchronizeAuthData(provider.getAuthType());
7076       }
7077     },
7078 
7079     _logInWith: function(provider, options) {
7080       if (provider == "anonymous") {
7081         var authData = {};
7082         authData["id"] = NCMB._createUuid();
7083         options["authData"] = authData;
7084       }
7085       var user = NCMB.Object._create("user");
7086       return user._linkWith(provider, options);
7087     }
7088 
7089   });
7090 }(this));
7091 
7092 /************************************************** NCMB Anonymous class *************************************/
7093 
7094 /*global FB: false , console: false*/
7095 (function(root) {
7096   root.NCMB = root.NCMB || {};
7097   var NCMB = root.NCMB;
7098   var _ = NCMB._;
7099 
7100 
7101   /**
7102    * 匿名ユーザーに向けて、利用する関数を提供するクラスである。 
7103    * @namespace
7104    * 匿名ユーザーに向けて、利用する関数を提供するクラスである。
7105    */
7106   NCMB.AnonymousUtils = {
7107 
7108     /**
7109      * ユーザーのアカウントは匿名とリンクするかどうか判断し、取得する。
7110      * 
7111      * @param {NCMB.User}　user　チェックするユーザー。ユーザーが現在のデバイスにログインする必要がある。
7112      * @return {Boolean}  ユーザーアカウントは匿名アカウントとリンクしているかどうか判断結果。そうすると、<code>true</code>を返却する。
7113      */
7114     isLink: function(user) {
7115       return user._isLinked("anonymous");
7116     },
7117 
7118     /**
7119      * 匿名としてログインする。
7120      * 
7121      * @param {Object} options successとerrorのコールバック標準オプション
7122      */
7123     logIn: function(options) {
7124       return NCMB.User._logInWith("anonymous", options);
7125     },
7126   };
7127 }(this));
7128 
7129 
7130 /************************************************** NCMB Collection class *************************************/
7131 
7132 /*global _: false */
7133 (function(root) {
7134   root.NCMB = root.NCMB || {};
7135   var NCMB = root.NCMB;
7136   var _ = NCMB._;
7137 
7138   /**
7139    * 新しいモデルとオプションからCollectionを作成。普段は直接利用しないが、
7140    * <code>NCMB.Collection.extend</code>サブクラスを作成方法の方が多く利用されている。
7141    *
7142    * @param {Array} models <code>NCMB.Object</code>のインスタンスの配列
7143    *
7144    * @param {Object} options Backbone対応オプションオブジェクト。
7145    * 適切なオプションは以下のようになっている:<ul>
7146    *   <li>model: コレクションに入っているNCMB.Objectのサブクラス
7147    *   <li>query: 項目をフェッチするために利用するNCMB.Queryを利用し
7148    *   <li>comparator: ソートするための属性名前と関数
7149    * </ul>
7150    *
7151    * @see NCMB.Collection.extend
7152    *
7153    * @class
7154    *
7155    * <p>モデルのセットの標準コレクションを提供する。
7156    * コレクションの順番はソートおよび未ソート。
7157    * 詳しく確認は以下のリンクで確認ください。
7158    * <a href="http://documentcloud.github.com/backbone/#Collection">Backbone
7159    * documentation</a>.</p>
7160    */
7161   NCMB.Collection = function(models, options) {
7162     options = options || {};
7163     if (options.comparator) {
7164       this.comparator = options.comparator;
7165     }
7166     if (options.model) {
7167       this.model = options.model;
7168     }
7169     if (options.query) {
7170       this.query = options.query;
7171     }
7172     this._reset();
7173     this.initialize.apply(this, arguments);
7174     if (models) {
7175       this.reset(models, {silent: true, NCMB: options.parse});
7176     }
7177   };
7178 
7179   // Define the Collection's inheritable methods.
7180   _.extend(NCMB.Collection.prototype, NCMB.Events,
7181       /** @lends NCMB.Collection.prototype */ {
7182 
7183     // The default model for a collection is just a NCMB.Object.
7184     // This should be overridden in most cases.
7185     
7186     model: NCMB.Object,
7187 
7188     /**
7189      * デフォルトの空の関数として返す。
7190      */
7191     initialize: function(){},
7192 
7193     /**
7194      * JSON形式を返す
7195      */
7196     toJSON: function() {
7197       return this.map(function(model){ return model.toJSON(); });
7198     },
7199 
7200     /**
7201      * モデルリストにモデル、モデルのリストを追加。　
7202      * 新しいモデルに **silent** が渡されると`add`イベントが発生することを防ぐ可能。
7203      */
7204     add: function(models, options) {
7205       var i, index, length, model, cid, id, cids = {}, ids = {};
7206       options = options || {};
7207       models = _.isArray(models) ? models.slice() : [models];
7208 
7209       // Begin by turning bare objects into model references, and preventing
7210       // invalid models or duplicate models from being added.
7211       for (i = 0, length = models.length; i < length; i++) {
7212 
7213         models[i] = this._prepareModel(models[i], options);
7214         model = models[i];
7215         if (!model) {
7216           throw new Error("Can't add an invalid model to a collection");
7217         }
7218         cid = model.cid;
7219         if (cids[cid] || this._byCid[cid]) {
7220           throw new Error("Duplicate cid: can't add the same model " +
7221                           "to a collection twice");
7222         }
7223         id = model.id;
7224         if (!NCMB._isNullOrUndefined(id) && (ids[id] || this._byId[id])) {
7225           throw new Error("Duplicate id: can't add the same model " +
7226                           "to a collection twice");
7227         }
7228         ids[id] = model;
7229         cids[cid] = model;
7230       }
7231 
7232       // Listen to added models' events, and index models for lookup by
7233       // `id` and by `cid`.
7234       for (i = 0; i < length; i++) {
7235         (model = models[i]).on('all', this._onModelEvent, this);
7236         this._byCid[model.cid] = model;
7237         if (model.id) {
7238           this._byId[model.id] = model;
7239         }
7240       }
7241 
7242       // Insert models into the collection, re-sorting if needed, and triggering
7243       // `add` events unless silenced.
7244       this.length += length;
7245       index = NCMB._isNullOrUndefined(options.at) ? 
7246           this.models.length : options.at;
7247       this.models.splice.apply(this.models, [index, 0].concat(models));
7248       if (this.comparator) {
7249         this.sort({silent: true});
7250       }
7251       if (options.silent) {
7252         return this;
7253       }
7254       for (i = 0, length = this.models.length; i < length; i++) {
7255         model = this.models[i];
7256         if (cids[model.cid]) {
7257           options.index = i;
7258           model.trigger('add', model, this, options);
7259         }
7260       }
7261 
7262       return this;
7263     },
7264 
7265     /**
7266      * セットからモデル・モデルリストを削除する。
7267      * 削除するモデルに **silent** が渡されると<code>remove</code>イベントが発生することを防ぐ可能。
7268      */
7269     remove: function(models, options) {
7270       var i, l, index, model;
7271       options = options || {};
7272       models = _.isArray(models) ? models.slice() : [models];
7273       for (i = 0, l = models.length; i < l; i++) {
7274         model = this.getByCid(models[i]) || this.get(models[i]);
7275         if (!model) {
7276           continue;
7277         }
7278         delete this._byId[model.id];
7279         delete this._byCid[model.cid];
7280         index = this.indexOf(model);
7281         this.models.splice(index, 1);
7282         this.length--;
7283         if (!options.silent) {
7284           options.index = index;
7285           model.trigger('remove', model, this, options);
7286         }
7287         this._removeReference(model);
7288       }
7289       return this;
7290     },
7291 
7292     /**
7293      * IDがセットしたモデルを取得する。
7294      */
7295     get: function(id) {
7296       return id && this._byId[id.id || id];
7297     },
7298 
7299     /**
7300      * クライアントIDがセットしたモデルを取得する。
7301      */
7302     getByCid: function(cid) {
7303       return cid && this._byCid[cid.cid || cid];
7304     },
7305 
7306     /**
7307      * 指定されたindexでのモデルを取得する。
7308      */
7309     at: function(index) {
7310       return this.models[index];
7311     },
7312 
7313     /**
7314      * コレクションを自分でソートするように強制にやらせる。普段はこの関数を利用必要がない。
7315      * セットはソートの順番を保持するため、新しい項目が追加されても、ソート順番は変更ない。
7316      */
7317     sort: function(options) {
7318       options = options || {};
7319       if (!this.comparator) {
7320         throw new Error('Cannot sort a set without a comparator');
7321       }
7322       var boundComparator = _.bind(this.comparator, this);
7323       if (this.comparator.length === 1) {
7324         this.models = this.sortBy(boundComparator);
7325       } else {
7326         this.models.sort(boundComparator);
7327       }
7328       if (!options.silent) {
7329         this.trigger('reset', this, options);
7330       }
7331       return this;
7332     },
7333 
7334     /**
7335      * コレクションのモデルの属性を引っ張る。
7336      */
7337     pluck: function(key) {
7338       return _.map(this.models, function(model){ return model.get(key); });
7339     },
7340 
7341     /**
7342      * 個別に追加および削除する項目より多く項目を取得したい場合、
7343      * 全体項目のセットを新しいモデルリストとリセットする可能である。
7344      * `add` か `remove`イベントを発火させない。メソッド実行が完了したら、 `reset`イベントが発火させる。
7345      */
7346     reset: function(models, options) {
7347       var self = this;
7348       models = models || [];
7349       options = options || {};
7350       NCMB._arrayEach(this.models, function(model) {
7351         self._removeReference(model);
7352       });
7353       this._reset();
7354       this.add(models, {silent: true, NCMB: options.parse});
7355       if (!options.silent) {
7356         this.trigger('reset', this, options);
7357       }
7358       return this;
7359     },
7360 
7361     /**
7362      *  コレクションのデフォルトセットをフェッチ、コレクションをリセットする。
7363      * `add: true` が渡された場合、リセットではなく、コレクションにモデル追加する。
7364      */
7365     fetch: function(options) {
7366       options = _.clone(options) || {};
7367       if (options.parse === undefined) {
7368         options.parse = true;
7369       }
7370       var collection = this;
7371       var query = this.query || new NCMB.Query(this.model);
7372       return query.find().then(function(results) {
7373         if (options.add) {
7374           collection.add(results, options);
7375         } else {
7376           collection.reset(results, options);
7377         }
7378         return collection;
7379       })._thenRunCallbacks(options, this);
7380     },
7381 
7382     /**
7383      * コレクションに新しいモデルのイスタンスを作成する。
7384      * コレクションにモデルを追加する。
7385      * `wait: true` が渡された場合、サーバーから同意を待ちが必要である。
7386      */
7387     create: function(model, options) {
7388       var coll = this;
7389       options = options ? _.clone(options) : {};
7390       model = this._prepareModel(model, options);
7391       if (!model) {
7392         return false;
7393       }
7394       if (!options.wait) {
7395         coll.add(model, options);
7396       }
7397       var success = options.success;
7398       options.success = function(nextModel, resp, xhr) {
7399         if (options.wait) {
7400           coll.add(nextModel, options);
7401         }
7402         if (success) {
7403           success(nextModel, resp);
7404         } else {
7405           nextModel.trigger('sync', model, resp, options);
7406         }
7407       };
7408       model.save(null, options);
7409       return model;
7410     },
7411 
7412     /**
7413     　*　レスポンスをコレクションに追加するためのモデルリストに変換する。　デフォルトの実装はパスさせる。
7414      * @ignore
7415      */
7416     parse: function(resp, xhr) {
7417       return resp;
7418     },
7419 
7420     /**
7421      * _のチェインのプロキシ。underscoreのconstructorに依存してしまうのため、
7422      * underscoreのメソッドと同じ方法で代理させることはできない。
7423      */
7424     chain: function() {
7425       return _(this.models).chain();
7426     },
7427 
7428     /**
7429      * Reset all internal state. Called when the collection is reset.
7430      */
7431     _reset: function(options) {
7432       this.length = 0;
7433       this.models = [];
7434       this._byId  = {};
7435       this._byCid = {};
7436     },
7437 
7438     /**
7439      * Prepare a model or hash of attributes to be added to this collection.
7440      */
7441     _prepareModel: function(model, options) {
7442       if (!(model instanceof NCMB.Object)) {
7443         var attrs = model;
7444         options.collection = this;
7445         model = new this.model(attrs, options);
7446         if (!model._validate(model.attributes, options)) {
7447           model = false;
7448         }
7449       } else if (!model.collection) {
7450         model.collection = this;
7451       }
7452       return model;
7453     },
7454 
7455     /**
7456      * Internal method to remove a model's ties to a collection.
7457      */
7458     _removeReference: function(model) {
7459       if (this === model.collection) {
7460         delete model.collection;
7461       }
7462       model.off('all', this._onModelEvent, this);
7463     },
7464 
7465     /**
7466      * Internal method called every time a model in the set fires an event.
7467      * Sets need to update their indexes when models change ids. All other
7468      * events simply proxy through. "add" and "remove" events that originate
7469      * in other collections are ignored.
7470      */
7471     _onModelEvent: function(ev, model, collection, options) {
7472       if ((ev === 'add' || ev === 'remove') && collection !== this) {
7473         return;
7474       }
7475       if (ev === 'destroy') {
7476         this.remove(model, options);
7477       }
7478       if (model && ev === 'change:objectId') {
7479         delete this._byId[model.previous("objectId")];
7480         this._byId[model.id] = model;
7481       }
7482       this.trigger.apply(this, arguments);
7483     }
7484 
7485   });
7486 
7487   // Collectionに実装するUnderscoreのメソッド。
7488   var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
7489     'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
7490     'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
7491     'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
7492     'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];
7493 
7494   // Mix in each Underscore method as a proxy to `Collection#models`.
7495   NCMB._arrayEach(methods, function(method) {
7496     NCMB.Collection.prototype[method] = function() {
7497       return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
7498     };
7499   });
7500 
7501   /**
7502    * <code>NCMB.Collection</code>の新しいサブクラスを作成する。例えば以下のサンプルコードを参照。
7503    * <pre>
7504    *   var MyCollection = NCMB.Collection.extend({
7505    *     // Instance properties
7506    *
7507    *     model: MyClass,
7508    *     query: MyQuery,
7509    *
7510    *     getFirst: function() {
7511    *       return this.at(0);
7512    *     }
7513    *   }, {
7514    *     // Class properties
7515    *
7516    *     makeOne: function() {
7517    *       return new MyCollection();
7518    *     }
7519    *   });
7520    *
7521    *   var collection = new MyCollection();
7522    * </pre>
7523    *
7524    * @function
7525    * @param {Object} instanceProps コレクションのインスタンスの属性。
7526    * @param {Object} classProps コレクションのクラス属性。
7527    * @return {Class} <code>NCMB.Collection</code>の新しいサブクラス。
7528    */
7529   NCMB.Collection.extend = NCMB._extend;
7530 }(this));
7531 
7532 
7533 /************************************************** NCMB Push class ************************************/
7534 (function(root) {
7535   root.NCMB = root.NCMB || {};
7536   var NCMB = root.NCMB;
7537 
7538   NCMB.Installation = NCMB.Object.extend("_Installation");
7539 
7540   /**
7541    * NCMBのプッシュを操作するクラスである。
7542    * @name NCMB.Push
7543    * @namespace
7544    */
7545   NCMB.Push = NCMB.Object.extend("Push",{
7546 
7547     constructor: function(data) {
7548       this._data = data;
7549     },
7550 
7551     save: function(data, options) {
7552       if(!data) {
7553         if (this._data) {
7554           data = this._data;          
7555         } else {
7556           data = {};
7557         }
7558       }
7559       if (data.searchCondition) {
7560         data.searchCondition = NCMB._encode(data.searchCondition);
7561       }
7562       if (data.deliveryExpirationDate) {
7563         data.deliveryExpirationDate = NCMB._encode(data.deliveryExpirationDate);
7564       }
7565       if (data.deliveryTime) {
7566         data.deliveryTime = NCMB._encode(data.deliveryTime);
7567       }
7568       if (data.deliveryExpirationTime) {
7569         data.deliveryExpirationTime = NCMB._encode(data.deliveryExpirationTime);
7570       }
7571 
7572       if (data.deliveryExpirationDate && data.deliveryExpirationTime) {
7573         throw "Both expiration_time and expiration_time_interval can't be set";
7574       }
7575 
7576       var request = NCMB._request('push', null, null, 'POST', data);
7577       return request._thenRunCallbacks(options);
7578     },
7579   
7580   });
7581 
7582     /**
7583      * プッシュ通知を送信する。
7584      * @param {Object} data -  プッシュ通知のデーター。　有効なフィールドは以下のようになっている:
7585      *   <ol>
7586      *     <li>deliveryTime - プッシュするタイミングのデートオブジェクト. </li>
7587      *     <li>immediateDeliverFlag - 即自配信. </li>
7588      *     <li>target - ターゲット. </li>
7589      *     <li>searchCondition -  NCMB.Installation設定にマッチするクエリNCMB.Query.</li>
7590      *     <li>message - プッシュで送信するデーター</li>
7591      *     <li>deliveryExpirationDate -  プッシュを終了させるタイミング、デートオブジェクト. </li>
7592      *     <li>deliveryExpirationTime -  プッシュを終了させるタイミング、デートオブジェクト. </li>
7593      *      <li>action {String} アクション </li>
7594      *      <li>badgeIncrementFlag {Boolean} バッジ数増加フラグ </li>
7595      *      <li>sound {String} 音楽ファイル </li>
7596      *      <li>contentAvailable {Boolean} content-available </li>
7597      *      <li>title {String} タイトル </li>
7598      *      <li>userSettingValue {Object} ユーザ設定値 </li>
7599      *      <li>acl {NCMB.ACL} ACL </li>
7600      *   <ol>
7601      * @param {Object} options 
7602      *  オプションオブジェクト。任意のオプションsuccessコールバック関数であり、
7603      *  変数がない関数で、成功のプッシュの時に実行させる。
7604      */
7605      
7606   NCMB.Push.send = function(data, options) {
7607       if (data.searchCondition) {
7608         data.searchCondition = NCMB._encode(data.searchCondition);
7609       }
7610 
7611       if (data.deliveryExpirationDate) {
7612         data.deliveryExpirationDate = NCMB._encode(data.deliveryExpirationDate);
7613       }
7614       if (data.deliveryTime) {
7615         data.deliveryTime = NCMB._encode(data.deliveryTime);
7616       }
7617       if (data.deliveryExpirationTime) {
7618         data.deliveryExpirationTime = NCMB._encode(data.deliveryExpirationTime);
7619       }
7620 
7621       if (data.deliveryExpirationDate && data.deliveryExpirationTime) {
7622         throw "Both expiration_time and expiration_time_interval can't be set";
7623       }
7624       var request = NCMB._request('push', null, null, 'POST', data);
7625       return request._thenRunCallbacks(options);
7626     };
7627 
7628 }(this));
7629 
7630 
7631 /************************************************** NCMB Facebook class ************************************/
7632 
7633 /*global FB: false , console: false*/
7634 (function(root) {
7635   root.NCMB = root.NCMB || {};
7636   var NCMB = root.NCMB;
7637   var _ = NCMB._;
7638 
7639   var PUBLIC_KEY = "*";
7640 
7641   var initialized = false;
7642   var requestedPermissions;
7643   var initOptions;
7644   var provider = {
7645     authenticate: function(options) {
7646       var self = this;
7647       FB.login(function(response) {
7648         if (response.authResponse) {
7649           if (options.success) {
7650             options.success(self, {
7651               id: response.authResponse.userID,
7652               access_token: response.authResponse.accessToken,
7653               expiration_date: new Date(response.authResponse.expiresIn * 1000 +
7654                   (new Date()).getTime()).toJSON()
7655             });
7656           }
7657         } else {
7658           if (options.error) {
7659             options.error(self, response);
7660           }
7661         }
7662       }, {
7663         scope: requestedPermissions
7664       });
7665     },
7666     restoreAuthentication: function(authData) {
7667       if (authData) {
7668         var authResponse = {
7669           userID: authData.id,
7670           accessToken: authData.access_token,
7671           expiresIn: (NCMB._NCMBDate(authData.expiration_date.iso).getTime() -
7672               (new Date()).getTime()) / 1000
7673         };
7674         var newOptions = _.clone(initOptions);
7675         newOptions.authResponse = authResponse;
7676 
7677         // Suppress checks for login status from the browser.
7678         newOptions.status = false;
7679         FB.init(newOptions);
7680       }
7681       return true;
7682     },
7683     getAuthType: function() {
7684       return "facebook";
7685     },
7686     deauthenticate: function() {
7687       this.restoreAuthentication(null);
7688       FB.logout();
7689     }
7690   };
7691 
7692   /**
7693    * Facebookと統合するために利用するメソッドのセットを提供するクラス。
7694    * @namespace
7695    *  Facebookと統合するために利用するメソッドのセットを提供するクラス。
7696    */
7697   NCMB.FacebookUtils = {
7698     /**
7699      * NCMB Facebookを連携するメソッドを開始する。
7700      * このメソッドは渡されたパラメーターで渡す<code>
7701      * <a href=
7702      * "https://developers.facebook.com/docs/reference/javascript/FB.init/">
7703      * FB.init()</a></code>、Facebook Javascript SDKをロードされた後すぐ実行すること。　
7704      * NCMB.FacebookUtilsはこのパラメーターを利用して、FB.init()を実行させる。
7705      *
7706      * @param {Object} options　Facebookオプション、以下のリンクで説明に参考してください.
7707      *   <a href=
7708      *   "https://developers.facebook.com/docs/reference/javascript/FB.init/">
7709      *   FB.init()</a>. NCMB Facebookと統合するため、ステータスフラグは'false'にセットされる。
7710      *   アプリケーションが求める場合、FB.getLoginStatus()を明確に実行する可能である。
7711      */
7712     init: function(options) {
7713       if (typeof(FB) === 'undefined') {
7714         throw "The Facebook JavaScript SDK must be loaded before calling init.";
7715       } 
7716       initOptions = _.clone(options) || {};
7717       if (initOptions.status && typeof(console) !== "undefined") {
7718         var warn = console.warn || console.log || function() {};
7719         /*
7720         warn.call(console, "The 'status' flag passed into" +
7721           " FB.init, when set to true, can interfere with NCMB Facebook" +
7722           " integration, so it has been suppressed. Please call" +
7723           " FB.getLoginStatus() explicitly if you require this behavior.");
7724         */
7725       }
7726       initOptions.status = false;
7727       FB.init(initOptions);
7728       NCMB.User._registerAuthenticationProvider(provider);
7729       initialized = true;
7730     },
7731 
7732     /**
7733      * ユーザーのアカウントはFacebookとリンクされたかどうか取得する。
7734      * 
7735      * @param {NCMB.User} user Facebookリンクをチェックするためのユーザー。　
7736      * デバイスにログインする必要がある。　　
7737      * @return {Boolean} <code>true</code> ユーザーのアカウントがFacebookにリンクしているかどうか取得する。
7738      */
7739     isLinked: function(user) {
7740       return user._isLinked("facebook");
7741     },
7742 
7743     /**
7744      *　Facebook認証を利用し、ユーザーログインを行う。このメソッドはFacebook SDKを継承し、
7745      * ユーザー認証を行い、 認証が完了したあと、
7746      * 自動的にNCMB.Userとしてログインを行う。ユーザーは新しい場合、新規ユーザー登録を行う。
7747      * 
7748      * @param {String, Object} permissions Facebookにログインするため、
7749      * 必要なパーミションである。複数の場合、','で区別する。　
7750      * また、自分で制御する場合、FacebookのauthDataオブジェクトを提供し、
7751      * Facebookにログインを行うことが可能である。
7752      * @param {Object} options successとerrorの標準のオプションオブジェクト。
7753      */
7754     logIn: function(permissions, options) {
7755       if (!permissions || _.isString(permissions)) {
7756         if (!initialized) {
7757           throw "You must initialize FacebookUtils before calling logIn.";
7758         }
7759         requestedPermissions = permissions;
7760         return NCMB.User._logInWith("facebook", options);
7761       } else {
7762         var newOptions = _.clone(options) || {};
7763         newOptions.authData = permissions;
7764         return NCMB.User._logInWith("facebook", newOptions);
7765       }
7766     },
7767 
7768     /**
7769      * NCMBUserの既存ユーザーとリンクさせるメソッド。
7770      * このメソッドはFacebook認証にメソッドを実行させ、 
7771      * 自動的に既存ユーザーNCMB.Userアカウントとリンクさせる。
7772      *
7773      * @param {NCMB.User} user Facebookにリンクするユーザー。　現在ログインしているユーザーであること。 
7774      * @param {String, Object} permissions Facebookにログインするため、必要なパーミションである。
7775      * 複数の場合、','で区別する。　また、自分で制御する場合、FacebookのauthDataオブジェクトを提供し、
7776      * Facebookログインを行うことが可能である。
7777      * @param {Object} options successとerrorのコールバックを提供する標準のオプションオブジェクト。
7778      */
7779     link: function(user, permissions, options) {
7780       if (!permissions || _.isString(permissions)) {
7781         if (!initialized) {
7782           throw "You must initialize FacebookUtils before calling link.";
7783         }
7784         requestedPermissions = permissions;
7785         return user._linkWith("facebook", options);
7786       } else {
7787         var newOptions = _.clone(options) || {};
7788         newOptions.authData = permissions;
7789         return user._linkWith("facebook", newOptions);
7790       }
7791     },
7792 
7793     /**
7794      * NCMB.UserをFacebookアカウントからアンリンクする。
7795      * 
7796      * @param {NCMB.User} user Facebookからアンリンクするユーザー。現在ログイン中のユーザーであること。
7797      * @param {Object} options　successとerrorのコールバックを提供する標準のオプションオブジェクト。
7798      */
7799     unlink: function(user, options) {
7800       if (!initialized) {
7801         throw "You must initialize FacebookUtils before calling unlink.";
7802       }
7803       return user._unlinkFrom("facebook", options);
7804     }
7805   };
7806 }(this));
7807 
7808 
7809 
7810 /************************************************** NCMB View class ************************************/
7811 /*global _: false, document: false */
7812 (function(root) {
7813   root.NCMB = root.NCMB || {};
7814   var NCMB = root.NCMB;
7815   var _ = NCMB._;
7816 
7817   /**
7818    * 既存要素が提供されていない場合、DOM以外に新しく初期化された要素を作成するクラス。
7819    * @class
7820    *
7821    * <p>ユーザーのために便利にするため、ビュー Backbone互換のViewを提供する。
7822    * このクラスを利用するため、jQueryかjqueryの$に互換ライブラリーを含めることが必要である。
7823    * 詳しくは<a href="http://documentcloud.github.com/backbone/#View">Backbone
7824    * documentation</a>に参照してください。</p>
7825    * <p><strong><em>SDKクライアントのみ利用する。</em></strong></p>
7826    */
7827   NCMB.View = function(options) {
7828     this.cid = _.uniqueId('view');
7829     this._configure(options || {});
7830     this._ensureElement();
7831     this.initialize.apply(this, arguments);
7832     this.delegateEvents();
7833   };
7834 
7835   // Cached regex to split keys for `delegate`.
7836   var eventSplitter = /^(\S+)\s*(.*)$/;
7837 
7838   // List of view options to be merged as properties.
7839   
7840   var viewOptions = ['model', 'collection', 'el', 'id', 'attributes',
7841                      'className', 'tagName'];
7842 
7843   // Set up all inheritable **NCMB.View** properties and methods.
7844   _.extend(NCMB.View.prototype, NCMB.Events,
7845            /** @lends NCMB.View.prototype */ {
7846 
7847     // The default `tagName` of a View's element is `"div"`.
7848     tagName: 'div',
7849 
7850     /**
7851      * 現在のビューの中にあるDOM要素を対象にする形で要素のルックアップをjQueryに委譲する。
7852      */
7853     $: function(selector) {
7854       return this.$el.find(selector);
7855     },
7856 
7857     /**
7858      * デフォルトは空の初期化関数。自由にオーバーライド可能である。
7859      */
7860     initialize: function(){},
7861 
7862     /**
7863      * ビューがオーバーライド必要があるコア関数である。
7864      * 適切のHTMLに適用するために必要。
7865      * **render** の注意はいつも`this`として返却する必要がある。
7866      */
7867     render: function() {
7868       return this;
7869     },
7870 
7871     /**
7872      * DOMからビューを削除する。デフォルトはビューが表示されないこと。
7873      * そのため、このメソッドを呼び出す時、no-opとして実行する可能性がある。
7874      */
7875     remove: function() {
7876       this.$el.remove();
7877       return this;
7878     },
7879 
7880     /**
7881      * DOMの要素が少ない場合、利用する。
7882      * 要素を作成するため、**make**を1回利用する。
7883      * <pre>
7884      *     var el = this.make('li', {'class': 'row'},
7885      *                        this.model.escape('title'));</pre>
7886      */
7887     make: function(tagName, attributes, content) {
7888       var el = document.createElement(tagName);
7889       if (attributes) {
7890         NCMB.$(el).attr(attributes);
7891       }
7892       if (content) {
7893         NCMB.$(el).html(content);
7894       }
7895       return el;
7896     },
7897 
7898     /**
7899      * イベントの再委任も含めビューの要素（`this.el`属性）を変更する。 
7900      */
7901     setElement: function(element, delegate) {
7902       this.$el = NCMB.$(element);
7903       this.el = this.$el[0];
7904       if (delegate !== false) {
7905         this.delegateEvents();
7906       }
7907       return this;
7908     },
7909 
7910     /**
7911      * コールバックを設定する。
7912      * <code>this.events</code> はハッシュであり、
7913      * <pre>
7914      * *{"event selector": "callback"}*
7915      *     {
7916      *       'mousedown .title':  'edit',
7917      *       'click .button':     'save'
7918      *       'click .open':       function(e) { ... }
7919      *     }
7920      * </pre>
7921      * の組がある. コールバックはビューにバインドさせ、`this`のセットを適切に利用する。
7922      * イベントの委任の利用する方がお勧めする。
7923      * `this.el`にイベントをバインドするセレクターを除く。
7924      * 委任可能なイベントしか有効である。
7925      * IEの場合、次のイベントは不可である。
7926      * `focus`, `blur`, `change`, `submit`, `reset`である。
7927      */
7928     delegateEvents: function(events) {
7929       events = events || NCMB._getValue(this, 'events');
7930       if (!events) {
7931         return;
7932       }
7933       this.undelegateEvents();
7934       var self = this;
7935       NCMB._objectEach(events, function(method, key) {
7936         if (!_.isFunction(method)) {
7937           method = self[events[key]];
7938         }
7939         if (!method) {
7940           throw new Error('Event "' + events[key] + '" does not exist');
7941         }
7942         var match = key.match(eventSplitter);
7943         var eventName = match[1], selector = match[2];
7944         method = _.bind(method, self);
7945         eventName += '.delegateEvents' + self.cid;
7946         if (selector === '') {
7947           self.$el.bind(eventName, method);
7948         } else {
7949           self.$el.delegate(selector, eventName, method);
7950         }
7951       });
7952     },
7953 
7954     /**
7955      * `delegateEvents`でバインドされたコールバックをすべてクリアをする。
7956      * 普段は利用する必要がないが、同じDOM要素に所属させる複数の
7957      * Backboneビューを作成する場合、必要がある。
7958      */
7959     undelegateEvents: function() {
7960       this.$el.unbind('.delegateEvents' + this.cid);
7961     },
7962 
7963     /**
7964      * Performs the initial configuration of a View with a set of options.
7965      * Keys with special meaning *(model, collection, id, className)*, are
7966      * attached directly to the view.
7967      */
7968     _configure: function(options) {
7969       if (this.options) {
7970         options = _.extend({}, this.options, options);
7971       }
7972       var self = this;
7973       _.each(viewOptions, function(attr) {
7974         if (options[attr]) {
7975           self[attr] = options[attr];
7976         }
7977       });
7978       this.options = options;
7979     },
7980 
7981     /**
7982      * Ensure that the View has a DOM element to render into.
7983      * If `this.el` is a string, pass it through `$()`, take the first
7984      * matching element, and re-assign it to `el`. Otherwise, create
7985      * an element from the `id`, `className` and `tagName` properties.
7986      */
7987     _ensureElement: function() {
7988       if (!this.el) {
7989         var attrs = NCMB._getValue(this, 'attributes') || {};
7990         if (this.id) {
7991           attrs.id = this.id;
7992         }
7993         if (this.className) {
7994           attrs['class'] = this.className;
7995         }
7996         this.setElement(this.make(this.tagName, attrs), false);
7997       } else {
7998         this.setElement(this.el, false);
7999       }
8000     }
8001 
8002   });
8003 
8004   /**
8005    * @function
8006    * @param {Object} instanceProps ビュー?のためのインスタンス属性である。
8007    * @param {Object} classProps ビューのためのクラスの属性である。
8008    * @return {Class} <code>NCMB.View</code>の新サブクラス。
8009    */
8010   NCMB.View.extend = NCMB._extend;
8011 
8012 }(this));
8013 
8014 /************************************************** NCMB Router class ************************************/
8015 
8016 /*global _: false*/
8017 (function(root) {
8018   root.NCMB = root.NCMB || {};
8019   var NCMB = root.NCMB;
8020   var _ = NCMB._;
8021 
8022   /**
8023    * faux-URLをアクションにマップするためのクラス。アクションにマッチされたら、イベントを発火させる。
8024    * 'routes'ハッシュをセットするために、静的にセットされない場合、新しいセットの作成を行う。
8025    * @class
8026    *
8027    * <p>Backbone.Router互換し、ユーザーが使いやすくするため提供する。
8028    * 詳しくは、以下のURKに参照すること。
8029    * <a href="http://documentcloud.github.com/backbone/#Router">Backbone
8030    * documentation</a>.</p>
8031    * <p><strong><em>クライアントSDKのみ提供する。</em></strong></p>
8032    */
8033   NCMB.Router = function(options) {
8034     options = options || {};
8035     if (options.routes) {
8036       this.routes = options.routes;
8037     }
8038     this._bindRoutes();
8039     this.initialize.apply(this, arguments);
8040   };
8041 
8042   // Cached regular expressions for matching named param parts and splatted
8043   // parts of route strings.
8044   var namedParam    = /:\w+/g;
8045   var splatParam    = /\*\w+/g;
8046   var escapeRegExp  = /[\-\[\]{}()+?.,\\\^\$\|#\s]/g;
8047 
8048   // Set up all inheritable **NCMB.Router** properties and methods.
8049   _.extend(NCMB.Router.prototype, NCMB.Events,
8050            /** @lends NCMB.Router.prototype */ {
8051 
8052     /**
8053      * デフォルトは空初期化関数である。　
8054      * ユーザーは自分の好みロジックで初期化関数をオバーライドする。
8055      */
8056     initialize: function(){},
8057 
8058     /**
8059      * 手動的にrouteをコールバックにバインドする。
8060      * 例えば：
8061      *
8062      * <pre>　this.route('search/:query/p:num', 'search', function(query, num) {
8063      *       ...
8064      *     });
8065      * </pre>
8066      *
8067      */
8068     route: function(route, name, callback) {
8069       NCMB.history = NCMB.history || new NCMB.History();
8070       if (!_.isRegExp(route)) {
8071         route = this._routeToRegExp(route);
8072       } 
8073       if (!callback) {
8074         callback = this[name];
8075       }
8076       NCMB.history.route(route, _.bind(function(fragment) {
8077         var args = this._extractParameters(route, fragment);
8078         if (callback) {
8079           callback.apply(this, args);
8080         }
8081         this.trigger.apply(this, ['route:' + name].concat(args));
8082         NCMB.history.trigger('route', this, name, args);
8083       }, this));
8084       return this;
8085     },
8086 
8087     /**
8088      *　アプリケーションのナビゲートポイントでURLとして保存したい場合、
8089      * URLを更新するため、navigateを実行する。
8090      * route関数を実行させたい場合、triggerのオプションをtrueとして設定が必要である。
8091      * ブラウザーの履歴に項目を作成せず、
8092      * URLを更新したい場合replaceオプションをtrueに設定する。
8093      */
8094     navigate: function(fragment, options) {
8095       NCMB.history.navigate(fragment, options);
8096     },
8097 
8098     // Bind all defined routes to `NCMB.history`. We have to reverse the
8099     // order of the routes here to support behavior where the most general
8100     // routes can be defined at the bottom of the route map.
8101     _bindRoutes: function() {
8102       if (!this.routes) { 
8103         return;
8104       }
8105       var routes = [];
8106       for (var route in this.routes) {
8107         if (this.routes.hasOwnProperty(route)) {
8108           routes.unshift([route, this.routes[route]]);
8109         }
8110       }
8111       for (var i = 0, l = routes.length; i < l; i++) {
8112         this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
8113       }
8114     },
8115 
8116     // Convert a route string into a regular expression, suitable for matching
8117     // against the current location hash.
8118     _routeToRegExp: function(route) {
8119       route = route.replace(escapeRegExp, '\\$&')
8120                    .replace(namedParam, '([^\/]+)')
8121                    .replace(splatParam, '(.*?)');
8122       return new RegExp('^' + route + '$');
8123     },
8124 
8125     // Given a route, and a URL fragment that it matches, return the array of
8126     // extracted parameters.
8127     _extractParameters: function(route, fragment) {
8128       return route.exec(fragment).slice(1);
8129     }
8130   });
8131 
8132   /**
8133    * @function
8134    * @param {Object} instanceProps routerのためのインスタンス属性。
8135    * @param {Object} classProps routerのためのクラス属性。
8136    * @return {Class} <code>NCMB.Router</code>のサブクラス。
8137    */
8138   NCMB.Router.extend = NCMB._extend;
8139 }(this));
8140 
8141 
8142 /************************************************** NCMB History class ************************************/
8143 
8144 /*global _: false, document: false, window: false, navigator: false */
8145 (function(root) {
8146   root.NCMB = root.NCMB || {};
8147   var NCMB = root.NCMB;
8148   var _ = NCMB._;
8149 
8150   /**
8151    *　グロバールルーターとして担当し、ハッシュ変更のイベントやpushStateを操作し、
8152    * 適切なルートにマッチし、コールバックを発火させる。
8153    * 新しく作成するより、 <code>NCMB.history</code>に参照する方法の方がお勧めする。
8154    * そうすると、Routerを利用する時自動的に作成される。
8155    * @class
8156    *   
8157    * <p>ユーザーのために便利にするため、ビュー Backbone互換のRouterを提供する。
8158    * このクラスを利用するため、jQueryかjqueryの$に互換ライブラリーを含めることが必要である。
8159    * 詳しくは<a href="http://documentcloud.github.com/backbone/#View">Backbone
8160    * documentation</a>.</p>に参照してください。
8161    * <p><strong><em>SDKクライアントのみ利用する。</em></strong></p>
8162    */
8163   NCMB.History = function() {
8164     this.handlers = [];
8165     _.bindAll(this, 'checkUrl');
8166   };
8167 
8168   // Cached regex for cleaning leading hashes and slashes .
8169   var routeStripper = /^[#\/]/;
8170 
8171   // Cached regex for detecting MSIE.
8172   var isExplorer = /msie [\w.]+/;
8173 
8174   // Has the history handling already been started?
8175   NCMB.History.started = false;
8176 
8177   // Set up all inheritable **NCMB.History** properties and methods.
8178   _.extend(NCMB.History.prototype, NCMB.Events,
8179            /** @lends NCMB.History.prototype */ {
8180 
8181     // The default interval to poll for hash changes, if necessary, is
8182     // twenty times a second.
8183     interval: 50,
8184 
8185     /**
8186      * ハッシュ値を返却する。Firefoxの場合、
8187      * location.hashがデコードされたため、location.hashを直接利用しないこと。
8188      */
8189     getHash: function(windowOverride) {
8190       var loc = windowOverride ? windowOverride.location : window.location;
8191       var match = loc.href.match(/#(.*)$/);
8192       return match ? match[1] : '';
8193     },
8194     
8195     /**
8196     * URLかハッシュかオーバーライドからクロスブラウザーに標準化したURLフラグメントを返却する。
8197     */
8198     getFragment: function(fragment, forcePushState) {
8199       if (NCMB._isNullOrUndefined(fragment)) {
8200         if (this._hasPushState || forcePushState) {
8201           fragment = window.location.pathname;
8202           var search = window.location.search;
8203           if (search) {
8204             fragment += search;
8205           }
8206         } else {
8207           fragment = this.getHash();
8208         }
8209       }
8210       if (!fragment.indexOf(this.options.root)) {
8211         fragment = fragment.substr(this.options.root.length);
8212       }
8213       return fragment.replace(routeStripper, '');
8214     },
8215 
8216     /**
8217      * 操作を開始する。存在するルートに現在のURLマッチする場合、
8218      * `true`を返却し、その以外の場合、`false`を返却する。
8219      */
8220     start: function(options) {
8221       if (NCMB.History.started) {
8222         throw new Error("NCMB.history has already been started");
8223       }
8224       NCMB.History.started = true;
8225 
8226       // Figure out the initial configuration. Do we need an iframe?
8227       // Is pushState desired ... is it available?
8228       this.options = _.extend({}, {root: '/'}, this.options, options);
8229       this._wantsHashChange = this.options.hashChange !== false;
8230       this._wantsPushState = !!this.options.pushState;
8231       this._hasPushState = !!(this.options.pushState && 
8232                               window.history &&
8233                               window.history.pushState);
8234       var fragment = this.getFragment();
8235       var docMode = document.documentMode;
8236       var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) &&
8237                    (!docMode || docMode <= 7));
8238 
8239       if (oldIE) {
8240         this.iframe = NCMB.$('<iframe src="javascript:0" tabindex="-1" />')
8241                       .hide().appendTo('body')[0].contentWindow;
8242         this.navigate(fragment);
8243       }
8244 
8245       // Depending on whether we're using pushState or hashes, and whether
8246       // 'onhashchange' is supported, determine how we check the URL state.
8247       if (this._hasPushState) {
8248         NCMB.$(window).bind('popstate', this.checkUrl);
8249       } else if (this._wantsHashChange &&
8250                  ('onhashchange' in window) &&
8251                  !oldIE) {
8252         NCMB.$(window).bind('hashchange', this.checkUrl);
8253       } else if (this._wantsHashChange) {
8254         this._checkUrlInterval = window.setInterval(this.checkUrl,
8255                                                     this.interval);
8256       }
8257 
8258       // Determine if we need to change the base url, for a pushState link
8259       // opened by a non-pushState browser.
8260       this.fragment = fragment;
8261       var loc = window.location;
8262       var atRoot  = loc.pathname === this.options.root;
8263 
8264       // If we've started off with a route from a `pushState`-enabled browser,
8265       // but we're currently in a browser that doesn't support it...
8266       if (this._wantsHashChange && 
8267           this._wantsPushState && 
8268           !this._hasPushState &&
8269           !atRoot) {
8270         this.fragment = this.getFragment(null, true);
8271         window.location.replace(this.options.root + '#' + this.fragment);
8272         // Return immediately as browser will do redirect to new url
8273         return true;
8274 
8275       // Or if we've started out with a hash-based route, but we're currently
8276       // in a browser where it could be `pushState`-based instead...
8277       } else if (this._wantsPushState &&
8278                  this._hasPushState && 
8279                  atRoot &&
8280                  loc.hash) {
8281         this.fragment = this.getHash().replace(routeStripper, '');
8282         window.history.replaceState({}, document.title,
8283             loc.protocol + '//' + loc.host + this.options.root + this.fragment);
8284       }
8285 
8286       if (!this.options.silent) {
8287         return this.loadUrl();
8288       }
8289     },
8290     
8291     /**
8292      * 一時的にNCMB.Historyを無効にする。リアルのアプリケーションでは必要ではないが、ユニットテストを行う時に必要可能性がある。
8293      */
8294     stop: function() {
8295       NCMB.$(window).unbind('popstate', this.checkUrl)
8296                      .unbind('hashchange', this.checkUrl);
8297       window.clearInterval(this._checkUrlInterval);
8298       NCMB.History.started = false;
8299     },
8300 
8301     /**
8302      * フラグメントを変更する時、テスト用のルートを追加する。
8303      *　後で追加する場合、前回のルートをオーバーライドする。
8304      */
8305      route: function(route, callback) {
8306       this.handlers.unshift({route: route, callback: callback});
8307     },
8308 
8309     /**
8310     * 現在のURLをチェックし、変更があるかどうか判断し、取得する。
8311     * 変更があった場合、隠したiframeを標準化し、'loadUrl'を実行させる。
8312     */
8313     checkUrl: function(e) {
8314       var current = this.getFragment();
8315       if (current === this.fragment && this.iframe) {
8316         current = this.getFragment(this.getHash(this.iframe));
8317       }
8318       if (current === this.fragment) {
8319         return false;
8320       }
8321       if (this.iframe) {
8322         this.navigate(current);
8323       }
8324       if (!this.loadUrl()) {
8325         this.loadUrl(this.getHash());
8326       }
8327     },
8328 
8329     /**
8330     * 現在のURLフラグメントをロードさせる。
8331     *　ルートが成功にマッチさせた場合、`true`を返却する。
8332     * フラグメントにマッチするルートがない場合、`false`を返却する。
8333     */
8334 
8335     loadUrl: function(fragmentOverride) {
8336       var fragment = this.fragment = this.getFragment(fragmentOverride);
8337       var matched = _.any(this.handlers, function(handler) {
8338         if (handler.route.test(fragment)) {
8339           handler.callback(fragment);
8340           return true;
8341         }
8342       });
8343       return matched;
8344     },
8345 
8346     /**
8347     * ハッシュ履歴にフラグメントを保存するか、'replace'オプションが渡された場合、URLステートを交換する。
8348     * フラグメントを適切なURLエンコーディングする可能である。
8349     * optionsオブジェクトに`trigger: true`を渡した場合、ルートのコールバックを発火させる。
8350     * `replace: true`を渡した場合、履歴に項目を追加せず、現在のURLを変更する可能である。
8351     */
8352 
8353     navigate: function(fragment, options) {
8354       if (!NCMB.History.started) {
8355         return false;
8356       }
8357       if (!options || options === true) {
8358         options = {trigger: options};
8359       }
8360       var frag = (fragment || '').replace(routeStripper, '');
8361       if (this.fragment === frag) {
8362         return;
8363       }
8364 
8365       // If pushState is available, we use it to set the fragment as a real URL.
8366       if (this._hasPushState) {
8367         if (frag.indexOf(this.options.root) !== 0) {
8368           frag = this.options.root + frag;
8369         }
8370         this.fragment = frag;
8371         var replaceOrPush = options.replace ? 'replaceState' : 'pushState';
8372         window.history[replaceOrPush]({}, document.title, frag);
8373 
8374       // If hash changes haven't been explicitly disabled, update the hash
8375       // fragment to store history.
8376       } else if (this._wantsHashChange) {
8377         this.fragment = frag;
8378         this._updateHash(window.location, frag, options.replace);
8379         if (this.iframe &&
8380             (frag !== this.getFragment(this.getHash(this.iframe)))) {
8381           // Opening and closing the iframe tricks IE7 and earlier
8382           // to push a history entry on hash-tag change.
8383           // When replace is true, we don't want this.
8384           if (!options.replace) {
8385             this.iframe.document.open().close();
8386           }
8387           this._updateHash(this.iframe.location, frag, options.replace);
8388         }
8389 
8390       // If you've told us that you explicitly don't want fallback hashchange-
8391       // based history, then `navigate` becomes a page refresh.
8392       } else {
8393         window.location.assign(this.options.root + fragment);
8394       }
8395       if (options.trigger) {
8396         this.loadUrl(fragment);
8397       }
8398     },
8399 
8400     // Update the hash location, either replacing the current entry, or adding
8401     // a new one to the browser history.
8402     _updateHash: function(location, fragment, replace) {
8403       if (replace) {
8404         var s = location.toString().replace(/(javascript:|#).*$/, '');
8405         location.replace(s + '#' + fragment);
8406       } else {
8407         location.hash = fragment;
8408       }
8409     }
8410   });
8411 }(this));