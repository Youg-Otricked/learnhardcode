The rule of 5 is a simple rule in C++ which states the following:
If you define any of the 5 following methods:
```
~Buffer();
Buffer(const Buffer&);
Buffer& operator=(const Buffer&);
Buffer(Buffer&&);
Buffer& operator=(Buffer&&);
```
You really should consider define the rest of them. You may think "But I dont wan to write 5 methods just to write a destructor!
That's why `= default` exists. It just tells the compiler to use the default implementation.
```
~Buffer() {
    ...
}
Buffer(const Buffer&) = default;
Buffer& operator=(const Buffer&) = default;
Buffer(Buffer&&) = default;
Buffer& operator=(Buffer&&) = default;
```

## Question:

Which of these methods is _not_ part of the rule of 5?
