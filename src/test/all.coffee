step = require('stepc')

step.async(

	->

		group = @group()

		require('./index')(group())
		require('./cache')
		require('./caches/simple')(group())

	(e) ->

		if e
			console.log(e)
			console.log(e.stack)


		process.exit()

)
