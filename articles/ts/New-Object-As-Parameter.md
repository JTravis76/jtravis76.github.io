# Passing an Object to be "New" Later
This may seem overkill, but wanted a way to create a new child object that was passed in a parameter.

When Main gets triggered, it will create a new Bar class passing in an empty Foo class. During the Create() function, Foo becomes an object and executes. 

```typescript
class Foo {
    constructor(func: Function) {
        this.id = 0;
        this.func = func;
    }
    public id: number;
    public func: Function;
}
// ============
class Bar {
    constructor(foo: { new(f: Function): Foo} ) {
        this.foo = foo;
    }
    public foo: { new(f: Function): Foo };

    create() {
        console.log(new this.foo( () => {} ));
    }
}
// ===============
class Main {
    constructor() {
        const bar = new Bar(Foo);
        bar.create();
    }
}
```