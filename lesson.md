Pop should be WAY simpler than Push.

---

## Errors

In C++, you can _intentionally make your own errors_. Remember, bugs = bad, errors do not. Bugs are unintended mistakes in **your code**, but errors are just responses to **others bad input or code**. In C++, you can make a error using the `throw` statement, which just throws out the object as an error.

When code throws an error, it's not all over. In C++ you can _catch runtime errors_ using `try catch` blocks.

```cpp
#include <iostream>
#include "myFile"
int main() {
  try {
    someForeignFunction();
  } catch (string c) {
    std::cout << c;
    return 1;
  } catch (...) {
    std::cout << "Unknown error"
    return 1;
  }
}
```

In the above code, if any code in the `try` block (in our case, `someForeignFunction`) throws an error, the catch blocks catch it. The catch block with `string c` will catch thrown strings, and the `...` catch block catches _anything_.

---

## Assignment:

Make the pop method!

- [ ] Make the operator[] throw the error "Unable to access out-of-bounds index" (casted as a string) if index is less than length - 1.
- [ ] Make the `void pop()` method:
  - [ ] If length is < 1 throw "Cannot pop a empty vector" (casted as a string).
  - [ ] Otherwise, subtract one from length.