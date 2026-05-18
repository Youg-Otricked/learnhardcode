
Git stores the ENTIRE copy of the file, not just the changed content. So why isn't git painfully slow?

### Optimizations
While git _does_ store entire file copies, it _also_ does have some preformance optimizations (obviously).
1. Git **compresses** and **packs** files to store them more efficiently.
2. Git deduplicates files, meaning that if a file doesn't change between x and y commit, it only stores 1 copy.

---
## Assignment:
1. Use `git cat-file -p` to view the hash of the `blob` for the commonIssues.md file you made last lesson. Save it in the notes I said to make a few lessons ago for the commit hashes.
2. Create two new files in your project, one in the realIssues and one in the fakeIssues, with the following content:
`fakeIssues/mouse_stopped.md`:
```markdown
## Mouse stopped working:

Steps:
- Unplug mouse
- Plug into other port.
- Done!
```
`realIssues/app_broken.md`:
```markdown
## An app refuses to open:

Steps:
- If on Linux or MacOS:
- - Run `ps -a`
- - If process for app exists:
- - - Run `kill <proc number>`
- - Else:
- - - Turn off and back on computer
- Else if on Windows:
- - Press `Ctrl + Shift + Esc`
- - If app is in task manager:
- - - Press it then press end process
- - Else:
- - - Turn off and back on computer
- Else:
- - No. No weird OSes. No OpenBSD
- Done!
```
3. Stage and commit the files in one commit, message starting with `C:`, e.g. `C: add a few issues`
4. Use the `cat-file` command to view the hash of the `blob` for the commonIssues.md file again. You should see it's the same, because we didn't change it!

Run the cli command from the repo root.