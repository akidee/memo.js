memo = require('../')
a = require('assert')
step = require('step')
fs = require('fs')




TIME_TOLERANCE = 25 # ms

WAIT = 500

data = {
	0: [new Error]
	1: [undefined, []]
	2: [undefined, 'Stefan', 'Juli']
	3: [new Error]
}




context = 
	a: 1
	b: 0

asyncData = memo(
	(key, _cb) ->

		setTimeout(
			=>
				values = data[key]
				if values[0] instanceof Error
					values[0].b = @b++
				if values[1] instanceof Array
					values[1].push(@a)
				_cb.apply null, values
			WAIT
		)
	{
		context: context
		hashFunc: (key) -> ''+key
		data:
			4: [undefined, 'OK']
	}
)


stat = memo(
	fs.stat, {
		context: fs
	}
)




t = +new Date

step(

	->
		""" Correctness """
		asyncData 1, (e, value) ->
			a.strictEqual e, undefined
			a.strictEqual value.length, 1
			
		setTimeout this, 5

	->
		""" Unique call, time (evented callback) """
		asyncData 1, (e, value) =>
			a.strictEqual(
				t + WAIT - TIME_TOLERANCE < +new Date < t + WAIT + TIME_TOLERANCE
				on
			)
			a.strictEqual e, undefined
			a.strictEqual value.length, 1
			
			this()

	->
		""" Correctness and time (without evented callback) """
		asyncData 1, (e, value) =>
			a.strictEqual e, undefined
			a.strictEqual value.length, 1

			this()

	->
		""" Correctness """
		asyncData 2, (e, value1, value2) =>
			a.strictEqual e, undefined
			a.strictEqual value1, 'Stefan'
			a.strictEqual value2, 'Juli'

			this()

	->
		""" Correctness """
		asyncData 3, (e, value) =>
			a.strictEqual e instanceof Error, on
			a.strictEqual value, undefined

			this()

	->
		""" Correctness """
		asyncData 4, (e, value) =>
			a.strictEqual e, undefined
			a.strictEqual value, 'OK'

			this()

	->
		stat __filename, (e, stats) =>
			a.strictEqual e?, no
			a.strictEqual typeof stats?.size, 'number'

			console.log 'Passed'
			process.exit()
)
