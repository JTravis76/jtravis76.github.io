# Copy Key/Property Values between Objects
Here we are playing with a few examples to copy values from one object to another. Let's say we have a component with a object to hold some values while the user makes a selection.

```ts
const obj = {
  item1: "value1",
  item2: "value2",
  item3: "value3",
  item4: "value4"
};
```

Now is our parent component, there is a model object used to supply data to our form element. Maybe the user click a 'Save' button to apply some changes. Before we ship the model back to the server, we need to copy data from our child component.

```ts
const model = {
  id: 1,
  companyId: 2,
  item1: "",
  item2: "",
  item3: "",
  item4: "",
  item5: ""
} as {[key: string]: string | number };
```

Here are a few way using the `Object` class.

```ts
// This either updates the existing key or adds a new key with values
Object.defineProperty(obj, "item1", {value: "UPDATE1"});

Object.values(obj).forEach((x) => console.log(x));

// Copy value based on matching key/property
Object.keys(obj).forEach((key) => {
  const newObj = obj as {[key: string]: string};
  model[key] = newObj[key];
});

// Copy value based on matching key/property
Object.entries(obj).forEach((item) => {
  const key = item[0];
  const value = item[1];
  model[key] = value;
});

// A built-in way to copy properties between objects
Object.assign(model, obj);

// Maybe some less fortunate looping
for (let key in model) {
  console.log(key, model[key]);
}

console.log(model);
/* Expected Output
{
  id: 1,
  companyId: 2,
  item1: "value1",
  item2: "value2",
  item3: "value3",
  item4: "value4",
  item5: ""
}
*/
```