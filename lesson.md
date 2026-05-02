What if you assign a number greater than 2147483647 or less than -2147483648 to a `int`?
That is called a _integer overflow_. That means that your data cannot be stored where you tried to assign it to. In some compilers, it errors, and in others, it wraps around. This is obvously very bad. In the situation
```c
int x = 2147483647;
```
If you added 1 to it
```c
x++;
```
Then, this would happen:
```
printf("%d", x);
```
> -2147483648
> > Obviously not good.

---
## Question
What would be the result if you did -2147483648 - 10.