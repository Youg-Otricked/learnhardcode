Git stores info about authors when you're making a commit, so you can see who made a change (and repremand them for vibe coded ai-slop). Git checks your global configuration for the email and name you want. You can update it like this:
```bash
git config set --global user.name "Me"
git config set --global user.email "me@gmail.com"
```
> This course uses `git version` of at least 2.46.0. See the 2nd lesson for install instructions.
> In earlier git versions, the config command uses different flags, which still work but give deprecation warnings.

Let's split up that command:
- `git config`: The config command for git.
- `set`: Set subcommand
- `--global`: This stores it _globaly_ in your ~/.gitconfig file. The inverse, `--local` is only for the current repo.
- `user`: The `user` section.
- `name`: The `name` key in the section.
- `"Me"`: The value to be set

---
## Assignment:
You can store _**any**_ data in your git config. Only certain keys are _used_, but you still can use any section and key.

_Locally_ set the following keys:

- `getapp.version`: `0.1.2`
- `getapp.users`: `0`

Git has a command to see config
```bash
git config list --local #--global for global only
```
Or you can just read the local file
```bash
cat .git/config
```