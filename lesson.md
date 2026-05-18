Just a quick reminder
- `git log` (--no-pager, or q to exit, hjkl or arrow keys to move around)
- `git cat-file -p <hash>`
> `log` is porcelain and `cat-file` is plumbing. You use `log` more than `cat-file`, but we use `cat-file` in this course to show the innerworkings of git.

---
## Assignment:
1. Create the second file, this time called `commonIssues.md` in the `basicGuide` directory, with the content
```markdown
# Most Common Issues:

- No Wifi
- Page won't load
- App takes forever to open
- Mouse stopped working
```
2. Save stage and commit it, and give it any commit message you want, as long as it starts with `B:`, e.g. `B: add common issues`
3. Use `cat-file` to look at the content of the commit you just made. _You should see a new field, parent!_

Submit the cli tests _in the root of the project_