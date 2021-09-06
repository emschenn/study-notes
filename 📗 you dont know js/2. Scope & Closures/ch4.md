<h1 style="text-align:center">Around the Global Scope 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch4.md)

- [Why Global Scope?](#why-global-scope)
- [Where Exactly is this Global Scope?](#where-exactly-is-this-global-scope)
  - [Browser "Window"](#browser-window)
    - [Globals Shadowing Globals](#globals-shadowing-globals)
    - [DOM Globals](#dom-globals)
    - [What's in a (Window) Name?](#whats-in-a-window-name)
  - [Web Workers](#web-workers)
  - [Developer Tools Console/REPL](#developer-tools-consolerepl)
  - [ES Modules (ESM)](#es-modules-esm)
  - [Node](#node)
- [Global This](#global-this)

This chapter

1. Explores **how the global scope is** (still) **useful** and relevant to writing JS programs today.
2. Looks at differences in where and how to **access the global scope in different JS environments**.

## Why Global Scope?

🤔 How exactly do all those separate files get stitched together in a single runtime context by the JS engine?

With respect to browser-executed applications, there are three main ways:

1. **ES modules:** (not transpiling them into some other module-bundle format)

   - These files are loaded _individually_ by the JS environment.
   - 👉🏼 The separate module files cooperate with each other exclusively through these shared `imports`, **without needing any shared outer scope**

2. **Bundler** in build process:

   - All the files are typically concatenated together before delivery to the browser and JS engine, which then **only processes one big file**.
   - Even with all the pieces of the application co-located in a single file, some mechanism is necessary for each piece to _register a name_ to be referred to by other pieces, as well as some facility for that access to occur.
   - e.g.,

     ```js
     (function wrappingOuterScope() {
       var moduleOne = (function one() {
         // ..
       })();

       var moduleTwo = (function two() {
         // ..

         function callModuleOne() {
           moduleOne.someMethod();
         }

         // ..
       })();
     })();
     ```

     - 👆🏼 the entire contents of the file are wrapped in a single enclosing scope (such as a wrapper function, universal module [👀 apA](apA.md)), etc.
     - 👆🏼 Each piece can register itself for access from other pieces by way of local variables in that shared scope.
     - While the scope of `wrappingOuterScope()` is a function and not the full environment global scope, **it does act as a sort of "application-wide scope,"** a bucket where all the top-level identifiers can be stored, though not in the real global scope.

3. (whether a bundler tool is used for an application, or whether the (non-ES module) files are simply loaded in the browser individually (via `<script>` tags or other dynamic JS resource loading)), if there is **No single surrounding scope encompassing all these pieces:**

   - The global scope is the only way for them to cooperate with each other
   - e.g.,

     ```js
     var moduleOne = (function one() {
       // ..
     })();
     var moduleTwo = (function two() {
       // ..

       function callModuleOne() {
         moduleOne.someMethod();
       }

       // ..
     })();
     ```

     - 👆🏼 Here, since there is no surrounding function scope, these `moduleOne` and `moduleTwo` declarations are simply dropped into the global scope.
     - If these files are loaded separately as normal standalone `.js` files in a browser environment, each top-level variable declaration will end up as a global variable, **since the global scope is the only shared resource between these two separate files—they're independent programs, from the perspective of the JS engine.**

---

In addition to

- (potentially) Accounting for where an application's code resides during runtime
- How each piece is able to access the other pieces to cooperate

The global scope is also where:

- JS exposes its built-ins:

  - primitives: `undefined`, `null`, `Infinity`, `NaN`
  - natives: `Date()`, `Object()`, `String()`, etc.
  - global functions: `eval()`, `parseInt()`, etc.
  - namespaces: `Math`, `Atomics`, `JSON`
  - friends of JS: `Intl`, `WebAssembly`

- The environment hosting the JS engine exposes its own built-ins:

  - `console` (and its methods)
  - the DOM (`window`, `document`, etc)
  - timers (`setTimeout(..)`, etc)
  - web platform APIs: `navigator`, `history`, `geolocation`, `WebRTC`, etc

- Node also exposes several elements "globally," but they're **technically not in the global scope**:
  - `require()`, `__dirname`, `module`, `URL`, and so on.

## Where Exactly is this Global Scope?

Different JS environments handle the scopes of your programs, especially the global scope, differently.

### Browser "Window"

With respect to treatment of the global scope, the most **<span style="color:#dd2211">pure</span> environment** JS can be run in is as a **standalone `.js` file loaded in a web page environment in a browser.**

> 💡 **PURE** is not as in nothing automatically added—lots may be added!—but rather in terms of _minimal intrusion on the code or interference with its expected global scope behavior_.

```js
var studentName = "Kyle";

function hello() {
  console.log(`Hello, ${studentName}!`);
}

hello();
// Hello, Kyle!

window.hello();
// Hello, Kyle!
```

👆🏼 That's the **default behavior one would expect from a reading of the JS specification:** the outer scope is the global scope and `studentName` is legitimately created as global variable. _(that's <span style="color:#dd2211">pure</span>!)_

#### Globals Shadowing Globals

A global object property can be shadowed by a global variable:

```js
window.something = 42;

let something = "Kyle";

console.log(something);
// Kyle

console.log(window.something);
// 42
```

👆🏼 The `let` declaration adds a something global variable but not a global object property (see [Chapter 3](./ch3.md)). The effect then is that the **`something` lexical identifier shadows the `something` global object property.**

> **TAKEAWAYS** <br/>It's almost certainly a bad idea to create a divergence between the global object and the global scope. ⭐️⭐️⭐️ 👉🏼 **Always use `var` for globals. Reserve `let` and `const` for block scopes!**

#### DOM Globals

A DOM element with an `id` attribute automatically creates a global variable that references it:

```=html
<ul id="my-todo-list">
   <li id="first">Write a book</li>
   ..
</ul>
```

```js
first;
// <li id="first">..</li>

window["my-todo-list"];
// <ul id="my-todo-list">..</ul>
```

👆🏼 The auto-registration of all `id`-bearing DOM elements as global variables is an **old legacy browser behavior** that nevertheless must remain because so many old sites still rely on it

> **TAKEAWAYS**<br/> ⛔️ **never to use these global variables,** even though they will always be silently created!

#### What's in a (Window) Name?

`window.name` is a **pre-defined "global"** in a browser context;

```js
var name = 42;

console.log(name, typeof name);
// "42" string
```

- 👆🏼 We used `var` for our declaration, which **does not** shadow the pre-defined `name` global property.
  - i.e., `var` declaration is **ignored**, since there's already a global scope object property of that name.
- Even though we assigned the number `42` to `name` (and thus `window.name`), when we then retrieve its value, it's a string "42"! ⭐️👉🏼 because `name` is actually a **pre-defined getter/setter on the window object**, which insists on its value being a `string` value!

### Web Workers

Web Workers are a web platform extension on top of browser-JS behavior, which **allows a JS file to run in a completely separate thread** (operating system wise) from the thread that's running the main JS program.

- Since these Web Worker programs run on a separate thread,they're restricted in their communications with the main application thread, to avoid/limit race conditions and other complications.
- It does not have access to the `DOM`, for example.
  - Except some web APIs which are made available to the worker, such as `navigator`.

```js
var studentName = "Kyle";
let studentID = 42;

function hello() {
  console.log(`Hello, ${self.studentName}!`);
}

self.hello();
// Hello, Kyle!

self.studentID;
// undefined
```

👆🏼 In a Web Worker, the global object reference is typically made using `self`

The global scope behavior we're seeing here is about as pure as it gets for running JS programs _(perhaps it's even more pure since there's no DOM to muck things up!)_

### Developer Tools Console/REPL

In some cases, favoring DX when typing in short JS snippets, over the normal strict steps expected for processing a full JS program, **produces observable differences in code behavior between programs and tools.** For example,

- certain error conditions applicable to a JS program may be relaxed and not displayed when the code is entered into a developer tool.

With respect to our discussions here about scope, such observable differences in behavior may include:

- The behavior of the global scope
- Hoisting (see [Chapter 5](ch5.md))
- Block-scoping declarators (`let` / `const`, see [Chapter 6](ch6.md)) when used in the outermost scope

⭐️ Such tools typically emulate the global scope position to an extent; **it's emulation, not strict adherence.**

> **TAKEAWAYS** <br/>Developer Tools, while optimized to be convenient and useful for a variety of developer activities, are **_not suitable environments to determine or verify explicit and nuanced behaviors of an actual JS program context_**.

### ES Modules (ESM)

One of the most obvious impacts of using ESM is how it changes the **behavior of the observably top-level scope** in a file.

```js
var studentName = "Kyle";

function hello() {
    console.log(`Hello, ${ studentName }!`);
}

hello();
// Hello, Kyle!

export hello;
```

- 👆🏼 Despite being declared at the top level of the (module) file, in the outermost obvious scope, `studentName` and `hello` are **not global variables**. Instead, they are module-wide, or **"module-global."**
- However, in a module there's no implicit "module-wide scope object" for these top-level declarations to be added to as properties, as there is when declarations appear in the top-level of non-module JS files.
  - i.e., **global variables don't get created by declaring variables in the top-level scope of a module.**
- ESM encourages a minimization of reliance on the global scope, where you import whatever modules you may need for the current module to operate.
  - As such, you less often see usage of the global scope or its global object.

### Node

Node treats every single `.js` file that it loads, including the main one you start the Node process with, as a **module** (ES module or CommonJS module, see [Chapter 8](ch8.md)).
👉🏼 The practical effect is that the top level of your Node programs is **never actually the global scope**

```js
var studentName = "Kyle";

function hello() {
  console.log(`Hello, ${studentName}!`);
}

hello();
// Hello, Kyle!

module.exports.hello = hello;
```

👆🏼👇🏼 Envision the preceding code as being seen by Node as this (illustrative, not actual):

```js
function Module(module,require,__dirname,...) {
    var studentName = "Kyle";

    function hello() {
        console.log(`Hello, ${ studentName }!`);
    }

    hello();
    // Hello, Kyle!

    module.exports.hello = hello;
}
```

- 👆🏼 `studentName` and `hello` identifiers are not global, but rather declared in the module scope.
- Node defines a number of "globals" like `require()`, but they're not actually identifiers in the global scope (nor properties of the global object).
  - They're injected in the scope of every module, essentially a bit like the parameters listed in the `Module(..)` function declaration.

So how do you define actual global variables in Node?

- The only way to do: Add properties to another of **Node's automatically provided "globals,"** which is ironically called `global`.
- `global` is a reference to the real global scope object, somewhat like using `window` in a browser JS environment.

```js
global.studentName = "Kyle";

function hello() {
  console.log(`Hello, ${studentName}!`);
}

hello();
// Hello, Kyle!

module.exports.hello = hello;
```

⭐️ Remember, the identifier `global` is not defined by JS; it's specifically defined by **Node**.

## Global This

Reviewing the JS environments we've looked at so far, a program may or may not:

- Declare a global variable in the top-level scope with var or function declarations—or `let`, `const`, and `class`.
- Also add global variables declarations as properties of the global scope object if `var` or `function` are used for the declaration.
- Refer to the global scope object (for adding or retrieving global variables, as properties) with `window`, `self`, or `global`.

1️⃣ Another "trick" for obtaining a reference to the global scope object looks like:

```js
const theGlobalScopeObject = new Function("return this")();
```

> **ABOUT THE SYNTAX** <br/>A function can be dynamically constructed from code stored in a string value with the `Function()` constructor, similar to `eval(..)` (see "Cheating: Runtime Scope Modifications" in [ch1](./ch1.md)). <br/> Such a function will automatically be run in non-strict-mode (for legacy reasons) when invoked with the normal () function invocation as shown; its `this` will point at the global object.

2️⃣ As of ES2020, JS has finally defined a standardized reference to the global scope object, called `globalThis`

We could even attempt to define a cross-environment polyfill that's safer across pre-`globalThis` JS environments, such as:

```js
const theGlobalScopeObject =
  typeof globalThis != "undefined"
    ? globalThis
    : typeof global != "undefined"
    ? global
    : typeof window != "undefined"
    ? window
    : typeof self != "undefined"
    ? self
    : new Function("return this")();
```

👆🏼 Not ideal, but it works if you find yourself needing a reliable global scope reference.
