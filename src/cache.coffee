module.exports = Cache = (options) ->

	for own k, v of options
		@[k] = v

	@

Cache.NOT_EXISTING = new Error
