#meta-start
Title:Convert Hex string to Char string
Created:3-18-2020
Category:other
#meta-end
# Convert Hex string to Char string

From Javascript:

```js
var value = String.fromCharCode("0x2265");
```

From C#:

```c#
string value = (char)Int16.Parse("0x2265", System.Globalization.NumberStyles.AllowHexSpecifier) ;

string value = (char)Int16.Parse("2265", System.Globalization.NumberStyles.AllowHexSpecifier);
```