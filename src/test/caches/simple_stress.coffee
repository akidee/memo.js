memo = require('../../')
a = require('assert')




MAX_LENGTH = 100000
UNIQUE_CALLS = 500000
RUNNING = 240000
MAX_AGE = 0
DEBUG_CACHE = on





fun = memo(
	(a) -> { a: a, b: 'This should be a long, long string', c: [ 1..5 ] }
	{
		isSync: on
		maxAge: MAX_AGE
		maxLength: MAX_LENGTH
		debug: DEBUG_CACHE
		hashFunc: (a) -> a
	}
)

(interval = ->
	fun(
		Math.round(Math.random() * UNIQUE_CALLS)
		(e, r) ->
			a.strictEqual(
				e?
				no
			)
			process.nextTick(interval)
	)
)()

setTimeout(
	->
		#clearInterval(interval)
		process.exit()
	RUNNING
)

console.log('length / Memory (MB) ... ')

setInterval(
	->
		console.log(fun.cache.length(), process.memoryUsage().rss / 1000000)
	2000
)
