describe "Iterator", ->

  it "should work", ->
    n = 10
    values = [0...n]

    list = Sonic.create(values)
    iterator = list.getIterator()


