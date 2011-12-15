Cache = require('../cache')
a = require('assert')



# NOT_EXISTING

a.strictEqual(
	Cache.NOT_EXISTING instanceof Error
	on
)

data =
	a: 1
	b: 2
	c: 3

a.deepEqual(
	new Cache (data)
	data
)

console.log('Passed '+__filename)
