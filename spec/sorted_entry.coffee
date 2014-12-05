# describe "SortedEntry", ->

#   beforeEach ->
#     @root = new Sonic.SortedEntry(null, sortValue: 0)
#     @n = 10
#     @nodes = [@root]


#   describe "always", ->
#     beforeEach ->
#       for i in [1..@n]
#         node = new Sonic.SortedEntry(null, sortValue: i)
#         @nodes[i] = node
#         @root.insert node

#     it "should have a root node with a size equal to n + 1 (the root node)", ->
#       expect(@root.size()).toEqual(@n + 1)
#       # console.log @root.toString()

#     it "should have a balance between -depth <= x <= depth", ->
#       for i in [1...@n]
#         node = @nodes[i]
#         expect(node.balance()).not.toBeLessThan(-1 * node.depth())
#         expect(node.balance()).not.toBeGreaterThan(node.depth())
#         # console.log i, node.balance()

#     it "should have a size of 1 + leftSize + rightSize", ->
#       for i in [1...@n]
#         node = @nodes[i]
#         expect(node.size()).toEqual(1 + (node.left?.size() or 0) + (node.right?.size() or 0))

#     it "should have a smaller values on the left side", ->
#       for i in [1...@n]
#         node = @nodes[i]
#         expect(node.left?.sortValue() or -Infinity).toBeLessThan(node.sortValue())

#     it "should have a greater or equal values on the right side", ->
#       for i in [1...@n]
#         node = @nodes[i]
#         expect(node.right?.sortValue() or Infinity).not.toBeLessThan(node.sortValue())

#   describe "setLeft", ->
#   describe "setRight", ->
#   describe "insert", ->

#     beforeEach ->
#       @oldParent = new Sonic.SortedEntry(null, sortValue: 0)
#       @newParent = @root

#       @child = new Sonic.SortedEntry(null, sortValue: 2)
#       @otherChild = new Sonic.SortedEntry(null, sortValue: -2)

#       @oldParent.insert(@child)
#       @oldParent.insert(@otherChild)

#       @child.parent = @newParent
#       @otherChild.parent = @newParent

#     it "should have set the parent of the children to the root node", ->
#       expect(@child.parent).toBe(@newParent)
#       expect(@otherChild.parent).toBe(@newParent)

#     it "should not have set the children to the appropriate side of the parent", ->
#       expect(@newParent.right).not.toBe(@child)
#       expect(@newParent.left).not.toBe(@otherChild)

#     it "should not have removed the children from their original parent", ->
#       expect(@oldParent.right).toBe(@child)
#       expect(@oldParent.left).toBe(@otherChild)


#   # describe "rotateLeft", ->
#   #   beforeEach ->
#   #     @n = 3
#   #     for i in [1..@n]
#   #       node = new Sonic.SortedEntry(i)
#   #       @nodes[i] = node
#   #       @root.insert node

#   #     @target = @nodes[2]
#   #     @pivot = @target.right()
#   #     @parent = @target.parent()

#   #     @nodes[2].rotateLeft()

#   #   it "should have moved the target to the left of the pivot", ->
#   #     expect(@pivot.left()).toBe(@target)

#   #   it "should have moved the pivot to the right of the parent", ->
#   #     expect(@parent.right()).toBe(@pivot)

#   #   it "should have moved the pivot to the child of the target", ->
#   #     expect(@parent.right()).toBe(@pivot)

#   #   describe "double rotation", ->
#   #     beforeEach ->
#   #       @n = 6
#   #       for i in [1..@n]
#   #         node = new Sonic.SortedEntry(i)
#   #         @nodes[i] = node
#   #         @root.insert node

#   # describe "rotateRight", ->
#   #   beforeEach ->
#   #     @n = 6
#   #     for i in [1..@n]
#   #       node = new Sonic.SortedEntry(-i)
#   #       @nodes[i] = node
#   #       @root.insert node

#   #     @target = @nodes[2]
#   #     @pivot = @target.left()
#   #     @parent = @target.parent()

#   #     console.log @root.toString()
#   #     # @nodes[2].rotateRight()


#   #   it "should have moved the target to the right of the pivot", ->
#   #     expect(@pivot.right()).toBe(@target)

#   #   it "should have moved the pivot to the parent of the target", ->
#   #     expect(@target.parent()).toBe(@pivot)

#   #   it "should have moved the pivot to the child of the target", ->
#   #     expect(@parent.left()).toBe(@pivot)

#   #   describe "double rotation", ->
#   #     beforeEach ->
#   #       @n = 6
#   #       for i in [1..@n]
#   #         node = new Sonic.SortedEntry(i)
#   #         @nodes[i] = node
#   #         @root.insert node

