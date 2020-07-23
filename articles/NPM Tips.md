
# NPM Tips and Tricks

* when clearing npm cache for service account. not able to get packages from mutil-registries.
Had to include additional cmd; npm i @ports/vue-datepicker --registry http://devapps2:8080/
find way to download private scope .npmrc @ports:registry=http://devapps2:8080/