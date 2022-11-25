# Key Array - Typing

```ts
let features: {[key: string]: boolean} = {
        maxiumTrak: false,
        resourceCenter: true,
    };

function setFeature(payload: {[key: string]: boolean}) {
    const feat = Object.keys(payload)[0];
    features[feat] = payload[feat];
}

setFeature({
    resourceCenter: false
});
```

Trying to update property of an object, Typescript might display this message in IDE.

> Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ foo: bar }'.  No index signature with a parameter of type 'string' was found on type '{ foo: bar }'

You will need to update the typing for the object.

```ts
const categories: {
  register: 0,
  bibleStudy: 0,
  churchVisit: 0,
  doctorVisit: 0,
  ewylWS: 0,
  ewlyHW: 0,
} as unknown as { [key: string]: number };

let category = "register";
categories[category] = cnt * points;
```