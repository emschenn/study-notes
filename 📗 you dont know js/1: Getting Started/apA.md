<h1 style="text-align:center">Exploring Further 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/apA.md)

- [Values vs. References](#values-vs-references)
  - [`primitive`: value copies](#primitive-value-copies)
  - [`object`: refrence copy](#object-refrence-copy)
- [So Many Function Forms](#so-many-function-forms)
  - [Arrow Function](#arrow-function)
- [Coercive Conditional Comparison](#coercive-conditional-comparison)
- [Prototypal "Classes"](#prototypal-classes)

## Values vs. References

### `primitive`: value copies

```
var myName = "Kyle";

var yourName = myName;

myName = "Frank";

console.log(myName);
// Frank

console.log(yourName);
// Kyle
```

👆🏼 the `yourName` variable has a separate copy of the `"Kyle"` string from the value that's stored in `myName`. **That's because the value is a primitive, and primitive values are always assigned/passed as _value copies_.**

⭐️⭐️⭐️ In JS, only object values (arrays, objects, functions, etc.) are treated as references.

### `object`: refrence copy

```
var myAddress = {
    street: "123 JS Blvd",
    city: "Austin",
    state: "TX"
};

var yourAddress = myAddress;

// I've got to move to a new house!
myAddress.street = "456 TS Ave";

console.log(yourAddress.street);
// 456 TS Ave
```

👆🏼 the value assigned to `myAddress` is an object, it's held/assigned by reference, and thus the assignment to the `yourAddress` variable is a **copy of the reference, not the object value itself.**

#### ⭐️⭐️⭐️ Primitives are held by value, objects are held by reference. There's no way to override this in JS!

## So Many Function Forms

```js
var awesomeFunction = function (coolThings) {
  // ..
  return amazingStuff;
};
```

👆🏼 The function expression here is referred to as an **_anonymous_ function expression**, since it has **no name identifier** between the function keyword and the (..) parameter list.

...🤔 However, This point confuses many JS developers because as of ES6, JS performs a **"name inference"** on an anonymous function:

```
awesomeFunction.name;
// "awesomeFunction"
```

- ⭐️ The `name` property of a function will reveal either its **directly given name** (in the case of a declaration) or its **inferred name** in the case of an anonymous function expression.
- That value is generally used by developer tools when inspecting a function value or when reporting an error stack trace.
- ⭐️ `name` inference only happens in limited cases such as when the function expression is assigned (with =).

```
// let awesomeFunction = ..
// const awesomeFunction = ..
var awesomeFunction = function someName(coolThings) {
    // ..
    return amazingStuff;
};

awesomeFunction.name;
// "someName"
```

👆🏼 This function expression is a **named function expression**

⭐️ Notice also that the explicit function name, the identifier someName, takes precedence when assigning a name for the name property! **(someName > awesomeFunction)**

> **🗣 AUTHOR －**
> Should function expressions be named or anonymous...?
>
> - If a function exists in your program, it has a purpose; otherwise, take it out!
> - And if it has a purpose, it has a natural name that describes that purpose.

---

👇🏼 Here are some more declaration forms:

```
// generator function declaration
function *two() { .. }

// async function declaration
async function three() { .. }

// async generator function declaration
async function *four() { .. }

// named function export declaration (ES6 modules)
export function five() { .. }
```

👇🏼 Some more of the (many!) function expression forms:

```
// IIFE
(function(){ .. })();
(function namedIIFE(){ .. })();

// asynchronous IIFE
(async function(){ .. })();
(async function namedAIIFE(){ .. })();

// arrow function expressions
var f;
f = () => 42;
f = x => x * 2;
f = (x) => x * 2;
f = (x,y) => x * y;
f = x => ({ x: x * 2 });
f = x => { return x * 2; };
f = async x => {
    var y = await doSomethingAsync(x);
    return y * 2;
};
someOperation( x => x * 2 );
// ..
```

---

### Arrow Function

- ⭐️ Keep in mind that **arrow function expressions** are **_syntactically anonymous_**

  - meaning the syntax doesn't provide a way to provide a direct name identifier for the function.
  - The function expression may get an inferred name, but only if it's one of the assignment forms, not in the (more common!) form of being passed as a function call argument (as in the last line of the snippet). -> (e.g., use in `Array.map(()=>...))`)

- ⭐️ This kind of function actually has a **specific purpose (i.e., handling the this keyword lexically)**, but that doesn't mean we should use it for every function we write.

```
class SomethingKindaGreat {
    // class methods
    coolMethod() { .. }   // no commas!
    boringMethod() { .. }
}

var EntirelyDifferent = {
    // object methods
    coolMethod() { .. },   // commas!
    boringMethod() { .. },

    // (anonymous) function expression property
    oldSchool: function() { .. }
};
```

## Coercive Conditional Comparison

```
var x = 1;

if (x) {
    // will run!
}

while (x) {
    // will run, once!
    x = false;
}
```

is like 👆🏼👇🏼

```
var x = 1;

if (x == true) {
    // will run!
}

while (x == true) {
    // will run, once!
    x = false;
}
```

In this specific case -- the value of `x` being `1` -- that mental model works, but it's not accurate more broadly. Consider:

```
var x = "hello";

if (x) {
    // will run!
}

⭐️ if (x == true) {
    // won't run :(
}
```

so what is the `if` statement actually doing? This is the more accurate mental model:

```
if (x) {
    // will run!
}
```

👆🏼👇🏼

```
var x = "hello";

if (Boolean(x) == true) {
    // will run
}

// which is the same as:

if (Boolean(x) === true) {
    // will run
}
```

## Prototypal "Classes"

```
var Classroom = {
    welcome() {
        console.log("Welcome, students!");
    }
};

var mathClass = Object.create(Classroom);

mathClass.welcome();
// Welcome, students!
```

The prototypal class pattern would have labeled this delegation behavior **"inheritance,"** and alternatively have defined it (with the same behavior) as: 👆🏼👇🏼

```
function Classroom() {
    // ..
}

Classroom.prototype.welcome = function hello() {
    console.log("Welcome, students!");
};

var mathClass = new Classroom();

mathClass.welcome();
// Welcome, students!
```

All functions by default reference an empty object at a property named `prototype`. Despite the confusing naming, this is **not** the function's _prototype_ (where the function is prototype linked to), but r**ather the prototype object to _link_ to when other objects are created by calling the function with `new`.**

This "prototypal class" pattern is now strongly discouraged, in favor of using ES6's class mechanism: 👆🏼👇🏼

```
class Classroom {
    constructor() {
        // ..
    }

    welcome() {
        console.log("Welcome, students!");
    }
}

var mathClass = new Classroom();

mathClass.welcome();
// Welcome, students!
```
