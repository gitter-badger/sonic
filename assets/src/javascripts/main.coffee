rivets.adapters[':'] = {
  read: ->
  subscribe: ->
  unsubscribe: ->
}

rivets.binders['sonic-each-*'] = {
  function: true

  bind: (el) ->
    console.log 'bind'
    @elById = {}

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
    @list = list

    @list.onInvalidate ( prev, next ) =>
      iterator = @list.getIterator(prev)
      @binder.remove(prev, next)

      until next = iterator.getNext() is next
        @binder.add iterator.currentId, iterator.current()

  add: (key, value) ->
  remove: (prev, next) ->
    start = @elById[prev]
    end = @elById[next]

    range = document.createRange()
    range.setStartAfter(start)
    range.setEndBefore(end)

    # Remove the elements from our @elById


    range.deleteContents()
    # rivets.binder['each-*'].route(list.toArray())
}

class ListView extends Shadow.AbstractView




Shadow.factories.unshift ( item ) ->
  return null unless item instanceof Sonic.AbstractView
  else return new ListView(item)

list = Sonic([1,2,3,4,5])
listView = Shadow(list)
document.body.appendChild(listView.element)
