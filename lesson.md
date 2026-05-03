In Git, there are various states your files can be in. Importantly,
- `untracked`: Not being traked by Git, e.g. you just created it and haven't done anything to it, or it's not part of a repo.
- `staged`: Marked for inclusion in next git commit.
- `commited`: Saved in your repo's history.

The `git status` command shows the current state of all files in your current repo.

---
## Assignment:
1. [ ] Create a file in the `basicGuide` directory, `runthrough.md` and put the following content in it:
```md
# Steps for new issues:
```
> The `.md` extention means its a _markdown_ file, which is commonly used to write docs. This lesson is written in markdown
2. [ ] Save the file, then run
```bash
git status
```
Run and submit the tests in the root directory.

---
<details>
  <summary>Having Trouble?</summary>
  <p>This course is in english (obviously.) If you arn't in english, you can set it like this:</p>
  <code>export LANG=en_US.UTF-8</code>
  <p>You might need to install the language pack for your system, e.g. <code>sudo apt-get install language-pack-en</code> for Ubuntu.</p>
</details>

