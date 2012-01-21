util = require('util')
Cache = require('../cache')
NOT_EXISTING = Cache.NOT_EXISTING
hasOwnProperty = Object::hasOwnProperty




module.exports = SimpleCache = (options) ->

	Cache.call(@, options)

	@data = @data || {}

	@maxLength = @maxLength || 0

	@maxAge = @maxAge || 0

	@debug = @debug || no
	

	# Intervals for invalidation ...

	@intervals = []


		# ... by access frequency

	if @maxLength

		setTimeout( =>

			@intervals.push(setInterval(
				=>
					@reduce()
				500
			))
		100)


		# ... by maximum age

	if @maxAge

		@millis = (new Date).getMilliseconds()
		@timeslots = {}
		@intervals.push(setInterval(
			=>
				secs = @seconds(@maxAge)
				while @removeTimeslot(secs)
					secs--
			1000
		))

	@

util.inherits(SimpleCache, Cache)

SimpleCache::seconds = (minus = 0) ->

	Math.floor((Date.now() - @millis) / 1000) - minus

SimpleCache::timeslot = (minus = 0) ->

	secs = @seconds()
	return if @timeslots[secs]
		@timeslots[secs]
	else
		@timeslots[secs] = []

SimpleCache::get = (key, __) ->

	if hasOwnProperty.call(@data, key)
		data = @data[key]
		data[1]++
		return __(null, data[0])


	return __(null, NOT_EXISTING)

SimpleCache::set = (key, data, __) ->

	@data[key] = [ data, 1 ]
	if @maxAge
		@timeslot().push(key)
	return __(null)

SimpleCache::del = (key) ->

	delete @data[key]

SimpleCache::destruct = ->

	for i in @intervals
		clearInterval(i)

SimpleCache::reduce = ->

	if @debug
		console.log("node_memo simple cache: Current length: #{@length()}")

	if @length() < @maxLength
		return no


	if @debug
		t = Date.now()
	reducedLength = Math.floor(@maxLength / 2)

	accesses = []
	for k, v of @data
		accesses.push(v[1])
	le = accesses.sort((a, b) -> b - a)[reducedLength]

	for own k, v of @data
		if v[1] <= le
			@del(k)

	if @debug
		console.log("node_memo simple cache: Reduced to #{reducedLength} in #{Date.now() - t} ms")

	return on

SimpleCache::length = ->

	Object.keys(@data).length

SimpleCache::removeTimeslot = (slot) ->

	list = @timeslots[slot]
	if !list?
		return no


	if @debug
		t = Date.now()
	num = list.length
	for key in list
		@del(key)
	delete @timeslots[slot]
	if @debug
		console.log("node_memo simple cache: Removed #{num} objects in timeslot #{slot} in #{Date.now() - t} ms")
	return on
