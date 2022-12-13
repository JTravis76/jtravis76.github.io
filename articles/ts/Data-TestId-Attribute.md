# Data-TestId HTML attribute
Often times to help support QA in setting up test cases in a front-end application like VueJs, developers add a HTML attributes `data-testid=""` to assist QA in finding elements on the page.

Here is a sample snippets to run in the browser console to help developers check for test ids.

```ts
const parent = document.getElementById("test-id-layout") as HTMLDivElement;
parent.innerHTML = "";
parent.style.display = "block";
document.querySelectorAll("#tab1 [data-testid]")
    .forEach(el => { 
      const rect = el.getBoundingClientRect();
      const span = document.createElement("span");
      span.className = "label label-danger";
      const id = el.getAttribute("data-testid");
      span.innerText = id;
      span.style.position = "fixed";
      span.style.top = rect.top.toString() + "px";
      span.style.left = rect.left.toString() + "px";

      parent.appendChild(span);
  });
```