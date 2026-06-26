# NPM Tips and Tricks


npm adduser --registry https://jtravis76.azurewebsites.net
- this creates a `.npmrc` with auth token under C:\Users\%USERPROFILE%/

npm whoami --registry https://jtravis76.azurewebsites.net

- Update the package.json name with org:  
"name": "@securitas/vue-select",

-CD into directory and run
npm pack


npm publish --registry https://jtravis76.azurewebsites.net





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

## To test installing a package locally
CD into the test project
Copy the tar file and run this command

```
npm install ./package-name.tgz
```