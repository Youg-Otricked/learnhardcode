Back in my day, we didn't have all this fancy `await` stuff. We had pain, sweat, tears, and `new Promise`, `.then()`, `.catch()`, and `.finally()`.
That's about the only reason that could possibly have any grounding for why you shouldn't use `await`/`async`. Back in ye days of yor, because the lack of `await`, you could only do asynchronous code using callbacks, e.g. setTimeout, where you pass a function to a function as a parameter. `.then()` syntax is generally easier than _non-Promise callbacks_, but `async` and `await` are even easier. Overall, use `async` and `await` over `new Promise` whenever possible. On this very site, I use `async` and `await` near exclusivly, other than somthing like this:
```ts
initHaskell().then(() => {
  setup = true;
});
```
And even then, somtimes I do this instead:
```ts
async function setup() {
    await initHaskell();
    setup = true;
}
```
`async` and `await` were relased long after the `.then()` api, which is why so much code uses it.

---
## Question:
Which is generally cleaner to use.