# No Special Characters
While working on a project, there was a requirement to remove character while the user typed in 
an input field (keyword search field). Snippet below remove any characters found in the keyword.

```ts
let keyword = "some text entered from user"; //<- updated dymaically
const characters = "!@#$%^&*()+=-[]\\';,./{}|\":<>?~`_";

function onKeyUp(e: KeyboardEvent) {
    if (characters.includes(e.key)) {
        // remove
        keyword = keyword.substring(0, keyword.length - 1);
    }  
}
```