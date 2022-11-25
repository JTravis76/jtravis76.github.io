# Dropdown Open/Close Traverse

I needed to leave a drop-down expanded while the user was selecting multi-checkboxes.
All other clicks will close the drop-downs.

Below is a Vue component `MultiSelectDropDown`
```ts
  mounted() {
    const vm = this;
    this.$nextTick(() => {
      document.addEventListener('click', (e) => {
        let el = e.target;
        let found = false;
        // Traverse and skip to leave drop-down open
        while (el && el.parentElement && !found) {
          el = el.parentElement;
          found = (el && el.closest('.multi-select-dropdown') !== null);
        }
        if (!found) vm.showList = false;
      });
    });
  },
```