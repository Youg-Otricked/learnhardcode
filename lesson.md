All code in zig starts in the `main` function.
```zig
pub fn main(init: std.process.Init) !void {
    // Code starts here.
}
```
To break this down:
- `pub fn`: This makes a function external things (such as the compiler) can access. Ignore functions for now.
- `main`: This titles the function main.
- `init: std.process.Init`: This defines the init argument, which allows you to print to stdout.
- `!void`: This means the function can produce an error, and returns nothing useful.
- `{`: This starts the function's' code block.
- `}`: This ends the function's code block.

Your code starts on the first line of the main function.

---
## Output

Now, it's time to learn output. Yes, you saw the horrifying
```zig
try std.Io.File.stdout().writeStreamingAll(init.io, "Hello, World!\n");
```
That however, is a later thing. That writes to stdout, where user output goes, but we can also write to stderr, where errors go. Wanna see that?
```zig
std.debug.print("Hello, World!\n");
```
Yup. Simpler.
To print you need to do two things: A: import `std`.
At the top of your file, put:
```zig
const std = @import("std");
```
This allows you to use things from the standard library, and use it as `std`
To print, you use the std.debug.print method:
```zig
std.debug.print("Text goes here");
```

---
## Assignment:
We are starting to make a simple doc/improvments program! Make the program print the following:

```
Max line length is now 160 (not 80!), but uses 2 punch cards per line.
Allcaps is no longer used. Now it's all nocaps!
```