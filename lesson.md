Their are 2 types of commands in git: `porcelain`, and `plumbing`. Porcelain commands are commands you interactive with, such as add, commit, and status. Plumbing commands are low level, such as `hash-object`, `cat-file`, and `ls-tree`. Sounds like nonsense? Good.
> "We live on a placid island of ignorance in the midst of black seas of infinity, and it was not meant that we should voyage far."
> > H. P. Lovecraft

However, we sure like voyaging as deap as possible.
For the previous 10 lessons, we have covered a lot of the porcelain commands, but to attempt to satiate the insatiatable beasts that are our brains, it would be fun to check out the plumbing of this porcelain, wouldn't it?

---
![It's all files? Always has been.](https://imgflip.com/i/as202e)

ALL the data in a git repo is just stored in the `.git` directory. All your commits, your branches, your tags, everything. As I said.
Git is made up of objects, which are in the `.git/objects` directory. A commit is a object.

---
## Assignment:
1. Use `git log -n 5` to find your commit hash again.
2. Use `ls -l .git/objects` to get the content of your .git/objects dir.
3. Look for a directory that matches the first two characters of your commit hash.
4. `Use ls -al .git/objects/<the two chars that match>/` to list the contents of that directory. You should see a file whose name is the rest of the hash. Use the full path for the question.

