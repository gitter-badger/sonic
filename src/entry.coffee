class Entry

  constructor: ( value, options ) ->
    if value?
      @_value = value
    else @_value = options.value

    @id = Sonic.uniqueId()
    if options
      @list      = options.list
      # @_next     = options.next
      # @_previous = options.previous

  root: ( ) ->
    return @

  value: ( ) ->
    @_value if @_value?

  next: ( ) ->
    return @_next if @_next?

  setNext: ( next ) ->
    @_next = next

  previous: ( ) ->
    return @_previous if @_previous?

  setPrevious: ( previous ) ->
    @_previous = previous


