<h1 style="text-align:center"> The (Not So) Secret Lifecycle of Variables 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch5.md)

- [When Can I Use a Variable?](#when-can-i-use-a-variable)
  - [Hoisting: Declaration vs. Expression](#hoisting-declaration-vs-expression)
  - [Variable Hoisting](#variable-hoisting)
- [Hoisting in Metaphor](#hoisting-in-metaphor)
- [Re-declaration?](#re-declaration)
  - [`var`](#var)
  - [`function`](#function)
  - [`let`](#let)
  - [`const`](#const)
  - [Loops](#loops)
    - [`while`-loops](#while-loops)
    - [`for`-loops](#for-loops)
- [Uninitialized Variables (aka, TDZ)](#uninitialized-variables-aka-tdz)
  - [How can you avoid TDZ errors?](#how-can-you-avoid-tdz-errors)
  - [Why of TDZ?](#why-of-tdz)
- [Takeaways](#takeaways)

and also the answers to ...

- If a variable declaration appears past the first statement of a scope, how will any references to that identifier before the declaration behave?
- What happens if you try to declare the same variable twice in a scope?

## When Can I Use a Variable?

❌ After the variable has been declared/created.

```js
greeting();
// Hello!

function greeting() {
  console.log("Hello!");
}
```

✅ Every identifier is created at the beginning of the scope it belongs to, **every time that scope is entered.**

⭐️ **Hoisting:** a variable being visible from the beginning of its enclosing scope, even though its declaration may appear further down in the scope.

⭐️ **Function Hoisting:** When a function declaration's name identifier is registered at the top of its scope, it's additionally auto-initialized to that function's reference.

🪄 Both **function hoisting** and `var`-flavored **variable hoisting** attach their name identifiers to the nearest enclosing **function scope** (or, if none, the global scope), not a block scope.

### Hoisting: Declaration vs. Expression

Function hoisting only applies to formal `function` declarations (specifically those which appear outside of blocks—see "FiB" in [Chapter 6])(ch6.md), not to `function` expression assignments. Consider:

```js
greeting();
// TypeError

var greeting = function greeting() {
  console.log("Hello!");
};
```

- A `TypeError` means we're trying to do something with a value that is not allowed 👉🏼 telling us `greeting` was found but doesn't hold a function reference at that moment, so attempting to invoke some non-function value results in an error.
- ⭐️ In addition to being hoisted, variables declared with `var` are also **automatically initialized to `undefined` at the beginning of their scope**—again, the nearest enclosing function, or the global.
  - Once initialized, they're available to be used (assigned to, retrieved from, etc.) throughout the whole scope.
  - So on that first line, greeting exists, but it holds only the default undefined value. It's not until line 4 that greeting gets assigned the function reference.

---

⭐️ ⭐️ ⭐️

- A function declaration is hoisted and initialized to its function value (again, called function hoisting).
- A `var` variable is also hoisted, and then auto-initialized to `undefined`.
  - Any subsequent function expression assignments to that variable don't happen until that assignment is processed during **runtime execution**.

### Variable Hoisting

```js
greeting = "Hello!";
console.log(greeting);
// Hello!

var greeting = "Howdy!";
```

Though `greeting` isn't declared until line 5, it's available to be assigned to as early as line 1. Because:

- the identifier is hoisted
- **and** it's automatically initialized to the value `undefined` from the top of the scope.

> 🤔 **Should all hoisting** (including function hoisting) **be avoided?** see more detail in [Appendix A](apA.md)

## Hoisting in Metaphor

It's more useful to think of hoisting as a visualization of various actions JS takes in setting up the program before execution.

The typical assertion of what hoisting means: **_lifting_**—like lifting a heavy weight upward—_any identifiers all the way to the top of a scope_.

- `var`

```js
var greeting; // hoisted declaration
greeting = "Hello!"; // the original line 1
console.log(greeting); // Hello!
greeting = "Howdy!"; // `var` is gone!
```

- `function`

```js
studentName = "Suzy";
greeting();
// Hello Suzy!

function greeting() {
  console.log(`Hello ${studentName}!`);
}
var studentName;
```

👆🏼
The "rule" of the hoisting metaphor:

1. `function` declarations are hoisted first,
2. then `var` are hoisted immediately after all the functions.

Thus, the hoisting story suggests that program is re-arranged by the JS engine to look like this👇🏼

```js
function greeting() {
  console.log(`Hello ${studentName}!`);
}
var studentName;

studentName = "Suzy";
greeting();
// Hello Suzy!
```

---

Hoisting as a mechanism for re-ordering code may be an attractive simplification, but it's not accurate.

- The JS engine **doesn't actually re-arrange the code.**
- It can't magically look ahead and find declarations; the only way to accurately find them, as well as all the scope boundaries in the program, would be to **fully parse the code.**

To sum up,
<br/>⭐️ ⭐️ ⭐️ **hoisting** should be used to refer to the **compile-time operation** of generating runtime instructions for the _automatic registration of a variable at the beginning of its scope, each time that scope is entered._

## Re-declaration?

### `var`

What happens when a variable is declared more than once in the same scope?

```js
var studentName = "Frank";
console.log(studentName);
// Frank

var studentName;
console.log(studentName); // ??? 👉🏼 Frank
```

- Since hoisting is actually about registering a variable **at the beginning of a scope**, there's nothing to be done in the middle of the scope where the original program actually had the second `var studentName` statement. 👉🏼 It's just a no-op(eration), a pointless statement.

- ⭐️ It's also important to point out that `var studentName` ≠ `var studentName = undefined`, as most assume.

```js
var studentName = "Frank";
console.log(studentName); // Frank

var studentName;
console.log(studentName); // Frank <--- still!

// let's add the initialization explicitly
var studentName = undefined;
console.log(studentName); // undefined <--- see!?
```

### `function`

```js
var greeting;

function greeting() {
  console.log("Hello!");
}

// basically, a no-op
var greeting;

typeof greeting; // "function"

var greeting = "Hello!";

typeof greeting; // "string"
```

👆🏼

1. The first `greeting` declaration registers the identifier to the scope, and because it's a `var` the **auto-initialization** will be `undefined`.
2. ⭐️ The `function` declaration **doesn't need to re-register the identifier**, but because of **function hoisting it overrides the auto-initialization to use the function reference.**
3. The second `var greeting` by itself doesn't do anything since `greeting` is already an identifier and function hoisting already took precedence for the auto-initialization.
4. Actually assigning `"Hello!"` to `greeting` changes its value from the initial `function greeting()` to the string; `var` itself doesn't have any effect.

### `let`

```js
let studentName = "Frank";

console.log(studentName);

let studentName = "Suzy";
```

👆🏼 This program will not execute, but instead immediately throw a `❌ SyntaxError` -> this is a case where attempted "re-declaration" is explicitly not allowed!

```js
var studentName = "Frank";
let studentName = "Suzy";
```

```js
let studentName = "Frank";
var studentName = "Suzy";
```

👆🏼 In both cases, a `❌ SyntaxError` is thrown on the second declaration.

👉🏼 Only way to **"re-declare"** a variable is to use `var` for all (two or more) of its declarations.

🤔 **BUT WHY?**

- It's really more of a **_"social engineering"_** issue.
- **"Re-declaration"** of `var` is seen by some, including many on the TC39 body, as a **bad habit that can lead to program bugs.**
- So when ES6 introduced `let`, they decided to **prevent** "re-declaration" with an error.

### `const`

The `const` keyword requires a variable to be **initialized**, so omitting an assignment from the declaration results in a `❌ SyntaxError` :

```js
const empty;   // SyntaxError
```

and it **cannot be re-assigned**:

```js
const studentName = "Frank";
console.log(studentName);
// Frank

studentName = "Suzy"; // TypeError
```

> **ERROR TYPE**
>
> - Syntax errors represent faults in the program that **_stop it from even starting execution._**
> - Type errors represent faults that arise **_during program execution_**

Any `const` **"re-declaration"** would also necessarily be a `const` **re-assignment**, which can't be allowed!

```js
const studentName = "Frank";

// obviously this must be an error
const studentName = "Suzy";
```

### Loops

#### `while`-loops

JS doesn't really want us to "re-declare" our variables within the same scope.

Consider:

```js
var keepGoing = true;
while (keepGoing) {
  let value = Math.random();
  if (value > 0.5) {
    keepGoing = false;
  }
}
```

👆🏼 🤔 Is `value` being "re-declared" repeatedly in this program? Will we get errors thrown? -> 🙅🏻‍♂️ No!

All the rules of scope (including "re-declaration" of let-created variables) are applied **per scope instance.**
<br/>⭐️ 👉🏼 In other words, **each time a scope is entered during execution, everything resets.**

```js
var keepGoing = true;
while (keepGoing) {
  var value = Math.random();
  if (value > 0.5) {
    keepGoing = false;
  }
}
```

👆🏼 🤔 Is `value` being "re-declared" here, especially since we know `var` allows it? -> 🙅🏻‍♂️ No!

- Because `var` is not treated as a block-scoping declaration (see Chapter 6), it **attaches itself to the global scope.**
- So there's just one `value` variable, in the same scope as `keepGoing` (global scope, in this case) -> No "re-declaration" here, either!

> **🗣 AUTHOR** <br/>
> One way to keep this all straight is to remember that `var`, `let`, and `const` keywords are effectively removed from the code by the time it starts to execute. They're **_handled entirely by the compiler._**

#### `for`-loops

```js
for (let i = 0; i < 3; i++) {
  let value = i * 10;
  console.log(`${i}: ${value}`);
}
// 0: 0
// 1: 10
// 2: 20
```

👆🏼 🤔 Is `i` being "re-declared"?

**Consider what scope `i` is in.** It might seem like it would be in the outer (in this case, global) scope, but it's not. **_It's in the scope of `for`-loop body, just like `value` is._**

In fact, we could sorta think about that loop in this more verbose equivalent form:

```js
{
    // a fictional variable for illustration
    let $$i = 0;

    for ( /* nothing */; $$i < 3; $$i++) {
        // here's our actual loop `i`!
        ⭐️ let i = $$i;

        let value = i * 10;
        console.log(`${ i }: ${ value }`);
    }
    // 0: 0
    // 1: 10
    // 2: 20
}
```

💁🏻‍♂️ the `i` and `value` variables are both **declared exactly once per scope instance.**

```js
for (let index in students) {
  // this is fine
}

for (let student of students) {
  // so is this
}
```

👆🏼 the declared variable is treated as **inside** the loop body, and thus is handled per iteration (aka, per scope instance).

---

```js
var keepGoing = true;
while (keepGoing) {
  // ooo, a shiny constant!
  const value = Math.random();
  if (value > 0.5) {
    keepGoing = false;
  }
}
```

👆🏼 `const` is being run exactly once within each loop iteration, so it's safe from "re-declaration" troubles!

```js
for (const index in students) {
  // this is fine
}

for (const student of students) {
  // this is also fine
}
```

```js
for (const i = 0; i < 3; i++) {
  // oops, this is going to fail with
  // a ❌ Type Error after the first iteration
}
```

👆🏼👇🏼

```js
{
  // a fictional variable for illustration
  const $$i = 0;

  for (; $$i < 3; $$i++) {
    // here's our actual loop `i`!
    const i = $$i;
    // ..
  }
}
```

💁🏻‍♂️ The problem is the conceptual `$$i` that must be incremented each time with the `$$i++` expression. _That's **re-assignment** (not "re-declaration"), which isn't allowed for constants._

## Uninitialized Variables (aka, TDZ)

> **RECAP**<br/>With `var` declarations, the variable is "hoisted" to the top of its scope. But it's also automatically initialized to the `undefined` value, so that the variable can be used throughout the entire scope.

However, `let` and `const` declarations are not quite the same in this respect.

```js
console.log(studentName);
// ReferenceError

let studentName = "Suzy";
```

👆🏼 ❌: "Cannot access studentName before initialization."

```js
studentName = "Suzy"; // let's try to initialize it!
// ReferenceError

console.log(studentName);

let studentName;
```

👆🏼 ❌: Trying to assign to (aka, initialize!) this so-called "uninitialized" variable `studentName`

The real question is, **how do we initialize an uninitialized variable?**

For `let`/`const`, the only way to do so is with an assignment attached to a declaration statement. A**_n assignment by itself is insufficient!_** Consider:

```js
let studentName = "Suzy";
console.log(studentName); // Suzy
```

```js
// ..

let studentName;
// or:
// let studentName = undefined;

// ..

studentName = "Suzy";

console.log(studentName);
// Suzy
```

- we said that `var studentName` ≠ `var studentName = undefined`, but here with `let`, they behave the same.

  - The difference comes down to the fact that `var studentName` automatically **initializes at the top** of the scope, where `let studentName` **does not**.

- Compiler ends up removing any `var`/`let`/`const` declarators, **replacing them with the instructions at the top of each scope to register the appropriate identifiers.**

- Compiler is also **adding an instruction in the middle of the program**, at the point where the variable `studentName` was declared, to handle that declaration's auto-initialization.
  - We cannot use the variable at any point prior to that initialization occuring.
  - The same goes for `const` as it does for `let`.
- The term coined by TC39 to refer to **_this period of time from the entering of a scope to where the auto-initialization of the variable occurs_** is: Temporal Dead Zone **(TDZ)**.
- A `var` also has technically has a TDZ, but it's **zero in length** and thus **unobservable** to our programs!
  - Only `let` and `const` have an **observable TDZ**.
- ⭐️ "temporal" in TDZ does indeed refer to **time** not position in code!

```js
askQuestion();
// ReferenceError

let studentName = "Suzy";

function askQuestion() {
  console.log(`${studentName}, do you know?`);
}
```

👆🏼 Even though positionally the `console.log(..)` referencing `studentName` comes after the `let studentName` declaration, timing wise the **`askQuestion()` function is invoked before the `let` statement is encountered**, while **`studentName` is still in its TDZ!** Hence the error.

🤔 TDZ means `let` and `const` do not hoist? -> 🙅🏻‍♂️ 🙅🏻‍♂️ 🙅🏻‍♂️ No!

👉🏼 The actual difference is that `let`/`const` declarations **do not automatically initialize at the beginning of the scope** (the way `var` does)

- **hoisting**: auto-registration of a variable at the top of the scope
  - ✅ : `var` / `let` / `const`
- **auto-initialization** at the top of the scope (to `undefined`)
  - ✅ : `var` ❌ : `let` / `const`

```js
var studentName = "Kyle";

{
  console.log(studentName);
  // ??? -> ❌ TDZ Error!

  // ..

  let studentName = "Suzy";

  console.log(studentName);
  // Suzy
}
```

- If `let studentName` didn't **hoist** to the top of the scope, then the first `console.log(..)` should print `"Kyle"`
- But instead, the first `console.log(..)` throws a **TDZ error,** because the inner scope's `studentName` was hoisted (auto-registered at the top of the scope).
- What didn't happen (yet!) was the **auto-initialization of that inner `studentName`;** it's still **uninitialized** at that moment, hence the TDZ violation!

👆🏼 prove that `let` and `const` **do hoist**

#### How can you avoid TDZ errors?

> **🪄 AUTHOR ADVICE:** <br/>Always put your `let` and `const` declarations **at the top of any scope**. Shrink the TDZ window to zero (or near zero) length, and then it'll be moot.

#### Why of TDZ?

👀 Discuss in [Appendix A](apA.md)

## Takeaways

- **Hoisting**
  - offers useful structure for thinking about the life-cycle of a variable—when it's created, when it's available to use, when it goes away.
- **(Re)declaration**
- **TDZ**
  - is relatively straightforward to avoid if you're always careful to place `let`/`const` declarations at the top of any scope.
