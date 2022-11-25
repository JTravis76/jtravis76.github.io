# Hide Modal Popup Scrollbar
When building a custom modal, often times the contents may push beyond the height of the modal. This creates a visible scrollbar in the browser. Maybe showing two scrollbars depending the context behind it.

Below snippet mimic what Bootstrap modals are doing.

```ts
toggleModal() {
  this.showModal = !this.showModal;
  // temporary hide the second scrollbar while modal is visible
  // Bootstrap uses css class 'modal-open' on <body>
  if (this.showModal) {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  }
  else {
    document.getElementsByTagName('body')[0].style.overflow = '';
  }
},
```
