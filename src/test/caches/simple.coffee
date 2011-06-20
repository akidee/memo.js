Cache = require('../../cache')
SimpleCache = require('../../caches/simple')
a = require('assert')
step = require('step')
le = (e) ->
	if e?.name == 'AssertionError'
		console.log(e)
		console.log(e.stack)
		process.exit()




# ()

	# default params

data =
	a: 1

a.deepEqual(
	new SimpleCache(data)
	{
		a: 1
		data: {}
		maxLength: 0
		maxAge: 0
		intervals: []
	}
)

	# user defined params

data =
	data:
		a: [ 5, 1 ]
	maxAge: 2
	maxLength: 4
	
cache = new SimpleCache(data)

a.strictEqual(
	cache.data
	data.data
)

a.strictEqual(
	cache.maxAge
	data.maxAge
)

a.strictEqual(
	cache.maxLength
	data.maxLength
)




step.async(

	->

		# get()

			# existing

		cache.get('a', this)

	(e, r) ->

		le(e)
	

		a.strictEqual(
			e?
			no
		)

		a.strictEqual(
			r
			5
		)

		a.strictEqual(
			cache.data.a[1]
			2
		)

			# not existing

		cache.get('b', this)

	(e, r) ->

		le(e)


		a.strictEqual(
			e?
			no
		)

		a.strictEqual(
			r
			Cache.NOT_EXISTING
		)


		# set()

		cache.set('b', { a: 5 }, this)

	(e) ->

		a.strictEqual(
			e?
			no
		)

		a.deepEqual(
			cache.data.b
			[ { a: 5 }, 1 ]
		)


		# del()

		cache.del('a')

		a.deepEqual(
			'a' of cache.data
			no
		)


		# ()

			# invalidation by time (RAW TEST)

		setTimeout(this, 2000)

	->

		a.strictEqual(
			'b' of cache.data
			no
		)


			# invalidation by access count

		#group = @group()

		cache.set('a', 1, -> )
		cache.set('b', 1, -> )
		cache.set('c', 1, -> )
		cache.set('d', 1, -> )
		cache.get('c', -> )
		cache.get('d', -> )

		setTimeout(this, 1000)

	(e) ->

		a.strictEqual(
			'a' of cache.data
			no
		)

		a.strictEqual(
			'b' of cache.data
			no
		)

		a.strictEqual(
			'c' of cache.data
			on
		)

		a.strictEqual(
			'd' of cache.data
			on
		)

		@()

	(e) ->

		le(e)
		

		console.log('Passed')
		process.exit()
)