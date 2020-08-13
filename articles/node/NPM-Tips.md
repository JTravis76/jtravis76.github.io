#meta-start
Title:NPM Tips and Tricks
Created:8-11-2020
Category:node
#meta-end
# NPM Tips and Tricks

When clearing npm cache for service account. Not able to get packages from multi-registries.  
Had to include additional command switch; 

```
npm i @ports/vue-datepicker --registry http://devapps2:8080/
```

> NOTE: I am using a on-premise NPM server

Also, set registry to download private scope in `.npmrc` file.

```
@ports:registry=http://devapps2:8080/
```