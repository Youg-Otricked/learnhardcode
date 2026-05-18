Now that we know some plumbing, it's time to get fermilliar with some terms.
- `tree`: git's way of storing directorys
- `blob`: git's way of storing a file

Here's somthing simmilar to what you should have gotten after inspecting that last commit:
```bash
> git cat-file -p <hash>
tree <gobldy gook commit hash>
author Youg-Otricked <my email> 1779073286 -0700
committer Youg-Otricked <my email> 1779073286 -0700

A: add runthrough.md
```
We get:
- The `tree` object
- The `author`
- The `commiter`
- The message

However we don't get those darned contents!

---
## Assignment:
1. Use `cat-file -p` AGAIN, but this time with the hash of the tree object instead of the commit hash. You should now see a `blob` object with it's own hash.
> I recommend storing the commit hashes you make in this course in a file (not in the git tracked directory) for easy access.
2. Use `git cat-file -p` on the `blob`s hash. You should finally get it's contents!
3. Run that command again, but redirect the output to a temp file, `/tmp/blobfile.txt`