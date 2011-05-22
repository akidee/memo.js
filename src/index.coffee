EventEmitter = require('events').EventEmitter
slice = Array.prototype.slice




COMPUTING = {}

_defaultHashFunc = -> JSON.stringify(arguments)



	
exports = module.exports = (func, options = {}) ->

	context = options.context || null
	hashFunc = options.hashFunc || _defaultHashFunc
	data = options.data || {}

	
	ee = new EventEmitter

	memoized = (args..., __) ->
		
		hash = hashFunc.apply(context, args)

		value = data[hash]
		if hash of data

			if value != COMPUTING
			
				__.apply(null, value)
				return on

			else

				ee.on(hash, __)
				return no

		else

			data[hash] = COMPUTING
			ee.on(hash, __)

			__cb = ->

				data[hash] = arguments

				ee.emit.apply(ee, [hash].concat(slice.call(arguments)))
				ee.removeAllListeners(hash)

			func.apply(context, args.concat([__cb]))
			return no

	memoized.data = data

	return memoized

exports.hashFunc = _defaultHashFunc
