You have made a fixed size array (default [] array or `std::array` equivalent), but now it's time to make our own std::vector! We will start with our final `FSizeArr` class, but renamed to `DynamArr`.

---

## How does `std::vector` work anyway?


You may be confused how vectors actually work: How are they fast if they reallocate memory every single push? The answer? they don't. Typically, vectors store a size double the amount of elements currently inside it, then every time a push would go > capacity, it doubles in size, copy's the new elements, then deletes the old array.

---

## Assignment:

Make the push method of our vector!

- [ ] In the private section, add an `int max_length` to track max capacity
- [ ] In initializer list constructor: 
  - [ ] Make length just `init.size()`
  - [ ] Make max_length S > 1 ? S : init.size() * 2;
  - [ ] Allocate value using max_length instead of length
- [ ] In normal constructor:
  - [ ] Make length 0
  - [ ] Make max_length (S > 1 ? S : 1) * 2;
  - [ ] Allocate value using max_length instead of length
- [ ] Add a `push(T val)` method that returns nothing and:
  - [ ] If length >= max_length:
    - [ ] Multiply max_length by 2
    - [ ] Store current value pointer in a variable 
    - [ ] Allocate a new array for value with size max_length
    - [ ] Use `std::copy(copy_data, copy_data + length, value)` to copy old elements
    - [ ] Delete copy_data & `nullptr` it
  - [ ] Store val in value[length];
  - [ ] Increment length