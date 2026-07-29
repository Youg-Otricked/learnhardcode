Now, we have used list to see all your config values. Get gets one specific value.
Think of list like
```bash
cat $(ls .)
```
and get like
```bash
cat <thing>
```
```git
git config get <key>
```
Keys are still in that format from a few lessons ago, <namespace>.<key>

---
## Assignment:

Our lone investor wants to see how epically we wasted his money!
Use `get` to get the `getapp.users` key from your local config.

