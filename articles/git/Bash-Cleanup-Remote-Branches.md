# Cleanup Remote Branches - GIT

```bash
#!/bin/bash

##
# Script to delete remote git branches for multiple projects
# https://nickymeuleman.netlify.app/blog/delete-git-branches
# https://www.digitalocean.com/community/questions/how-to-delete-old-remote-git-branches-via-git-cli-or-a-bash-script.amp
##

#git clone https://my-company@dev.azure.com/my-company/_git/My_Project_1

cd My_Project_1


# loop through all (local/remote -a) remote (-r --merged | --no-merged) branches
for branch in $(git branch -r --no-merged | egrep -v "(^\*|master|staging|production)"); do
  if [ -z "$(git log -1 --since='Nov 1, 2021' -s ${branch})" ]; then
    #echo -e `git show --format="%ci %cr %an" ${branch} | head -n 1` \\t$branch
    remote_branch=$(echo ${branch} | sed 's/origin\///' )
    #remote_branch=$(echo ${branch} | sed 's/remotes\/origin\///' )
    echo ${remote_branch}
    # To delete the branches, uncomment the below command
    #git push origin --delete ${remote_branch}
  fi
done

```