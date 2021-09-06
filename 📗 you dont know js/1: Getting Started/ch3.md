<h1 style="text-align:center">Digging to the Roots of JS 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/ch3.md)

- [Iteration](#iteration)
  - [What is _Iteration_ ?](#what-is-iteration-)
  - [Consuming Iterators](#consuming-iterators)
  - [Iterables](#iterables)
- [⭐️ Closure](#closure)
  - [Examples](#examples)
  - [Use Case](#use-case-)
- [⭐️ `this` keyword](#this-keyword)
  - [Explain w examples](#explain-w-examples)
- [⭐️ Prototypes](#prototypes)
  - [Explain w examples](#explain-w-examples-1)
  - [Object Linkage](#object-linkage)
  - [⭐️ `this` Revisited](#️-this-revisited)

## Iteration

### What is _Iteration_ ?

- 💁🏻‍♂️ Since programs are essentially built to process data (and make decisions on that data), **the patterns used to step through the data** have a big impact on the program's readability.
- 💁🏻‍♂️ The iterator pattern has been around for decades, and suggests a **"standardized" approach to _consuming data from a source one chunk at a time._**
- 💁🏻‍♂️ The iterator pattern defines a data structure called an **"iterator"** that has a reference to an underlying data source (like the query result rows)
  - which exposes a method like next() . Calling next() returns the next piece of data
- 👉🏼 ES6 standardized a specific protocol for the iterator pattern directly in the language.
  - The protocol defines a `next()` method whose return is an object called an iterator result
  - the object has `value` and `done` properties
    - `done`: a boolean that is false until the iteration over the underlying data source is complete.

### Consuming Iterators

- 💁🏻‍♂️ With the ES6 iteration protocol in place, it's workable to consume a data source one value at a time, checking after each `next()` call for done to be `true` to stop the iteration.
- 👉🏼 But this approach is rather **manual**, so ES6 also included several mechanisms (syntax and APIs) for **standardized consumption of these iterators**:

1. **`for..of`**

```js
// given an iterator of some data source:
var it = /* .. */;

// loop over its results one at a time
for (let val of it) {
    console.log(`Iterator value: ${ val }`);
}
// Iterator value: ..
// Iterator value: ..
// ..
```

2. **`...` operator**

This operator actually has two symmetrical forms:

- **spread** (an iterator-consumer.)

  - To spread an iterator, you have to have something to spread it into. There are two possibilities in JS:
    - an array
    - an argument list for a function call
    ```js
    // spread an iterator into an array,
    // with each iterated value occupying
    // an array element position.
    var vals = [...it];
    ```
    ```js
    // spread an iterator into a function,
    // call with each iterated value
    // occupying an argument position.
    doSomethingUseful(...it);
    ```
  - the iterator-spread form of `...` follows the iterator-consumption protocol (the same as the for..of loop) to retrieve all available values from an iterator and place (aka, spread) them into the receiving context (array, argument list).

- **rest** (or gather)

### Iterables

- 💁🏻‍♂️ The iterator-consumption protocol is technically defined for consuming iterables; **an iterable is a value that can be iterated over.**
- 👉🏼 The protocol **automatically creates an iterator instance from an iterable**, and consumes just that **iterator instance** to its completion.
- 👉🏼 This means **a single iterable could be consumed more than once;** each time, a new iterator instance would be created and used.

#### where do we find iterables?

- ES6 defined the basic data structure/collection types in JS as iterables. This includes:

  - strings
  - arrays
  - maps
    - Maps have a different default iteration than seen here, in that the iteration is not just over the map's **values** but instead its **entries**. An entry is a **tuple** (2-element array) **including both a key and a value.**
  - sets
  - ... and others.

- For the most part, all built-in iterables in JS have three iterator forms available:
  - keys-only (`keys()`)
  - values-only (`values()`)
  - entries (`entries()`)

> **NOTE** 📒 The chapter talk about **consuming iterators** -> **iterating over iterables**
>
> - The iteration-consumption protocol expects an _iterable_
>   the reason we can provide a direct _iterator_ is that **an iterator is just an iterable of itself!**
> - When creating an iterator instance from an existing iterator, the iterator itself is returned.

## Closure

- 💁🏻‍♂️ Closure is when a function remembers and continues to access variables from outside its scope, even when the function is executed in a different scope.
- 👉🏼 Closure is part of the nature of a function. Objects don't get closures, functions do.
- 👉🏼 **To observe a closure, you must execute a function in a different scope than where that function was originally defined.**

#### Examples

```
function greeting(msg) {
    return function who(name) {
        console.log(`${ msg }, ${ name }!`);
    };
}

var hello = greeting("Hello");
var howdy = greeting("Howdy");

hello("Kyle");
// Hello, Kyle!

hello("Sarah");
// Hello, Sarah!

howdy("Grant");
// Howdy, Grant!
```

- When the `greeting(..)` function finishes running, normally we would expect all of its variables to be garbage collected (removed from memory).
  We'd expect each msg to go away, **but they don't.** 👉🏼 **The reason is closure!**
- ⭐️⭐️ Since the **inner function instances are still alive** (assigned to hello and howdy, respectively), their closures are still preserving the msg variables.

#### Use case (?)

```jsfunction counter(step = 1) {
    var count = 0;
    return function increaseCount(){
        count = count + step;
        return count;
    };
}

var incBy1 = counter(1);
var incBy3 = counter(3);

incBy1();       // 1
incBy1();       // 2

incBy3();       // 3
incBy3();       // 6
incBy3();       // 9
```

👆🏼 Since closure is over the variables and not just snapshots of the values, these updates are preserved!! 🤩

- ⭐️ Closure is most common when working with **asynchronous** code, such as with callbacks.

```js
function getSomeData(url) {
  ajax(url, function onResponse(resp) {
    console.log(`Response (from ${url}): ${resp}`);
  });
}

getSomeData("https://some.url/wherever");
// Response (from https://some.url/wherever): ...
```

👆🏼 The inner function `onResponse(..)` is closed over url, and thus preserves and remembers it until the Ajax call returns and executes `onResponse(..)`. Even though `getSomeData(..)` finishes right away, the url parameter variable is kept alive in the closure for as long as needed.

💁🏻‍♂️ It's not necessary that the **outer scope be a function**—it usually is, but not always—j**ust that there be at least one variable in an outer scope accessed from an inner function**, for example:

```js
for (let [idx, btn] of buttons.entries()) {
  btn.addEventListener("click", function onClick() {
    console.log(`Clicked on button (${idx})!`);
  });
}
```

👆🏼 Because this loop is using `let` declarations, each iteration gets new **block-scoped** (aka, local) idx and btn variables; the loop also creates a new inner `onClick(..)` function each time. That inner function closes over idx, **preserving it for as long as the click handler is set on the btn.** So when each button is clicked, its handler can print its associated index value, **because the handler remembers its respective idx variable.**

✅ Remember: this closure is not over the value (like 1 or 3), but **over the variable idx itself**. (❓like key)

## `this` keyword

- 💁🏻‍♂️ When a function is defined, it is attached to its enclosing scope via closure.
- 💁🏻‍♂️ **Scope is the set of rules that controls how references to variables are resolved.**
- 🪄 But functions also have another characteristic besides their scope that influences what they can access 👉🏼 This characteristic is best described as an **execution context**, and it's exposed to the function via its `this` keyword.

---

⭐️⭐️

- **Scope** is _static_ and contains a fixed set of variables available **at the moment and location you define a function**
- A function's **Execution Context** is _dynamic_, **entirely dependent on how it is called** (regardless of where it is defined or even called from).
  - One way to think about the execution context is that it's a **tangible** object _whose properties are made available to a function while it executes._
  - Compare that to scope, which can also be thought of as an _object_;
    - (except, the scope object is hidden inside the JS engine, it's always the same for that function, and its properties take the form of identifier variables available inside the function.)

---

#### Explain w examples

```js
function classroom(teacher) {
  return function study() {
    console.log(`${teacher} says to study ${this.topic}`);
  };
}
var assignment = classroom("Kyle");
```

👆🏼 the inner `study()` function does reference `this`, which makes it a **`this`-aware function**. ⭐️ In other words, \*it's a function that is dependent on its **execution context.\***

```js
assignment();
// Kyle says to study undefined  -- Oops :(
```

👆🏼 context-aware functions that are called without any context specified **default the context to the `global` object** (window in the browser). As there is no global variable named `topic` (and thus no such property on the global object), `this.topic` resolves to `undefined`.

```js
var homework = {
  topic: "JS",
  assignment: assignment,
};

homework.assignment();
// Kyle says to study JS
```

👆🏼 A copy of the `assignment` function reference is set as a property on the `homework` object, and then it's called as `homework.assignment()`. That means the `this` for that function call will be the homework object.

```js
var otherHomework = {
  topic: "Math",
};

assignment.call(otherHomework);
// Kyle says to study Math
```

👆🏼⭐️👉🏼 A third way to invoke a function is with the `call(..)` method, which takes an object (`otherHomework` here) to **use for setting the this reference for the function call.** The property reference this.topic resolves to "Math".

---

- The benefit of `this`-aware functions—and their dynamic context—is the **ability to more flexibly re-use a single function with data from different objects.**
- A function that closes over a scope can never reference a different scope or set of variables. But a function that has dynamic `this` context awareness can be quite helpful for certain tasks.

## Prototypes

- 👉🏼 Where `this` is a **characteristic of function execution,** a prototype is a characteristic of an **object**, and specifically resolution of a property access.
- Think about a prototype as a **linkage** between two objects
  - the linkage is hidden behind the scenes, though there are ways to expose and observe it.
  - This prototype linkage **occurs when an object is created; it's linked to another object that already exists.** -> a.k.a **prototype chain**

#### Explain w examples

```
var homework = {
    topic: "JS"
};
```

👆🏼 The `homework` object only has a single property on it: `topic`. ⭐️👉🏼 However, its default prototype linkage connects to the **Object.prototype object**, which has common built-in methods on it like `toString()` and `valueOf()`, among others.

```
homework.toString();    // [object Object]
```

`homework.toString()` works even though homework doesn't have a `toString()` method defined ⭐️👉🏼 the delegation invokes `Object.prototype.toString()` instead.

### Object Linkage

To define an object prototype linkage, you can create the object using the `Object.create(..)` utility:

```
var homework = {
    topic: "JS"
};

var otherHomework = Object.create(homework);

otherHomework.topic;   // "JS"
```

<img src="https://github.com/getify/You-Dont-Know-JS/raw/2nd-ed/get-started/images/fig4.png" alt="book" width="150"/>

👆🏼 Objects in a prototype chain

```
var a = Object.create(null)

a.toString() // TypeError: a.toString is not a function
```

👆🏼 `Object.create(null)` creates an object that is ⭐️👉🏼 **not prototype linked anywhere**, so it's purely just a **standalone object;** in some circumstances, that may be preferable.

```jshomework.topic;
// "JS"

otherHomework.topic;
// "JS"

otherHomework.topic = "Math";
otherHomework.topic;
// "Math"

homework.topic;
// "JS" -- not "Math"
```

<img src="https://github.com/getify/You-Dont-Know-JS/raw/2nd-ed/get-started/images/fig5.png" alt="book" width="150"/>

👆🏼 Shadowed property 'topic': The topic on `otherHomework` is "shadowing" the property of the same name on the `homework` object in the chain.

### ⭐️ `this` Revisited

```
var homework = {
    study() {
        console.log(`Please study ${ this.topic }`);
    }
};

var jsHomework = Object.create(homework);
jsHomework.topic = "JS";
jsHomework.study();
// Please study JS

var mathHomework = Object.create(homework);
mathHomework.topic = "Math";
mathHomework.study();
// Please study Math
```

<img src="https://github.com/getify/You-Dont-Know-JS/raw/2nd-ed/get-started/images/fig6.png" alt="book" width="300"/>

👆🏼 Two objects linked to a common parent
