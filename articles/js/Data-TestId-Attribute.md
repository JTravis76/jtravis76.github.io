#meta-start
Title:Data-TestId HTML attribute
Created:8-11-2020
Category:js
#meta-end
# Data-TestId HTML attribute

Often times to help support QA in setting up test cases in a front-end application like VueJs, developers add a HTML attributes `data-testid=""` to assist QA in finding elements on the page.

Here is a sample Javascript snippets to run in the browser console to help developers check for testids.

```js
let parent = document.getElementById("test-id-layout");
parent.innerHTML = "";
parent.style.display = "block";
document.querySelectorAll("#tab1 [data-testid]").forEach(el => {
                    
  let rect = el.getBoundingClientRect();
  let span = document.createElement("span");
  span.className = "label label-danger";
  let id = el.getAttribute("data-testid");
  console.log(id);
  span.innerText = id;
  span.style.position = "fixed";
  span.style.top = rect.top.toString() + "px";
  span.style.left = rect.left.toString() + "px";

  parent.appendChild(span);
});
```