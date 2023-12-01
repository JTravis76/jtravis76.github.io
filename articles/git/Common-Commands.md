# Common Commands

To list all local branches
```
git branch
```
To list all remote branches
```
git branch -r
```
To list all branches (local and remote)
```
git branch -a
```

List all local merged branches.
```
git branch --merged
```
List all local unmerged branches.
```
git branch --no-merged
```
List all remote merged branches.
```
git branch -r --merged
```
List all remote unmerged branches.
```
git branch -r --no-merged
```

## Create a 'feature-branch' branch from Main and checkout 
git checkout -q -b feature-branch --no-track master 
 
## Delete branch from remote 
git push origin –delete feature-branch 
 
## Git / TFS Shelve 
git stash push –m "Some Meaningful Name" 
git stash pop 
 
## Git change branch 
git checkout –q feature-branch 
 
## Cherry-Pick commits 
-n = means no direct commit 
git cherry-pick c75ec0 e1e757 27ea51 –n 
 
## Update local branch from origin 
First CD into the branch directory. Open terminal. 
git pull origin stagingPhase2 –m "Some commit message" 
 
## Export a commit to a compressed format 
NOTE: this action will export the entire state of commit. Not just the modified files 
git archive --format zip --output ../test.zip 65f2e4 
 
## Reset to either a Tag/Branch/Commit 
git reset -–hard <tag/branch/commit> 
 
## Comparing results between two commits, NOTE:! Ugly way of viewing 
git diff <oldCommit> <newCommit> 
