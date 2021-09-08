<h1 style="text-align:center">Limiting Scope Exposure 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch6.md)

- [Least Exposure](#least-exposure)
  - [Why not place all the variables in the global scope?](#why-not-place-all-the-variables-in-the-global-scope)
- [Hiding in Plain (Function) Scope](#hiding-in-plain-function-scope)
  - [Invoking Function Expressions Immediately](#invoking-function-expressions-immediately)
- [Scoping with Blocks](#scoping-with-blocks)
  - [`var` and `let`](#var-and-let)
  - [Where to use `let`](#where-to-use-let)
  - [What's the Catch?](#whats-the-catch)
- [Function Declarations in Blocks (FiB)](#function-declarations-in-blocks-fib)

🤔 how and why we should be using different levels of scope (functions and blocks) to organize our program's variables?

## Least Exposure

- **POLP:** Software engineering articulates a fundamental discipline, typically applied to software security, called "The Principle of Least Privilege" (POLP).
  - expresses a defensive posture to software architecture: **components of the system **should be designed to function with **least privilege**, **least access**, **least exposure.**
  - If each piece is connected with **minimum-necessary capabilities**, the overall system is **stronger from a security standpoint**, because a compromise or failure of one piece has a minimized impact on the rest of the system.
- **POLE:** And a variation of POLP that applies to our current discussion is typically labeled as "Least Exposure" (POLE).
  - If POLP focuses on **system-level** component design, the POLE Exposure variant focuses on a **lower level**.
  - ⭐️ What do we want to minimize the exposure of? 👉🏼 Simply: **the variables registered in each scope.**
  - s applied to variable/function scoping, essentially says, default to exposing the bare minimum necessary, keeping everything else as private as possible.
    - **Declare variables in as small and deeply nested of scopes as possible, rather than placing everything in the global (or even outer function) scope.**

#### Why not place all the variables in the global scope?

When variables used by one part of the program are exposed to another part of the program, via scope, there are three main hazards that often arise:

- **Naming Collisions:**
- **Unexpected Behavior:**
- **Unintended Dependency:** → create a refactoring hazard in the future

---

```js
function diff(x, y) {
  if (x > y) {
    let tmp = x;
    x = y;
    y = tmp;
  }

  return y - x;
}

diff(3, 7); // 4
diff(7, 5); // 2
```

👆🏼 Following the POLE principle, `tmp` should be as **hidden in scope as possible.** So we block scope `tmp` (using `let`) to the `if` block.

## Hiding in Plain (Function) Scope

🤔 How do we do hiding `var` or `function` declarations in scopes? → That can easily be done by **wrapping a function scope around a declaration.**

```js
var cache = {};

function factorial(x) {
  if (x < 2) return 1;
  if (!(x in cache)) {
    cache[x] = x * factorial(x - 1);
  }
  return cache[x];
}

factorial(6);
// 720

cache;
// {
//     "2": 2,
//     "3": 6,
//     "4": 24,
//     "5": 120,
//     "6": 720
// }

factorial(7);
// 5040
```

👆🏼 **QUESTION:** The `cache` variable is pretty obviously a private detail of how `factorial(..)` works, **not something that should be exposed in an outer scope**—especially not the global scope.

🤔 Since we need cache to survive multiple calls, it must be located in a scope outside that function. So what can we do?

👇🏼 **SOLUTION:** Define another middle scope (between the outer/global scope and the inside of `factorial(..)`) for `cache` to be located:

```js
// outer/global scope

function hideTheCache() {
  // "middle scope", where we hide `cache`
  var cache = {};

  return factorial;

  // **********************

  function factorial(x) {
    // inner scope
    if (x < 2) return 1;
    if (!(x in cache)) {
      cache[x] = x * factorial(x - 1);
    }
    return cache[x];
  }
}

var factorial = hideTheCache();

factorial(6);
// 720

factorial(7);
// 5040
```

❗️**BUT...** it's going to be **tedious** to define (and name!) a `hideTheCache(..)` function scope **each time such a need for variable/function hiding occurs**, especially since we'll likely want to avoid name collisions with this function by giving each occurrence a unique name.

👇🏼 **SOLUTION:** Rather than defining a new and uniquely named function each time one of those **scope-only-for-the-purpose-of-hiding-a-variable** situations occurs, a perhaps better solution is to **use a function expression**:

```js
var factorial = (function hideTheCache() {
  var cache = {};

  function factorial(x) {
    if (x < 2) return 1;
    if (!(x in cache)) {
      cache[x] = x * factorial(x - 1);
    }
    return cache[x];
  }

  return factorial;
})();

factorial(6);
// 720

factorial(7);
// 5040
```

- Since `hideTheCache(..)` is defined as a **function expression instead of a function declaration,** its name is in its own scope—essentially the same scope as `cache`—rather than in the outer/global scope.
- That means we can name each occurrence semantically based on whatever it is we're trying to hide, and not worry that whatever name we choose is going to collide with any other function expression scope in the program.
- In fact, we could just leave off the name entirely—thus defining an **"anonymous function expression" instead.** But 👀 [Appendix A](apA.md) will discuss the importance of names even for such scope-only functions.

### Invoking Function Expressions Immediately

- Immediately Invoked Function Expression **(IIFE):** a function expression that's then immediately invoked (👀 previous example)
- An IIFE is **useful** when we want to **create a scope to hide variables/functions**
- An IIFE can
  - be **named**, or (much more commonly!) unnamed/**anonymous**.
  - be **standalone** or part of another **statement**
    - (e.g., `hideTheCache()` returns the `factorial()` function reference which is then `=` assigned to the variable `factorial`)

👇🏼 **standalone IIFE** example

```js
// outer scope

(function () {
  // inner hidden scope
})();

// more outer scope
```

- Unlike earlier with `hideTheCache()`, where the outer surrounding `(..)` were noted as being an **optional** stylistic choice, **for a standalone IIFE they're required**
- They distinguish the function as an **expression**, not a statement.
  - 💁🏻‍♂️ For consistency, however, **always surround an IIFE function with `(..)`.**

#### Function Boundaries

❗️ Beware that using an IIFE to define a scope can have some **unintended consequences, depending on the code around it.** Because an IIFE is a full function, the function boundary alters the behavior of certain statements/constructs.

For example,

- a `return` statement in some piece of code would change its meaning if an IIFE is wrapped around it, because now the return would refer to the IIFE's function.
- Non-arrow function IIFEs also change the binding of a `this` keyword—more on that in the _Objects & Classes_ book.
- And statements like `break` and `continue` won't operate across an IIFE function boundary to control an outer loop or block.

💁🏻‍♂️ So, if the code you need to wrap a scope around has `return`, `this`, `break`, or `continue` in it, an **IIFE is probably not the best approach.** 👉🏼 In that case, you might look to **create the scope with a block instead of a function.**

## Scoping with Blocks

⭐️ ⭐️ ⭐️ In general, any `{ .. }` curly-brace pair which is a statement **will act as a block, but not necessarily as a scope.** 👉🏼 A block only becomes a scope if **necessary**, to contain its block-scoped declarations (i.e., `let` or `const`). Consider:

```js
{
  // not necessarily a scope (yet)

  // ..

  // now we know the block needs to be a scope
  let thisIsNowAScope = true;

  for (let i = 0; i < 5; i++) {
    // this is also a scope, activated each
    // iteration
    if (i % 2 == 0) {
      // this is just a block, not a scope
      console.log(i);
    }
  }
}
// 0 2 4
```

Not all `{ .. }` curly-brace pairs create blocks (and thus are eligible to become scopes):

- 🙅🏻‍♂️ **Object** literals use `{ .. }` curly-brace pairs to delimit their key-value lists, but such object values are not scopes.
- 🙅🏻‍♂️ **class** uses `{ .. }` curly-braces around its body definition, but this is not a block or scope.
- 🙅🏻‍♂️ A **function** uses `{ .. }` around its body, but this is not technically a block—it's a single statement for the function body. It is, however, a (function) scope.
- 🙅🏻‍♂️ ⭐️ The `{ .. }` curly-brace pair on a **switch** statement (around the set of case clauses) does not define a block/scope.
- 💁🏻‍♂️ Other than such non-block examples, a `{ .. }` curly-brace pair can **define a block attached to a statement** (like an **`if`** or **`for`**), or stand alone by itself!

⭐️ ⭐️ ⭐️ Following the **POLE** principle, we should use **(explicit) block scoping** to narrow the exposure of identifiers to the minimum practical.

🪄 An explicit block scope can be useful even inside of another block (whether the outer block is a scope or not).

#### Example 1

```js
if (somethingHappened) {
  // this is a block, but not a scope

  {
    // this is both a block and an
    // explicit scope
    let msg = somethingHappened.message();
    notifyOthers(msg);
  }

  // ..

  recoverFromSomething();
}
```

👆🏼

- Since that variable is not needed for the entire `if` block. Most developers would just block-scope `msg` to the if block and move on.
- And to be fair, when there's only a few lines to consider, it's a toss-up judgement call. But as code grows, these over-exposure issues become more pronounced!
- If this `let` declaration isn't needed in the first half of that block, you should use an inner explicit block scope to further narrow its exposure!

> **🗣 AUTHOR:** Follow POLE and always (within reason!) define the smallest block for each variable!!

#### Example 2

```js
function getNextMonthStart(dateStr) {
  var nextMonth, year;

  {
    let curMonth;
    [, year, curMonth] = dateStr.match(/(\d{4})-(\d{2})-\d{2}/) || [];
    nextMonth = (Number(curMonth) % 12) + 1;
  }

  if (nextMonth == 1) {
    year++;
  }

  return `${year}-${String(nextMonth).padStart(2, "0")}-01`;
}
getNextMonthStart("2019-12-25"); // 2020-01-01
```

👆🏼 identify the scopes and their identifiers:

1. The outer/global scope has one identifier, the function `getNextMonthStart(..)`
2. The function scope for `getNextMonthStart(..)` has three: `dateStr` (parameter), `nextMonth`, and `year`.
3. The `{ .. }` curly-brace pair defines an inner block scope that includes one variable: `curMonth`.

→ Put `curMonth` in an explicit block scope instead of just alongside `nextMonth` and `year` in the top-level function scope, Since `curMonth` is **only needed** for those first two statements.

<br/>

> **🗣 AUTHOR:** Benefits of the **POLE** principle are best achieved when you **adopt the mindset of minimizing scope exposure by default**, as a habit!🧚🏻‍♂️

#### Example 3

```js
function sortNamesByLength(names) {
  var buckets = [];

  for (let firstName of names) {
    if (buckets[firstName.length] == null) {
      buckets[firstName.length] = [];
    }
    buckets[firstName.length].push(firstName);
  }

  // a block to narrow the scope
  {
    let sortedNames = [];

    for (let bucket of buckets) {
      if (bucket) {
        // sort each bucket alphanumerically
        bucket.sort();

        // append the sorted names to our
        // running list
        sortedNames = [...sortedNames, ...bucket];
      }
    }

    return sortedNames;
  }
}

sortNamesByLength(["Sally", "Suzy", "Frank", "John", "Jennifer", "Scott"]);
// [ "John", "Suzy", "Frank", "Sally",
//   "Scott", "Jennifer" ]
```

👆🏼 We split them out into each inner nested scope as appropriate. Each variable is defined at the innermost scope possible for the program to operate as desired.

- `var buckets` is used across the entire function (except the final return statement).
  - Any variable that is needed across all (or even most) of a function should be declared so that such usage is obvious.
- The parameter `names` isn't used across the whole function, but there's **no way limit the scope of a parameter**, so it behaves as a function-wide declaration regardless.

### `var` and `let`

- Stylistically, `var` has always signaled **"variable that belongs to a whole function."**
- As we asserted in "Lexical Scope" (Chapter 1), **`var` attaches to the nearest enclosing function scope, no matter where it appears.**
  - That's true even if `var` appears inside a **block**:

```js
function diff(x, y) {
  if (x > y) {
    var tmp = x; // `tmp` is function-scoped
    x = y;
    y = tmp;
  }

  return y - x;
}
```

- 👆🏼 While you can declare `var` inside a block (and still have it be function-scoped), I would recommend against this approach except in a few specific cases (👀 discussed in [Appendix A](apA.md)).
  - Otherwise, **`var` should be reserved for use in the top-level scope of a function.**
- 🤔 Why not just use `let` in that same location?
  - Because `var` is visually distinct from `let` and therefore signals clearly, **"this variable is function-scoped."**
  - Using `let` in the top-level scope, especially if not in the first few lines of a function, and when all the other declarations in blocks use `let`, **does not visually draw attention to the difference with the function-scoped declaration.**

> **🗣 AUTHOR:** ⭐️ As long as your programs are going to need both **function-scoped** and **block-scoped** variables, the most **sensible** and **readable** approach is to use both `var` and `let` together, each for their own best purpose.🧚🏻

### Where to use `let`

- `var`: (mostly) only a top-level function scope
- `let`: most other declarations

**POLE** already guides you on those decisions, but let's make sure we explicitly state it by asking → 🤔 _"What is the most minimal scope exposure that's sufficient for this variable?"_

Once that is answered, you'll know if a variable belongs in a **block scope** or the **function scope**

- If a declaration belongs in the **function** scope, use `var`.
- If it belongs in a **block** scope, use `let`.

👎🏼

```js
function diff(x, y) {
  var tmp;

  if (x > y) {
    tmp = x;
    x = y;
    y = tmp;
  }

  return y - x;
}
```

👍🏼 (if the code is prios to ES6, thus no `let`)

```js
function diff(x, y) {
  if (x > y) {
    // `tmp` is still function-scoped, but
    // the placement here semantically
    // signals block-scoping
    var tmp = x;
    x = y;
    y = tmp;
  }

  return y - x;
}
```

---

No matter where such a loop is defined, the `i` **should basically always be used only inside the loop**, in which case **POLE** dictates it should be declared with `let` instead of `var`:

```js
for (let i = 0; i < 5; i++) {
  // do something
}
```

if you were relying on accessing the loop's iterator (i) **outside/after the loop**:

#### Bad Sol 👎🏼

```js
for (var i = 0; i < 5; i++) {
  if (checkValue(i)) {
    break;
  }
}

if (i < 5) {
  console.log("The loop stopped early!");
}
```

#### Better Sol 👍🏼

```js
var lastI;

for (let i = 0; i < 5; i++) {
  lastI = i;
  if (checkValue(i)) {
    break;
  }
}

if (lastI < 5) {
  console.log("The loop stopped early!");
}
```

### What's the Catch?

Since the introduction of `try..catch` back in ES3 (in 1999), the `catch` clause has used an **additional (little-known) block-scoping declaration capability**:

```js
try {
  doesntExist();
} catch (err) {
  console.log(err);
  // ReferenceError: 'doesntExist' is not defined
  // ^^^^ message printed from the caught exception

  let onlyHere = true;
  var outerVariable = true;
}

console.log(outerVariable); // true

console.log(err);
// ReferenceError: 'err' is not defined
// ^^^^ this is another thrown (uncaught) exception
```

- The `err` variable declared by the `catch` clause is **block-scoped to that block**.
  - This catch clause block can hold other block-scoped declarations via `let`.
  - But a `var` declaration inside this block still attaches to the outer function/global scope.
- **ES2019** changed `catch` clauses so their declaration is optional;
  - if the declaration is omitted, the `catch` block is **no longer (by default) a scope; it's still a block,** though!
  - So if you need to react to the condition that an exception occurred (so you can gracefully recover), but you don't care about the error value itself, you can omit the `catch` declaration _(slightly more performant in removing an unnecessary scope!)_
    ```js
    try {
      doOptionOne();
    } catch {
      // catch-declaration omitted
      doOptionTwoInstead();
    }
    ```

## Function Declarations in Blocks (FiB)

```js
if (false) {
  function ask() {
    console.log("Does this run?");
  }
}
ask();
```

#### Three possible outcomes:

1. The `ask()` call might fail with a `❌ ReferenceError` exception

   - because the `ask` identifier is **block-scoped** to the if block scope and thus **isn't available in the outer/global scope.**

2. The `ask()` call might fail with a `❌ TypeError` exception

   - **because the ask identifier exists, but it's `undefined`** (since the if statement doesn't run) and thus not a callable function.

3. The `ask()` call might run correctly, printing out the `"Does it run?"` message.

#### The actual outcomes:

- The **JS specification** says that function declarations inside of blocks are block-scoped, so the answer should be **(1)**.
- ⭐️ However, **most browser-based JS engines (including v8, which comes from Chrome but is also used in Node)** will behave as **(2)**, meaning the identifier is scoped outside the `if` block but the `function` value is not automatically initialized, so it remains `undefined`.
  - Because these engines already had certain behaviors around FiB **before ES6 introduced block scoping**
  - And there was concern that changing to adhere to the specification might **break some existing website JS code**.

> **NOTE:** Node's v8 engine is shared with Chrome (and Edge) browsers. Since v8 is first a browser JS engine, it adopts this Appendix B exception, which then means that the browser exceptions are extended to Node.

---

**behaviors in various browsers and non-browser JS environments** (JS engines that aren't browser based) will likely **vary**.

(For example the code below)

```js
if (true) {
  function ask() {
    console.log("Am I called?");
  }
}

if (true) {
  function ask() {
    console.log("Or what about me?");
  }
}

for (let i = 0; i < 5; i++) {
  function ask() {
    console.log("Or is it one of these?");
  }
}

ask();

function ask() {
  console.log("Wait, maybe, it's this one?");
}
```

⭐️ ⭐️ ⭐️ the only practical answer to **avoiding the vagaries of FiB** 👉🏼 is to simply **avoid FiB entirely**.

- In other words, **never place a function declaration directly inside any block.**
- Always place function declarations anywhere in the top-level scope of a function (or in the global scope).

---

One of the most common use cases for placing a `function` declaration in a block is to **conditionally define a `function`** one way or another (like with an if..else statement) depending on some environment state.

#### Example

```js
if (typeof Array.isArray != "undefined") {
  function isArray(a) {
    return Array.isArray(a);
  }
} else {
  function isArray(a) {
    return Object.prototype.toString.call(a) == "[object Array]";
  }
}
```

👆🏼

- It's tempting to structure code this way for performance reasons.
- However, If you define multiple versions of a function, that program is always harder to reason about and maintain.
- And we should avoid conditionally defining functions if at all possible.

#### Solution

```js
function isArray(a) {
  if (typeof Array.isArray != "undefined") {
    return Array.isArray(a);
  } else {
    return Object.prototype.toString.call(a) == "[object Array]";
  }
}
```

or (better performance)

```js
var isArray = function isArray(a) {
  return Array.isArray(a);
};

// override the definition, if you must
if (typeof Array.isArray == "undefined") {
  isArray = function isArray(a) {
    return Object.prototype.toString.call(a) == "[object Array]";
  };
}
```

- 👀 It's a **function expression, not a declaration, inside the `if` statement.**
  - That's perfectly fine and valid, for function expressions to appear inside blocks.
  - Our discussion about **FiB** is about avoiding function **declarations in blocks**.
