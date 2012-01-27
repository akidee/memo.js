Cache = require('../../cache')
SimpleCache = require('../../caches/simple')
a = require('assert')
step = require('stepc')
le = (e) ->
	if e?.name == 'AssertionError'
		__(e)




__ = null
module.exports = (ready) -> __ = ready




# ()

	# default params

data =
	a: 1

a.deepEqual(
	new SimpleCache(data)
	{
		a: 1
		data: {
			_data: {}
		}
		maxLength: 0
		maxAge: 0
		intervals: []
		debug: no
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
	cache.data.getData()
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
			cache.data.get('a')[1]
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

		le(e)


		a.strictEqual(
			e?
			no
		)

		a.deepEqual(
			cache.data.get('b')
			[ { a: 5 }, 1 ]
		)


		# del()

		cache.del('a')

		a.deepEqual(
			cache.data.has('a')
			no
		)


		# ()

			# invalidation by time (RAW TEST)

		setTimeout(@, 3000)

	(e) ->

		le(e)


		a.strictEqual(
			cache.data.has('b')
			no
		)



			# invalidation by access count

		cache.set('a', 1, -> )
		cache.set('b', 1, -> )
		cache.set('c', 1, -> )
		cache.set('d', 1, -> )
		cache.get('c', -> )
		cache.get('d', -> )

		setTimeout(@, 1000)

	(e) ->

		le(e)


		a.strictEqual(
			cache.data.has('a')
			no
		)

		a.strictEqual(
			cache.data.has('b')
			no
		)

		a.strictEqual(
			cache.data.has('c')
			on
		)

		a.strictEqual(
			cache.datahas('d')
			on
		)

		@()

	(e) ->

		le(e)
		

		console.log('Passed ' + module.id)
		__()
)
