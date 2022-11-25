# HTMLElement 'Visible' Extensions
I needed to know when an element is within the browser's viewport. jQuery had a function to watch elements during scrolling. I decided to extend the HTMLElement property with a Typescript version.


jQuery version found [here](https://css-tricks.com/slide-in-as-you-scroll-down-boxes/).
```js
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
  (($) => {
    $.fn.visible = function(partial) {
      var $t            = $(this),
          $w            = $(window),
          viewTop       = $w.scrollTop(),
          viewBottom    = viewTop + $w.height(),
          _top          = $t.offset().top,
          _bottom       = _top + $t.height(),
          compareTop    = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom;
      return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
    };
  })(jQuery);

  $(window).scroll((e) => {
    $("label").each(function (i, el) {
      var el = $(el);
      if (el.visible(false)) {
        console.log("COME_IN");
      }
    });
  });
</script>
```

```ts
/** Visible
 * Determine if element is visible within browser's viewport
 * @param partial Element is parting visible
 * @returns Booleans, true/false
 */
// eslint-disable-next-line func-names
HTMLElement.prototype.visible = function (partial = false) {
  const $t = this;
  const $w = window;
  const viewTop = $w.scrollY;
  const viewBottom = viewTop + $w.innerHeight;
  const top = $t.offsetTop;
  const bottom = top + $t.offsetHeight - 2;
  const compareTop = partial === true ? bottom : top;
  const compareBottom = partial === true ? top : bottom;

  return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
};

// Usage
window.addEventListener('scroll', (e) => {
  document.querySelectorAll('label')
    .forEach((el) => {
      console.log(el.visible());
    });
});
```

Other ways of extending a DOM element.

```ts
interface HTMLElement extends Element {
    visible(partial: boolean): boolean;
}

/*
I could create a brand new HTML tag/element :)
interface EL extends Element {
    visible(partial: boolean): boolean;
}
declare var EL: {
    prototype: EL;
    new(): EL;
};
*/

HTMLElement.prototype.visible = function (partial: boolean): boolean {
    return partial;
};

let el = document.getElementsByTagName('address')[0];
el.visible(false);
```