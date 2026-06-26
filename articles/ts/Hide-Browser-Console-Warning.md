# Hide Browser Console Warnings

The snippet will remove all warnings from the browser's console in a production environment.

```ts
if (import.meta.env.PROD) {
  const originalWarn = console.warn
  console.warn = function (... args) {
    args = []
    return originalWarn.apply(console, args)
  }
}

```