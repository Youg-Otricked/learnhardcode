There are 8 other important operators in haskell. _Remember that operators are just functions_.
- Mathamatical operators
  * `+`: Adds two numbers together
  * `-`: Subtracts two numbers from eachother
  * `*`: Multiplies two numbers with eachother 
  * `/`: Divides with a floating point result
  * `div`: Divides with a integer result
- Logical operators
  * `&&`: If both sides are True then True
  * `||`: If either side is True then True
  * `not`: If the operand is False then True and if True then false.
 
The logical precedancy is:
`not` -> `&&` -> `||`
So not happens then && then ||
Example:
```haskell
(True && False || not True)
-- False 
```


---
## Assignment:
What is the output of `not (True && False || True) && (False || True && not False) || not (False && (True || False))` (sorry how complex it is)