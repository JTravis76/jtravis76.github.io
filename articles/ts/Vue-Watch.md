# Vue Js Watch Function
Below are a few ways to write a Watch function in Vue Js.

```ts
export default {
  name: "SomeComponent",
  watch: {
    brand: {
      immediate: true,
      handler: (newVal) => {
        // this, is NOT a Vue object
        console.log(newVal, this);
      },
    },
  },


  watch: {
      state: {
        immediate: true,
        deep: false,
        handler: function onStateChanged(newVal) {
          // this, IS a Vue object
          console.log(newVal, this);
        },
      },
    },
}
```
