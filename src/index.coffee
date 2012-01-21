Cache = require('./cache')
EventEmitter = require('events').EventEmitter
NOT_EXISTING = Cache.NOT_EXISTING
slice = Array::slice
hasOwnProperty = Object::hasOwnProperty




_defaultHashFunc = -> JSON.stringify(arguments)



	
exports = module.exports = (func, options = {}) ->

	# context of func call
	context = options.context || null
	
	hashFunc = options.hashFunc || _defaultHashFunc
	cacheModuleId = options.cache || './caches/simple'

	# func is synchronous
	isSync = options.isSync || no

	# To pass remaining options to the cache instantiation
	delete options.context
	delete options.hashFunc
	delete options.cache
	delete options.isSync


	ee = new EventEmitter

	# More performant than using costly ee.listeners[hash].length (must take care about __proto__)
	computing = {}
	
	cache = new (require(cacheModuleId))(options)
	

	memoized = (args..., __) ->
		
		hash = hashFunc.apply(context, args)

		if hash.indexOf('__proto__') == 0
			hash = hash + '%'
			
		if hasOwnProperty.call(computing, hash)
			ee.once(hash, __)
		else
			cache.get(hash, (e, data) ->

				if e
					return __(e)


				if data != NOT_EXISTING
					__.apply(null, data)
				else
					computing[hash] = on
					ee.once(hash, __)

					callback = ->

						_args = arguments

						cache.set(hash, _args, (e) ->

							_args = if !e
								[ hash ].concat(slice.call(_args))
							else
								[ hash ].concat(e)
							
							delete computing[hash]
							ee.emit.apply(ee, _args)
						)

					if !isSync
						func.apply(context, args.concat([ callback ]))
					else
						e = null
						try
							result = func.apply(context, args)
						catch f
							e = f
						callback(e, result)

			)

	memoized.cache = cache

	functions.push(memoized)

	return memoized

exports.hashFunc = _defaultHashFunc

functions = exports.functions = []

exports.stop = ->

	for fun in functions
		fun.cache.destruct?()
