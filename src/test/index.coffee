memo = require('../')
a = require('assert')
step = require('step')
fs = require('fs')
le = (e) ->
	if e?.name == 'AssertionError'
		console.log(e)
		console.log(e.stack)
		process.exit()




context =
	i: 5

sync = null
async = null
result = null

step.async(

	->

		# ()

			# all params, sync

		sync = memo(
			(i) ->
				if !i
					throw new Error('Must not divide by 0')


				return @i / i

			{
				context: context
				hashFunc: (i) -> ''+i
				cache: './caches/simple'
				isSync: on
			}
		)

				# data

		a.strictEqual(
			typeof sync
			'function'
		)

				# behavior: error

		sync(0, @)

	(e, r) ->

		le(e)
			

		result = arguments

		a.strictEqual(
			e instanceof Error
			on
		)

		a.strictEqual(
			r?
			no
		)

				# behavior: same result

		sync(0, @)

	(e, r) ->

		le(e)
			

		a.strictEqual(
			arguments[0]
			result[0]
		)

				# behavior: no error

		sync(2, @)

	(e, r) ->

		le(e)


		a.strictEqual(
			e?
			no
		)

		a.strictEqual(
			r
			context.i / 2
		)

			# all params, async

		async = memo(
			(i, __) ->
				if !i
					e = new Error('Must not divide by 0')
					r = null
				else
					e = null
					r = @i / i

				setTimeout(
					-> __(e, r)
					1000
				)

			{
				context: context
				hashFunc: (i) -> ''+i
				cache: './caches/simple'
			}
		)

				# data

		a.strictEqual(
			typeof async
			'function'
		)

				# behavior: error, several calls at once

		i = 2

		f = null
		g = null

		ready = =>

			a.strictEqual(
				f
				g
			)

			@()

		async(0, (e, r) =>

			a.strictEqual(
				e instanceof Error
				on
			)

			f = e

			if --i == 0
				ready()
		)

		async(0, (e, r) =>

			a.strictEqual(
				e instanceof Error
				on
			)

			g = e

			if --i == 0
				ready()
		)

	(e) ->

		le(e)


			 # behavior: no error

		async(5, this)

	(e, r) ->

		le(e)

		a.strictEqual(
			e instanceof Error
			no
		)

		a.strictEqual(
			r
			1
		)

		@()
		

	(e) ->

		le(e)
		

		console.log('Passed')
		process.exit(0)
)
