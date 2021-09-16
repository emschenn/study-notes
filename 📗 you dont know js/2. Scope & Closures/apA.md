<h1 style="text-align:center">Exploring Further 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/apA.md)

- [Implied Scopes](#implied-scopes)
  - [Parameter Scope](#parameter-scope)
  - [Function Name Scope](#function-name-scope)
- [Anonymous vs. Named Functions](#anonymous-vs-named-functions)
  - [Explicit or Inferred Names?](#explicit-or-inferred-names)
  - [Why named?](#why-named)
  - [Explicit named a function](#explicit-named-a-function)
  - [Inferred Names](#inferred-names)
  - [Arrow Functions](#arrow-functions)
  - [IIFE Variations](#iife-variations)
- [Hoisting: Functions and Variables](#hoisting-functions-and-variables)
  - [Function Hoisting](#function-hoisting)
  - [Variable Hoisting](#variable-hoisting)
- [The Case for `var`](#the-case-for-var)
  - [`const`-antly Confused](#const-antly-confused)
  - [`var` and `let`](#var-and-let)
- [TDZ Origin story](#tdz-origin-story)
  - [Why TDZ of `let`](#why-tdz-of-let)
- [Are Synchronous Callbacks Still Closures?](#are-synchronous-callbacks-still-closures)
  - [What is a Callback?](#what-is-a-callback)
  - [Synchronous Closure?](#synchronous-closure)
- [Classic Module Variations](#classic-module-variations)
  - [Where's My API?](#wheres-my-api)
  - [Asynchronous Module Defintion (AMD)](#asynchronous-module-defintion-amd)
  - [Universal Modules (UMD)](#universal-modules-umd)

## Implied Scopes

In practice, these implied scopes don't often impact your program behavior, but it's still useful to know they're happening:

### Parameter Scope

- **_"simple" parameter_ case**

```js
// outer/global scope: RED(1)

function getStudentName(studentID) {
  // function scope: BLUE(2)
  // ..
}
```

- **_"non-simple" parameter_ case**

```js
// outer/global scope: RED(1)

function getStudentName(/*BLUE(2)*/ studentID = 0) {
  // function scope: GREEN(3)
  // ..
}
```

👆🏼 Parameter forms considered non-simple include parameters with default values, rest parameters (using `...`), and destructured parameters.

#### Why? What difference does it make?

💁🏻‍♂️ The non-simple parameter forms introduce various corner cases, so the parameter list becomes its own scope to more effectively deal with them.

Consider:

```js
function getStudentName(studentID = maxID, maxID) {
  // ..
  // ❌ TDZ ERROR!
}
```

👆🏼 The reason is that `maxID` is declared in the parameter scope, but it's not yet been initialized because of the order of parameters.

```js
function getStudentName(maxID, studentID = maxID) {
  // ..
  // 👌🏼
}
```

---

```js
function whatsTheDealHere(id, defaultID = () => id) {
  id = 5;
  console.log(defaultID());
}

whatsTheDealHere(3);
// 5
```

👆🏼 The snippet probably makes sense, because the `defaultID()` arrow function closes over the `id` parameter/variable, which we then re-assign to `5`.

```js
function whatsTheDealHere(id, defaultID = () => id) {
  var id = 5;
  console.log(defaultID());
}

whatsTheDealHere(3);
// 3
```

👆🏼 The `var id = 5` is shadowing the id parameter, but the closure of the `defaultID()` function is over the parameter, not the shadowing variable in the function body. 🪄👉🏼 **This proves there's a scope bubble around the parameter list.**

```js
function whatsTheDealHere(id, defaultID = () => id) {
  var id;

  console.log(`local variable 'id': ${id}`);
  console.log(`parameter 'id' (closure): ${defaultID()}`);

  console.log("reassigning 'id' to 5");
  id = 5;

  console.log(`local variable 'id': ${id}`);
  console.log(`parameter 'id' (closure): ${defaultID()}`);
}

whatsTheDealHere(3);
// local variable 'id': 3   <--- Huh!? Weird!
// parameter 'id' (closure): 3
// reassigning 'id' to 5
// local variable 'id': 5
// parameter 'id' (closure): 3
```

👆🏼

- ⭐️ In this specific corner case (for legacy compat reasons), JS doesn't auto-initialize `id` to `undefined`, but rather to the value of the `id` parameter (`3`)!
- Though the two `id`s look at that moment like they're one variable, they're actually still separate (and in separate scopes).
  - The `id = 5` assignment makes the divergence observable, where the `id` parameter stays `3` and the local variable becomes `5`.

> **⭐️ ⭐️ ⭐️ Author advice**
>
> - Never shadow parameters with local variables
> - Avoid using a default parameter function that closes over any of the parameters

### Function Name Scope

```js
var askQuestion = function ofTheTeacher() {
  // ..
};
```

👆🏼

- It's true that `ofTheTeacher` is not added to the enclosing scope (where `askQuestion` is declared), but it's also not _just_ added to the scope of the function!
- ⭐️ ⭐️ ⭐️ The **name identifier** of a function expression is **in its own implied scope**, nested between the outer enclosing scope and the main inner function scope.
  - If `ofTheTeacher` was in the function's scope, we'd expect an error here:
    ```js
    var askQuestion = function ofTheTeacher() {
      // why is this not a duplicate declaration error?
      let ofTheTeacher = "Confused, yet?";
    };
    ```
  - This is perfectly legal shadowing, not re-declaration, 💁🏻‍♂️ Because the two `ofTheTeacher` identifiers are in **separate** scopes.

> **⭐️ ⭐️ Author advice**
>
> - Never shadow function name identifiers.

## Anonymous vs. Named Functions

### Explicit or Inferred Names?

**Every** function in your program has a purpose.

If it **doesn't** have a purpose -> take it out, because you're just wasting space.<br/>
If it **does** have a purpose -> there is a **name** for that purpose.

### Why named?

- **"anonymous"** showing up in stack traces is just **not all that helpful to debugging**:

  ```js
  btn.addEventListener("click", function () {
    setTimeout(function () {
      ["a", 42].map(function (v) {
        console.log(v.toUpperCase());
      });
    }, 100);
  });
  // Uncaught TypeError: v.toUpperCase is not a function
  //   👎🏼  at myProgram.js:4
  //     at Array.map (<anonymous>)
  //   👎🏼  at myProgram.js:3
  ```

  v.s.

  ```js
  btn.addEventListener("click", function onClick() {
    setTimeout(function waitAMoment() {
      ["a", 42].map(function allUpper(v) {
        console.log(v.toUpperCase());
      });
    }, 100);
  });
  // Uncaught TypeError: v.toUpperCase is not a function
  //   👍🏼  at allUpper (myProgram.js:4)
  //     at Array.map (<anonymous>)
  //   👍🏼  at waitAMoment (myProgram.js:3)
  ```

- Without a lexical name identifier, the function has **no internal way to refer to itself.** Self-reference is important for things like recursion and event handling

  ```js
  // broken
  runOperation(function (num) {
    if (num <= 1) return 1;
    return num * oopsNoNameToCall(num - 1);
  });

  // also broken
  btn.addEventListener("click", function () {
    console.log("should only respond to one click!");
    btn.removeEventListener("click", oopsNoNameHere);
  });
  ```

  👆🏼 **Leaving off the lexical name from your callback makes it harder to reliably self-reference the function.** (🪄You _could_ declare a variable in an enclosing scope that references the function, but this variable is controlled by that enclosing scope—**it could be re-assigned,** etc.—so it's **not as reliable** as the function having its own internal self-reference.)

- **Names are Descriptors**

  e.g.,

  ```js
  👎🏼
  [1, 2, 3, 4, 5].filter(function (v) {
    return v % 2 == 1;
  });
  // [ 1, 3, 5 ]

  👍🏼
  [1, 2, 3, 4, 5].filter(function keepOnlyOdds(v) {
    return v % 2 == 1;
  });
  // [ 1, 3, 5 ]
  ```

  ⭐️ ⭐️ ⭐️ No matter the length or complexity of the function, the author should **figure out a good descriptive name and add it to the code.** Even the one-liner functions in `map(..)` and `then(..)` statements should be named:

  ```js
  lookupTheRecords(someData)
    .then(function extractSalesRecords(resp) {
      return resp.allSales;
    })
    .then(storeRecords);
  ```

  > **AUTHOR DEVICE:**
  >
  > - If you can't figure out a good name, you likely don't understand the function and its purpose yet -> The function is perhaps **poorly designed**, or it **does too many things**, and **should be re-worked**.
  > - If you don't fully understand its purpose and can't think of a good name to use, just use `TODO` as the name and fix it when refactoring!

### Explicit named a function

```js
function thisIsNamed() {
    // ..
}

ajax("some.url",function thisIsAlsoNamed(){
   // ..
});

⭐️ var notNamed = function(){
    // ..
};

makeRequest({
    data: 42,
    ⭐️ cb /* also not a name */: function(){
        // ..
    }
});

⭐️ var stillNotNamed = function butThisIs(){
    // ..
};
```

Even though ...

```js
var notNamed = function () {
  // ..
};

var config = {
  cb: function () {
    // ..
  },
};

notNamed.name;
// notNamed

config.cb.name;
// cb
```

👆🏼 These are **referred to as inferred names**. Inferred names are fine, but they don't really address the full concern I'm discussing. _Not Explicit Name!_

### Inferred Names

```js
function ajax(url, cb) {
  console.log(cb.name);
}

ajax("some.url", function () {
  // ..
});
// ""
```

👆🏼 **Anonymous function expressions passed as callbacks are incapable of receiving an inferred name**, so `cb.name` holds just the empty string `""`.

```js
var config = {};

config.cb = function () {
  // ..
};

config.cb.name;
// ""

var [noName] = [function () {}];
noName.name;
// ""
```

👆🏼 **Any assignment of a function expression** that's not a simple assignment will also **fail name inferencing**.

💁🏻‍♂️ Even if a `function` expression does get an inferred name, that still doesn't count as being a full named function.

### Arrow Functions

- Arrow functions are **always anonymous**, even if (rarely) they're used in a way that gives them an inferred name.
  - Don't use them as a general replacement for regular functions.
- Arrow functions **purpose** 👉🏼 **lexical this behavior**!
  - Briefly: arrow functions don't define a `this` identifier keyword at all.
  - If you use a `this` inside an arrow function, it behaves exactly as any other variable reference, **which is that the scope chain is consulted to find a function scope (non-arrow function) where it is defined, and to use that one.**
  - In other words, arrow functions treat `this` like **any other lexical variable.**
- ⭐️ If you're used to hacks like `var self = this`, or if you prefer to call `.bind(this)` on inner `function` expressions, just to force them to inherit a `this` from an outer function like it was a lexical variable, then `=>` arrow functions are absolutely the better option.
  - They're designed _specifically_ to fix that problem!

(...more detail in others book)

### IIFE Variations

should have names as well!

```js
👎🏼
(function(){
    // don't do this!
})();

👍🏼
(function doThisInstead(){
    // ..
})();
```

```js
var getStudents = (function StoreStudentRecords() {
  var studentRecords = [];

  return function getStudents() {
    // ..
  };
})();
```

👆🏼

- **IIFEs** are typically **defined by placing `( .. )` around the function expression**, as shown in those previous snippets.
  - But that's not the only way to define an IIFE!
- Technically, the only reason we're using that first surrounding set of `( .. )` is just **so the function keyword isn't in a position to qualify as a function declaration to the JS parser.**
  - But there are other syntactic ways to avoid being parsed as a declaration:

```js
!function thisIsAnIIFE(){
    // ..
}();

+function soIsThisOne(){
    // ..
}();

~function andThisOneToo(){
    // ..
}();

👍🏼
void function yepItsAnIIFE() {
    // The benefit of void is, it clearly communicates at the beginning of the function that this IIFE won't be returning any value.
}();
```

👆🏼 The `!`, `+`, `~`, and several other **unary operators** (operators with one operand) can all be placed in front of function to **turn it into an expression**. **Then the final `()` call is valid, which makes it an IIFE!** 🪄

## Hoisting: Functions and Variables

The section explore why both these forms of hoisting can be **beneficial** and should still be considered.

Give hoisting a deeper level of consideration by considering the merits(優點) of:

- Executable code first, function declarations last
- Semantic placement of variable declarations

### Function Hoisting

```js
getStudents();

// ..

function getStudents() {
  // ..
}
```

👆🏼 The function declaration is **hoisted during _compilation_**, which means:

- `getStudents` is an identifier declared **for the entire scope.**
- `getStudents` identifier is **auto-initialized with the function reference,** again at the **beginning** of the scope.

- 👍🏼 It puts the executable code in any scope at the top, and any further declarations (functions) below.
  - This means it's **easier to find the code** that will run in any given area, rather than having to scroll and scroll, hoping to find a trailing `}` marking the end of a scope/function somewhere.

### Variable Hoisting

**In almost all cases**, Author completely agree that variable hoisting is a **bad idea**!

#### One exception:

- `var` declarations inside a CommonJS module definition.

```js
// dependencies
var aModuleINeed = require("very-helpful");
var anotherModule = require("kinda-helpful");

cache = {};   // used here, but declared below

// public API
var publicAPI = Object.assign(module.exports,{
    getStudents,
    addStudents,
    refreshData: refreshData.bind(null, 👉🏼 cache 👈🏼)
});

// ********************************
// private implementation

👉🏼 var cache /* = {}*/; 👈🏼
var otherData = [ ];

function getStudents() {
    // ..
}

function addStudents() {
    // ..
}
```

👆🏼

- `cache` and `otherData` variables are in the _"private"_ section of the module layout because author don't plan to expose them publicly.
- So author organize the module so they're **located alongside the other hidden implementation details of the module.**

## The Case for `var`

- `var` was never broken
- `let` is your friend
- `const` has limited utility
- The best of both worlds: `var` and `let`

### `const`-antly Confused

`const` pretends to create values that can't be mutated—a misconception that's extremely common in developer communities across many languages—whereas what **it really does is prevent _re-assignment_.**

#### ⭐️ 🤔 Reason not to rely on `const`:

```js
const studentIDs = [14, 73, 112];

// later

studentIDs.push(6); // totally fine!
```

- Using a `const` with a mutable value **(like an array or object)** is asking for a future developer (or reader of your code) to fall into the trap you set, which was that they either didn't know, or sorta forgot, that **value immutability ≠ assignment immutability.**

- If variable re-assignment were a big deal, then `const` would be more useful. **But variable re-assignment just isn't that big of a deal in terms of causing bugs!** 😗
  - Combine that with the fact that `const` (and `let`) are supposed to be used in **blocks**, and **blocks are supposed to be short**, and you have a really small area of your code where a `const` declaration is even applicable.
  - the thing it tells you is already obvious by glancing down at those nine lines: the variable is never on the left-hand side of an `=;` it's not re-assigned. (好像也是有道理ㄟ 🤪！！)
- A `let` (or `var`!) that's never re-assigned is already behaviorally a "constant"!

### `var` and `let`

where should we still use `var`? Under what circumstances is it a better choice than `let`?

(I = author)

- I Always use `var` in the **top-level scope of any function,** regardless of whether that's at the beginning, middle, or end of the function.
  - if you use `let`, then it's less obvious which declarations are designed to be localized and which ones are intended to be used throughout the function.
- I also use `var` in the **global scope,** though I try to minimize usage of the global scope.
- I rarely use a `var` inside a block.
  - That's what `let` is for.

💁🏻‍♂️ TL;DR

- If you see a `let`, it tells you that you're dealing with a **localized declaration**.
- If you see `var`, it tells you that you're dealing with a **function-wide declaration.**
- example:

  ```js
  function getStudents(data) {
      var studentRecords = [];

      for (let record of data.records) {
          let id = `student-${ record.id }`;
          studentRecords.push({
              id,
              record.name
          });
      }

      return studentRecords;
  }
  ```

---

`var` has a few other characteristics that, in certain limited circumstances, make it more powerful!

- One example is when a **loop is exclusively using a variable,** but its conditional clause cannot see block-scoped declarations inside the iteration:

  ```js
  function commitAction() {
    do {
      let result = commit();
      var done = result && result.code == 1;
    } while (!done);
  }
  ```

- Another helpful characteristic of `var` is seen with declarations inside **unintended blocks.** (⭐️ ⭐️ 💁🏻‍♂️ **Unintended blocks:** blocks that are created because the syntax requires a block, but where the intent of the developer is not really to create a localized scope.)

  ```js
  function getStudents() {
    try {
      // not really a block scope
      var records = fromCache("students");
    } catch (err) {
      // oops, fall back to a default
      var records = [];
    }
    // ..
  }
  ```

  - I don't want to declare records (with `var` or `let`) outside of the try block, and then assign to it in one or both blocks because 💁🏻‍♂️ I prefer **initial declarations to always be as close as possible (ideally, same line) to the first usage of the variable.** _(to be more readable)_
  - I used `var` in both the `try` and `catch` blocks because 💁🏻‍♂️ I want to signal to the reader that **no matter which path is taken, `records` always gets declared.** _(Technically, that works because var is hoisted once to the function scope, But it's still a nice **semantic signal**)_

- This **repeated-annotation** superpower is useful in cases:

  ```js
  function getStudents() {
    var data = [];

    // do something with data
    // .. 50 more lines of code ..

    // purely an annotation to remind us
    var data;

    // use data again
    // ..
  }
  ```

  - The second var data is not re-declaring data, it's just **_annotating_** for the readers' benefit that data is a function-wide declaration.
  - That way, the **reader doesn't need to scroll up 50+ lines of code to find the initial declaration.** (蠻酷酷酷 ✨！)

## TDZ Origin story

TDZ comes from `const`

```js
{
  // what should print here?
  console.log(studentName);

  // later

  const studentName = "Frank";

  // ..
}
```

👆🏼
Let's imagine that `studentName` not only **hoisted to the top of this block**, but was also **auto-initialized to `undefined`:**

1. For the first half of the block, `studentName` could be observed to have the `undefined` value, such as with our `console.log(..)` statement.
2. Once the `const studentName = ..` statement is reached, now `studentName` is assigned `"Frank"`. 😲 But `studentName` should not ever be **re-assigned!!**
3. So... We can't auto-initialize `studentName` to `undefined` (or any other value for that matter). But the variable has to exist throughout the whole scope. **What do we do with the period of time from when it first exists (beginning of scope) and when it's assigned its value?** 👉🏼 **_"temporal dead zone"_ (TDZ).**

---

#### Why TDZ of `let`

(decision made by TC39)

- **consistency perspective:** since we need a TDZ for `const`, we might as well have a TDZ for `let` as well.
- **social engineering:** if we make let have a TDZ, then we discourage all that _ugly variable hoisting_ people do.

> **AUTHOR ADVICE:** <br/>Let `const` be its own unique deal with a TDZ, and `let` the answer to TDZ purely be: just avoid the TDZ by always declaring your constants **at the top of the scope.**

## Are Synchronous Callbacks Still Closures?

[Chapter 7](./ch7.md) presented two different models for tackling closure:

- Closure is a function instance **remembering its outer variables** even as that function is passed around and **invoked** in other scopes.
- Closure is a function instance and **its scope environment being preserved in-place** while any references to it are passed around and **invoked from** other scopes.

### What is a Callback?

#### Asynchronous Callback

- It means that the current code has finished or paused, suspended itself, and that when the function in question is invoked later, execution is entering back into the suspended program, resuming it.
- e.g., the point of re-entry is the code that was wrapped in the function reference

```js
setTimeout(function waitForASecond() {
  // this is where JS should call back into
  // the program when the timer has elapsed
}, 1000);

// this is where the current program finishes
// or suspends
```

👆🏼 The JS engine is resuming our suspended program by _calling back_ in at a specific location.

#### Synchronous Callback

```js
function getLabels(studentIDs) {
  return studentIDs.map(function formatIDLabel(id) {
    return `Student ID: ${String(id).padStart(6)}`;
  });
}

getLabels([14, 73, 112, 6]);
// [
//    "Student ID: 000014",
//    "Student ID: 000073",
//    "Student ID: 000112",
//    "Student ID: 000006"
// ]
```

👆🏼 Passing in a function (reference) so that another part of the program can invoke it on our behalf. 💁🏻‍♂️ You can think of this as **Dependency Injection (DI)** or **Inversion of Control (IoC)**.

- **Dependency Injection (DI)**
  - DI can be summarized as passing in necessary part(s) of functionality to another part of the program so that it can invoke them to complete its work.
  - e.g., The `map(..)` utility knows to iterate over the list's values, but it doesn't know what to do with those values. That's why we pass it the `formatIDLabel(..)` function. We pass in the dependency.
- **Inversion of Control (IoC)**
  - IC means that instead of the current area of your program controlling what's happening, you hand control off to another part of the program.
  - e.g., We wrapped the logic for computing a label string in the function `formatIDLabel(..)`, then handed invocation control to the `map(..)` utility.

🧚🏻‍♂️ In the context of our discussion, either DI or IoC could work as an alternative label for a synchronous callback.

### Synchronous Closure?

#### are IIFs an example of closure?

The `formatIDLabel(..)` IIF from earlier does not reference any variables outside its own scope, so it's definitely not a closure. but...

```js
function printLabels(labels) {
  var list = document.getElementByID("labelsList");

  labels.forEach(function renderLabel(label) {
    var li = document.createELement("li");
    li.innerText = label;
    list.appendChild(li);
  });
}
```

👆🏼 The inner `renderLabel(..)` IIF references list from the enclosing scope, so it's an IIF that **could have closure.** But here's where the definition/model we choose for closure matters:

🙆🏻‍♂️: If `renderLabel(..)` is a **function that gets passed somewhere else**, and that function is then invoked, then yes, `renderLabel(..)` is exercising a closure, because closure is what preserved its access to its original scope chain.

🙅🏻‍♂️: If `renderLabel(..)` stays in place, and only a reference to it is passed to `forEach(..)`, is there any need for closure to preserve the scope chain of `renderLabel(..)`, while it executes synchronously right inside its own scope? 👉🏼 That's just **_normal lexical scope._**

(because you can refactor to these 👇🏼)

```js
function printLabels(labels) {
  var list = document.getElementByID("labelsList");

  for (let label of labels) {
    // just a normal function call in its own
    // scope, right? That's not really closure!
    renderLabel(label);
  }

  // **************

  function renderLabel(label) {
    var li = document.createELement("li");
    li.innerText = label;
    list.appendChild(li);
  }
}
```

## Classic Module Variations

a classic module pattern:

```js
var StudentList = (function defineModule(Student) {
  var elems = [];

  var publicAPI = {
    renderList() {
      // ..
    },
  };

  return publicAPI;
})(Student);
```

Notice that we're passing `Student` (another module instance) in as a dependency. But there's lots of **useful variations** on this module form you may encounter. Some hints for recognizing these variations:

- Does the module know about its own API?
- Even if we use a fancy module loader, it's just a classic module
- Some modules need to work universally

### Where's My API?

typically we'll see code like:

```js
var StudentList = (function defineModule(Student) {
  var elems = [];

  return {
    renderList() {
      // ..
    },
  };
})(Student);
```

> **⭐️ ⭐️ ⭐️ AUTHOR ADVICE**<br/>
> Always use the former publicAPI form!<br/><br/> Two reasons:
>
> - `publicAPI` is a **semantic descriptor** that **aids readability** by making it more obvious what **the purpose of the object is**.
> - Storing an inner `publicAPI` **variable** that references the same external public API object returned, can be **useful if you need to access or modify the API during the lifetime of the module.**

### Asynchronous Module Defintion (AMD)

Another variation on the classic module form is AMD-style modules (popular several years back), such as those supported by the RequireJS utility:

```js
define(["./Student"], function StudentList(Student) {
  var elems = [];

  return {
    renderList() {
      // ..
    },
  };
});
```

### Universal Modules (UMD)

It was designed to create **better interop** (without any build-tool conversion) for modules that may be loaded in browsers, by AMD-style loaders, or in Node.

Typical structure of a UMD:

```js
(function UMD(name, context, definition) {
  // loaded by an AMD-style loader?
  if (typeof define === "function" && define.amd) {
    define(definition);
  }
  // in Node?
  else if (typeof module !== "undefined" && module.exports) {
    module.exports = definition(name, context);
  }
  // assume standalone browser script
  else {
    context[name] = definition(name, context);
  }
})("StudentList", this, function DEF(name, context) {
  var elems = [];

  return {
    renderList() {
      // ..
    },
  };
});
```

---

#### Why above variation are important

There's no question that as of the time of this writing, ESM (ES Modules) are becoming popular and widespread rapidly. But with millions and millions of modules written over the last 20 years, all using some pre-ESM variation of classic modules, they're still very important to **be able to read and understand** when you come across them.
