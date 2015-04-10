observe = ( source, callback ) ->
  list = Sonic([])
  sourceIdById = {}
  idBySourceId = {}

  source.forEach ( value, sourceId ) ->
    id = list.push(value)
    sourceIdById[id] = sourceId
    idBySourceId[sourceId] = id
    return true

  source.onInvalidate (sourcePrev, sourceNext ) ->
    events = []
    sourceIterator = source.getIterator(sourcePrev, sourceNext)
    iterator = list.getIterator(idBySourceId[sourcePrev],
                                idBySourceId[sourceNext])

    while true
      while iterator.moveNext()
        break if source.has(sourceId = sourceIdById[iterator.currentId])

        list.delete iterator.currentId

        events.push
          type: "delete"
          obj: source
          key: sourceIdById[iterator.currentId]
          oldValue: iterator.current()

        delete sourceIdById[iterator.currentId]
        delete idBySourceId[sourceId]

      while sourceIterator.moveNext()
        break if list.has(currentId = idBySourceId[sourceIterator.currentId])

        id = list.add(sourceIterator.current(), null, iterator.currentId or 0)
        sourceIdById[id] = sourceIterator.currentId
        idBySourceId[sourceIterator.currentId] = id

        events.push
          type: "add"
          obj: source
          key: sourceIdById[id]

      if (idBySourceId[sourceId] is currentId) and
            (sourceIdById[currentId] is sourceId) and
            (iterator.current() isnt sourceIterator.current())

        events.push
          type: "update"
          obj: source
          key: sourceIdById[iterator.currentId]
          oldValue: iterator.current()

        list.set(iterator.currentId, sourceIterator.current())

      break unless sourceIterator.currentId

    callback events
  return

rivets.binders['sonic-each-*'] =
  function: true

  bind: (el) ->
    console.log 'bind'
    @exports = new Map()

    unless @marker?
      attr = [@view.prefix, @type].join('-').replace '--', '-'
      @marker = document.createComment " rivets: #{@type} "
      @iterated = []

      el.removeAttribute attr
      el.parentNode.insertBefore @marker, el

      el.parentNode.removeChild el

    else
      for view in @iterated
        view.bind()
    return;

  unbind: (el) ->
    console.log 'unbind'

    keys = Object.keys(@views)
    for key in keys
      @binder.delete.call @, key

  routine: (el, list) ->
    console.log 'routine', list

    modelName = @args[0]
    @el = el
    @list = list

    if @views and @views[key]
      @binder.delete.call @, key

    @views = {}

    @list.forEach ( value, id) =>
      console.log "Adding", id, value
      @binder.add.call @, id, value
      return true

    observe @list, ( events ) =>
      for event in events
        eventKey = event.key
        eventModel = event.obj.get(event.key)
        console.log "List update", eventKey, eventModel

        # console.log event, event.type
        switch event.type
          when 'add'
            @binder.add.call @, eventKey, eventModel
          when 'delete'
            @binder.delete.call @, eventKey, eventModel
          when 'update'
            @views[eventKey].bindings[0].set(eventModel)
            # @binder.delete.call @, eventKey
            # @binder.add.call @, eventKey, eventModel
            # console.log key, eventKey
            # @exports.get(key)[eventKey] = eventModel

  add: ( key, model ) ->
    modelName = @args[0]
    data =
      index: key
    data[modelName] = model

    @exports.set(key, data)

    # Object.observe data, (events) =>
    #   for event in events
    #     eventKey = event.name
    #     eventModel = event.object[event.name]

    #     console.log eventKey, eventModel, event
    #     @collection[key] = eventModel

    # Object.observe @collection, (events) =>
    #   for event in events
    #     eventKey = event.name
    #     event

    options = @view.options()
    options.preloadData = true

    template = @el.cloneNode true

    view = new rivets._.View(template, data, options)
    @views[key] = view
    view.bind()

    @marker.parentNode.insertBefore template, previous?.nextSibling

  delete: ( key, model ) ->
    view = @views[key]
    view.unbind()
    view.els.forEach ( el ) -> el.remove()

    delete @views[key]


# rivets.adapters[':'] = {
#   read: ->
#   subscribe: ->
#   unsubscribe: ->
# }

# rivets.binders['sonic-each-*'] = {
#   function: true

#   bind: (el) ->
#     console.log 'bind'
#     @elById = {}

#     unless @marker?
#       attr = [@view.prefix, @type].join('-').replace '--', '-'
#       @marker = document.createComment " rivets: #{@type} "
#       @iterated = []

#       el.removeAttribute attr
#       el.parentNode.insertBefore @marker, el

#       el.parentNode.removeChild el

#     else
#       for view in @iterated
#         view.bind()
#     return;

#   unbind: (el) ->
#     console.log 'unbind'

#     keys = Object.keys(@views)
#     for key in keys
#       @binder.delete.call @, key

#   routine: (el, list) ->
#     @list = list

#     @list.onInvalidate ( prev, next ) =>
#       iterator = @list.getIterator(prev)
#       @binder.remove(prev, next)

#       until next = iterator.getNext() is next
#         @binder.add iterator.currentId, iterator.current()

#   add: (key, value) ->
#   remove: (prev, next) ->
#     start = @elById[prev]
#     end = @elById[next]

#     range = document.createRange()
#     range.setStartAfter(start)
#     range.setEndBefore(end)

#     # Remove the elements from our @elById


#     range.deleteContents()
#     # rivets.binder['each-*'].route(list.toArray())
# }
class ListView extends Shadow.EnumerableView


  @setComponent
    html:
      "div.shadow-abstract-view
          .shadow-expandable-view
          .shadow-enumerable-view
          .sonic-list-view":
            "table": [
              { "thead[rv-on-click='toggle']":
                  "tr":
                    "td[colspan='2']": "{ name }"
              }

              { "tbody[rv-if='expanded']": {
                  "tr[rv-sonic-each-entry='item']": [
                    { "td.key[rv-text='index']": "" }
                    { "td.value[rv-view='entry']": "" } # [rv-on-dblclick='toggleEditable']
                    # { "td.editor": "input[rv-eval='entry']": "" }
                  ]
                }
              }
            ]
    css:
      ".shadow-abstract-view": {}

Shadow.factories.unshift ( list ) ->
  return null unless list instanceof Sonic.AbstractList
  return new ListView(list)
# listView = Shadow(list)

# list = Sonic([1,2,3,4,5])
# document.body.appendChild(listView.element)
