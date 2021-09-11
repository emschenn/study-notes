<h1 style="text-align:center">The Module Pattern 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch7.md)

- [Encapsulation and Least Exposure (POLE)](#encapsulation-and-least-exposure-pole)
- [What Is a Module?](#what-is-a-module)
  - [Namespaces (Stateless Grouping)](#namespaces-stateless-grouping)
  - [Data Structures (Stateful Grouping)](#data-structures-stateful-grouping)
  - [Modules (Stateful Access Control)](#modules-stateful-access-control)
    - [How does the classic module format work?](#how-does-the-classic-module-format-work)
    - [Module Factory (Multiple Instances)](#module-factory-multiple-instances)
    - [⭐️ Classic Module Definition](#️-classic-module-definition)
- [Node CommonJS Modules](#node-commonjs-modules)
- [Modern ES Modules (ESM)](#modern-es-modules-esm)
  - [Compare with CommonJS](#compare-with-commonjs)

## Encapsulation and Least Exposure (POLE)

- **Encapsulation** （封裝）
  - Often cited as a principle of object-oriented (OO) programming.
  - The **goal** of encapsulation is the **bundling or co-location of information (data) and behavior (functions) that together serve a common purpose.**
  - The **spirit** of encapsulation can be realized in something as simple as **using separate files to hold bits of the overall program with common purpose**.
    - Example: If we bundle everything that powers a list of search results into a single file called `"search-list.js"`, we're encapsulating that part of the program.
- Least Exposure (POLE)
  - Seeks to defensively guard against various dangers of scope over-exposure (affect both variables and functions)
  - In JS, we most often implement visibility control through the mechanics of lexical scope.

💡 The idea (of module) is to

- **group alike program bits together**, and
- **selectively limit programmatic access to the parts we consider private details**.

👍🏼 better code organization 👍🏼 easier to maintain quality

## What Is a Module?

⭐️ ⭐️ ⭐️ A module is a **collection of related data and functions** (often referred to as methods in this context), **characterized by a division between hidden private details and public accessible details,** usually called the "public API."

A module is also **stateful**: it maintains some information over time, along with functionality to access and update that information.

### Namespaces (Stateless Grouping)

Group a set of related functions together, **without data,** then you don't really have the expected encapsulation a module implies 👉🏼 better term for this grouping of stateless functions is a **namespace**:

```js
// namespace, not module
var Utils = {
  cancelEvt(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
  },
  wait(ms) {
    return new Promise(function c(res) {
      setTimeout(res, ms);
    });
  },
  isValidEmail(email) {
    return /[^@]+@[^@.]+\.[^@.]+/.test(email);
  },
};
```

👆🏼 `Utils` here is a useful collection of utilities, yet they're all **state-independent** functions.

### Data Structures (Stateful Grouping)

Even if you bundle data and stateful functions together, if you're **not limiting the visibility** of any of it 👉🏼 best to label this an instance of a **data structure**.

```js
// data structure, not module
var Student = {
  records: [
    { id: 14, name: "Kyle", grade: 86 },
    { id: 73, name: "Suzy", grade: 87 },
    { id: 112, name: "Frank", grade: 75 },
    { id: 6, name: "Sarah", grade: 91 },
  ],
  getName(studentID) {
    var student = this.records.find((student) => student.id == studentID);
    return student.name;
  },
};

Student.getName(73);
// Suzy
```

👆🏼 Since `records` is publicly accessible data, not **hidden behind** a public API, `Student` here isn't really a module.

### Modules (Stateful Access Control)

```js
var Student = (function defineStudent() {
  var records = [
    { id: 14, name: "Kyle", grade: 86 },
    { id: 73, name: "Suzy", grade: 87 },
    { id: 112, name: "Frank", grade: 75 },
    { id: 6, name: "Sarah", grade: 91 },
  ];

  var publicAPI = {
    getName,
  };

  return publicAPI;

  // ************************

  function getName(studentID) {
    var student = records.find((student) => student.id == studentID);
    return student.name;
  }
})();

Student.getName(73); // Suzy
```

👆🏼 `Student` is now an instance of a module. It features a public API with a single method: `getName(..)`. This method is able to **access the private hidden `records` data.**

> **NOTE:** This code above is just for illustrative purposes. A typical module in your program will **receive this data from an outside source,** typically loaded from databases, JSON data files, Ajax calls, etc. The data is then injected into the module instance typically through method(s) on the module's public API.

#### How does the classic module format work?

- The instance of the module is created by the `defineStudent()` **IIFE** being executed.
  - This IIFE returns an object (named `publicAPI`) that has a property on it referencing the inner `getName(..)` function.
- From the outside, `Student.getName(..)` invokes this exposed inner function, which maintains access to the inner records variable via **closure**.

---

- Defining variables and functions inside your outer module definition function makes everything **by default private.**
  - Only properties added to the public API object returned from the function will be exported for external public use.
- ⭐️ The use of an **IIFE** implies that our program **only ever needs a single central instance of the module,** commonly referred to as a "**singleton**."
  - But if we did want to define a module that supported multiple instances in our program....(👀 below)

#### Module Factory (Multiple Instances)

```js
// factory function, not singleton IIFE
function defineStudent() {
  var records = [
    { id: 14, name: "Kyle", grade: 86 },
    { id: 73, name: "Suzy", grade: 87 },
    { id: 112, name: "Frank", grade: 75 },
    { id: 6, name: "Sarah", grade: 91 },
  ];

  var publicAPI = {
    getName,
  };

  return publicAPI;

  // ************************

  function getName(studentID) {
    var student = records.find((student) => student.id == studentID);
    return student.name;
  }
}

var fullTime = defineStudent();
fullTime.getName(73); // Suzy
```

👆🏼 Rather than specifying `defineStudent()` as an **IIFE**, we just define it as a normal standalone function, which is commonly referred to in this context as a **"module factory"** function.

#### ⭐️ Classic Module Definition

So to clarify what makes something a classic module:

- There must be an outer scope, typically from a module factory function running at least once.
- The module's inner scope must have at least one piece of **hidden information** that represents state for the module.
- The module must return on its **public API a reference to at least one function that has closure over the hidden module state** (so that this state is actually preserved).

## Node CommonJS Modules

Unlike the classic module format described earlier, where you could bundle the module factory or IIFE alongside any other code including other modules, **CommonJS modules are file-based; one module per file.**

```js
module.exports.getName = getName;

// ************************

var records = [
  { id: 14, name: "Kyle", grade: 86 },
  { id: 73, name: "Suzy", grade: 87 },
  { id: 112, name: "Frank", grade: 75 },
  { id: 6, name: "Sarah", grade: 91 },
];

function getName(studentID) {
  var student = records.find((student) => student.id == studentID);
  return student.name;
}
```

👆🏼 The `records` and `getName` identifiers are in the top-level scope of this module, but that's **not the global scope**. As such, everything here is **by default private to the module**.

- To expose something on the public API of a CommonJS module, you add a property to the empty object provided as `module.exports`.
- In some older legacy code, you may run across references to just a bare exports, but for code clarity you should always fully qualify that reference with the `module.` prefix.

Some developers have the habit of replacing the default exports object, like this:

```js
// defining a new object for the API
module.exports = {
  // ..exports..
};
```

👆🏼 But this may cause unexpected behavior e.g., if multiple such modules circularly depend on each other.

👇🏼 If you want to **assign multiple `exports` at once**, using object literal style definition, you can do this instead:

```js
Object.assign(module.exports, {
  // .. exports ..
});
```

👆🏼 `Object.assign(..)` is performing a **shallow copy of all those properties onto the existing `module.exports` object,** instead of replacing it!

---

To include another module instance into your module/program, use Node's `require(..)` method:

```js
var Student = require("/path/to/student.js");

Student.getName(73);
// Suzy
```

CommonJS modules behave as **singleton instances,** similar to the IIFE module definition style presented before.

i.e., 💁🏻‍♂️ No matter how many times you `require(..)` the same module, you just get additional references to the single shared module instance.

`require(..)` is an **all-or-nothing mechanism**; it includes a reference of the entire exposed public API of the module. To effectively access only part of the API, the typical approach looks like this:

```js
var getName = require("/path/to/student.js").getName;

// or alternately:

var { getName } = require("/path/to/student.js");
```

## Modern ES Modules (ESM)

ESM is file-based, and module instances are singletons, with everything private by default _(same as CommonJS format)_

One notable difference is that ESM files are **assumed to be strict-mode,** without needing a `"use strict"` pragma at the top. **There's no way to define an ESM as non-strict-mode.**

#### Compare with CommonJS

| CommonJS         | ESM                   |
| ---------------- | --------------------- |
| `module.exports` | `export`              |
| `require(..)`    | `import`              |
|                  | always `"use strict"` |

```js
export { getName };

// ************************

var records = [
  { id: 14, name: "Kyle", grade: 86 },
  { id: 73, name: "Suzy", grade: 87 },
  { id: 112, name: "Frank", grade: 75 },
  { id: 6, name: "Sarah", grade: 91 },
];

function getName(studentID) {
  var student = records.find((student) => student.id == studentID);
  return student.name;
}
```

---

- **Named export**

```js
export function getName(studentID) {
  // ..
}
```

👆🏼 Even though `export` appears before the `function` keyword here, this form is still a `function` declaration that also happens to be exported. That is, the `getName` identifier is **_function hoisted_** (see [Chapter 5](./ch5.md)), so it's available throughout the whole scope of the module.

- **Default export**

```js
export default function getName(studentID) {
  // ..
}
```

👆🏼 "default export" is a shorthand for consumers of the module when they `import`, **giving them a terser syntax when they only need this single default API member.**

---

- **Named import**

```js
import { getName } from "/path/to/students.js";

getName(73); // Suzy
```

- **Default import**

```js
import getName from "/path/to/students.js";

getName(73); // Suzy
```

- **Mixed import**

```js
import { default as getName /* .. others .. */ } from "/path/to/students.js";

getName(73); // Suzy
```

- **Namespaced import**

```js
import * as Student from "/path/to/students.js";

Student.getName(73); // Suzy
```

👆🏼 the `*` imports **everything** exported to the API, default and named, and stores it **all under the single namespace identifier as specified.**

> **💡 NOTES** <br/>As of the time of this writing, **modern browsers have supported ESM** for a few years now, **but Node's stable'ish support for ESM is fairly recent**, and has been evolving for quite a while.<br/>The introduction of ESM to JS back in ES6 created a number of challenging compatibility concerns for Node's interop with CommonJS modules.<br/><br/>👀
> Consult Node's ESM documentation for all the latest details: https://nodejs.org/api/esm.html
