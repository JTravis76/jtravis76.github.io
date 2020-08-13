#meta-start
Title:Reparent Branches in Team Fountaion Server (TFS)
Created:8/11/2020
Category:azure
#meta-end
# Reparent Branches in Team Fountaion Server (TFS)
Once I had a setup in TFS where branches were the following:

```
+-MAIN
|--+-Development
   |--+-Feature
```

And I need to remove the `Development` branch and reparent `Feature` to directly merge into `Main`.  
Here is the command I used.

```cmd
tf vc merge /recursive /baseless /version:C15662 "C:\Workspaces\ProjectX\Feature" "C:\Workspaces\Project\Main"
```