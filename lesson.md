A stack is a FILO (First in Last Out) collection. It's called a stack because it behaves like a stack of objects.
```psuedocode
# psuedocode
stack<int> mystack = [1, 2, 3, 4]
mystack.push(3)
# mystack is now [1, 2, 3, 4, 3]
int res = mystack.pop()
# res = 3
# mystack = [1, 2, 3, 4]
```

## Assignment:
Implement a basic stack!
Stacks are much easier than the other datastructures, becuase they don't even need you to make indexing.

### Steps:


- [ ] Make the "push" method
    - [ ] Add the element to the vector storing current data
- [ ] Make the "top" method
    - [ ] Return a _reference_ to the last element
- [ ] Make the "size" method
    - [ ] Return the amount of elements in the stack
- [ ] Make the "pop" method
    - [ ] Remove the final element of the internal vector and return it
