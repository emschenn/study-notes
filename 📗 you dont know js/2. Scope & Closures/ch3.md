<h1 style="text-align:center">The Scope Chain 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch3.md)

- ["Lookup" ?](#lookup-)
  - [↪️ In what case would it ever not be known during compilation?](#️-in-what-case-would-it-ever-not-be-known-during-compilation)
- [Shadowing](#shadowing)
  - [Global Unshadowing Trick](#global-unshadowing-trick)
  - [Copying Is Not Accessing](#copying-is-not-accessing)
  - [Illegal Shadowing](#illegal-shadowing)
- [Function Name Scope](#function-name-scope)
  - [`function` declaration](#function-declaration)
  - [`function` expression](#function-expression)
- [Arrow Functions](#arrow-functions)
- [Backing Out](#backing-out)

The connections between scopes that are nested within other scopes is called the **scope chain**, which **determines the path along which variables can be accessed.**

The chain is directed, meaning **the lookup moves upward/outward only**.

## "Lookup" ?

We described the **runtime access of a variable** as a "lookup"

- The color of a marble's bucket (aka, meta information of what scope a variable originates from) is usually **determined during the initial compilation processing.**
- Because lexical scope is pretty much finalized at that point, a marble's color will not change based on anything that can happen later during runtime.
- In other words, Engine (from [ch2](ch2.md)) **doesn't need to lookup through a bunch of scopes** to figure out which scope bucket a variable comes from.
  - That information is already known!
  - Avoiding the need for a runtime lookup is a key **optimization benefit of lexical scope**.
  - The runtime operates more performantly without spending time on all these lookups

#### ↪️ In what case would it ever not be known during compilation?

Consider a reference to a variable that **isn't declared in any lexically available scopes in the current file**, which asserts that each file is its own **separate program** from the perspective of JS compilation.

- If no declaration is found, that's not necessarily an error.
  - Another file (program) in the runtime may indeed declare that variable in the shared global scope.
- Any reference to a variable that's initially undeclared is left as an uncolored marble during that file's compilation;
  - this color cannot be determined until other relevant file(s) have been compiled and the application runtime commences.
  - That deferred lookup will eventually resolve the color to whichever scope the variable is found in (likely the global scope).
- However, this lookup would only be **needed once per variable at most**, since nothing else during runtime could later change that marble's color.

## Shadowing

Having different lexical scope buckets starts to **matter more is when you have two or more variables, each in `different scopes`, with the `same lexical names`**

```js
var studentName = "Suzy";

function printStudent(studentName) {
  studentName = studentName.toUpperCase();
  console.log(studentName);
}

printStudent("Frank");
// FRANK

printStudent(studentName);
// SUZY

console.log(studentName);
// Suzy
```

👆🏼 This is a key aspect of lexical scope behavior, called **shadowing**. The `studentName`(parameter) variable shadows the `studentName` (var) .

👉🏼 So, **the parameter is shadowing the (shadowed) global variable.**

That's why the re-assignment of `studentName` affects only the inner (parameter) variable `studentName` , not the global
`studentName`.

⭐️ When you choose to shadow a variable from an outer scope, one direct impact is that from that scope inward/downward (through any nested scopes) it's now impossible for any marble to be colored as the shadowed variable
<br/>i.e., **It's lexically impossible to reference the global `studentName` anywhere inside** of the `printStudent(..)` function (or from any nested scopes).

### Global Unshadowing Trick

However, It is actually possible to access a **global variable** from a scope where that variable has been shadowed, but not through a typical lexical identifier reference. 🥴

⭐️ In the **global scope**, `var` declarations and `function` declarations also **expose themselves as properties** (of the same name as the identifier) **on the global object** —essentially an object representation of the global scope.

```js
var studentName = "Suzy";

function printStudent(studentName) {
  console.log(studentName);
  console.log(window.studentName);
}

printStudent("Frank");
// "Frank"
// "Suzy"
```

👆🏼 That's the only way to access a shadowed variable from inside a scope where the shadowing variable is present.

- The `window.studentName` is a z88 of the global studentName variable, **not a separate snapshot copy**.
  - Changes to one are still seen from the other, in either direction.
  - You can think of `window.studentName` as a **getter/setter** that accesses the actual `studentName` variable
- 🪄 As a matter of fact, you can even add a variable to the global scope by creating/setting a property on the global object.

> **⛔️ AUTHOR WARNING**<br/>Just because you can doesn't mean you should.<br/>
> Avoid using this trick to access a global variable that you've shadowed!

---

This little "trick" only works for **accessing a global scope variable** (not a shadowed variable from a nested scope), and even then, only one that was declared with `var` or `function`.

```js
var one = 1;
let notOne = 2;
const notTwo = 3;
class notThree {}

console.log(window.one); // 1
console.log(window.notOne); // undefined
console.log(window.notTwo); // undefined
console.log(window.notThree); // undefined
```

👆🏼 Other forms of global scope declarations do not create mirrored global object properties

```js
var special = 42;

function lookingFor(special) {
  // The identifier `special` (parameter) in this
  // scope is shadowed inside keepLooking(), and
  // is thus inaccessible from that scope.

  function keepLooking() {
    var special = 3.141592;
    console.log(special);
    console.log(window.special);
  }

  keepLooking();
}

lookingFor(112358132134);
// 3.141592
// 42
```

👆🏼 Variables (no matter how they're declared!) that exist in any other scope than the global scope are **completely inaccessible from a scope where they've been shadowed**: (`112358132134`)

### Copying Is Not Accessing

```js
var special = 42;

function lookingFor(special) {
  var another = {
    special: special,
  };

  function keepLooking() {
    var special = 3.141592;
    console.log(special);
    console.log(another.special); // Ooo, tricky!
    console.log(window.special);
  }

  keepLooking();
}

lookingFor(112358132134);
// 3.141592
// 112358132134
// 42
```

👆🏼 `special: special` is **copying the value** of the special parameter variable into another container (a property of the same name).

- That doesn't mean we're accessing the parameter
  special ; it means we're **accessing the copy of the value it had at that moment**, by way of another container (object property). - We cannot reassign the `special` parameter to a different value from inside `keepLooking()`.
- **Mutating the contents of the object value via a reference copy** ≠ **lexically accessing the variable** itself. (Since we still can't reassign the parameter)

### Illegal Shadowing

Not all combinations of declaration shadowing are allowed:

- `let` can shadow `var`
- but `var` cannot shadow `let`

```js
function something() {
  var special = "JavaScript";

  {
    let special = 42; // totally fine shadowing

    // ..
  }
}

function another() {
  // ..

  {
    let special = "JavaScript";

    {
      var special = "JavaScript";
      // ^^^ Syntax Error

      // ..
    }
  }
}
```

👆🏼 It's raised as a SyntaxError is because the `var` is basically trying to **"cross the boundary" of (or hop over) the let declaration of the same name**, which is not allowed.

⭐️ That **boundary-crossing prohibition effectively stops at each function boundary,** so this variant raises no exception:

```js
function another() {
  // ..

  {
    let special = "JavaScript";

    ajax("https://some.url", function callback() {
      // totally fine shadowing
      var special = "JavaScript";

      // ..
    });
  }
}
```

**💁🏻‍♂️ SUMMARY**:

- `let` (in an inner scope) can always shadow an outer scope's `var`.
- `var` (in an inner scope) can only shadow an outer scope's let **if there is a function boundary** in between.

## Function Name Scope

#### `function` declaration

```js
function askQuestion() {
  // ..
}
```

👆🏼 such a `function` declaration will **create an identifier** in the enclosing scope (in this case, the global scope) named `askQuestion`.

#### `function` expression

```js
var askQuestion = function () {
  // ..
};
```

👆🏼since it's a function expression—**a function definition used as value instead of a standalone declaration**—the function itself will not "hoist" (see [Ch5](ch5.md)).

---

One major difference between **function declarations** and **function expressions** is 👉🏼 what happens to the **name identifier** of the function.

```js
var askQuestion = function ofTheTeacher() {
  console.log(ofTheTeacher);
};

askQuestion();
// function ofTheTeacher()...

console.log(ofTheTeacher);
// ReferenceError: ofTheTeacher is not defined
```

👆🏼 `askQuestion` ends up in the outer scope, But `ofTheTeacher` is declared as an **identifier inside the function itself** ([Appendix A](apA.md) will explain further.)

```js
var askQuestion = function ofTheTeacher() {
  "use strict";
  ofTheTeacher = 42; // TypeError

  //..
};

askQuestion();
// TypeError
```

👆🏼 `ofTheTeacher` is also defined as read-only

```
var askQuestion = function(){
   // ..
};
```

👆🏼 A function expression with a name identifier is referred to as a "named function expression," but one without a name identifier is referred to as an **"anonymous function expression."** Anonymous function expressions clearly **have no name identifier that affects either scope.**

## Arrow Functions

Arrow functions are **lexically anonymous**, **meaning they have no directly related identifier that references the function.**

```js
var askQuestion = () => {
  // ..
};

askQuestion.name; // askQuestion
```

👆🏼 The assignment to `askQuestion` creates an inferred name of "askQuestion", but that's **not** the same thing as being **non-anonymous**! ⭐️ _(still anonymous)_

Other than being anonymous (and having no declarative form), => **arrow functions have the same lexical scope rules as function functions do.**

An arrow function, with or without `{ .. }` around its body, still creates a separate, inner nested bucket of scope. Variable declarations inside this nested scope bucket behave the same as in a function scope.

## Backing Out

- When a function (declaration or expression) is defined, a new scope is created!🐣
- **Scope Chain:** The positioning of scopes nested inside one another creates a natural scope hierarchy throughout the program
  - It controls **variable access**, **directionally oriented upward and outward**.
- **Shadowing:** When a variable name is repeated at different levels of the scope chain, which prevents access to the outer variable from that point inward.
