<h1 style="text-align:center">What's the Scope? 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch1.md)

- [Definition 🪄](#definition-)
- [Compiled vs. Interpreted](#compiled-vs-interpreted)
- [Compiling Code](#compiling-code)
  - [Syntax Errors from the Start](#syntax-errors-from-the-start)
  - [Early Errors](#early-errors)
  - [Hoisting](#hoisting)
- [Compiler Speak](#compiler-speak)
  - [Targets](#targets)
  - [Sources](#sources)
- [Cheating: Runtime Scope Modifications](#cheating-runtime-scope-modifications)
- [Lexical Scope](#lexical-scope)

_how does JS know which variables are accessible by any given statement, and how does it handle two variables of the same name?_ ✨ **_Scope!_** ✨

This book will dig through all aspects of scope—**how it works, what it's useful for, gotchas to avoid**—and then point toward common scope patterns that guide the structure of programs. And the first step is to **uncover how the JS engine processes our program before it runs.**

## Definition 🪄

### Scope

- The current context of execution.
- If a variable or other expression is not "in the current scope," then it is unavailable for use.

### Closure

- A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).
- 💁🏼 In other words, a closure **gives you access to an outer function’s scope from an inner function.**
- 👩🏻‍🏫 In JavaScript, closures are created every time a function is created, **at function creation time.**

---

A function serves as a closure in JavaScript, and thus creates a scope, so that (for example) a variable defined exclusively within the function cannot be accessed from outside the function or within other functions.

```
🙅🏻‍♂️
function exampleFunction() {
    var x = "declared inside function";  // x can only be used in exampleFunction
    console.log("Inside function");
    console.log(x);
}

console.log(x);  // Causes error
```

```
🙆🏻‍♀️
var x = "declared outside function";

exampleFunction();

function exampleFunction() {
    console.log("Inside function");
    console.log(x);
}

console.log("Outside function");
console.log(x);
```

## Compiled vs. Interpreted

- **Compilation:** A set of steps that process the text of your code and turn it into a list of instructions the computer can understand. **_(usually compiled all at once)_**
- **Interpretation:** Performs a similar task to compilation (both transforms your program into machine-understandable instructions) But the processing model is **_transformed line by line!_** 💁🏼 each line or statement is executed before immediately proceeding to processing the next line of the source code.

> **Why does it even matter whether JS is compiled or not?** <br/>
> Scope is primarily determined during compilation, so understanding how compilation and execution relate is key in mastering scope. 🗝

## Compiling Code

a program is processed by a compiler in three basic stages:

1. **Tokening/Lexing:** breaking up a string of characters into meaningful (to NOTE: the language) chunks, called tokens.<br/>

   - The **difference** between `tokenizing` and `lexing`: _whether or not these tokens are identified in a stateless or stateful way._
   - Put simply, if the tokenizer were to invoke stateful parsing rules to figure out whether a should be considered a distinct token or just part of another token, that would be `lexing`.

2. **Parsing:** taking a stream (array) of tokens and turning it into a tree of nested elements, which collectively represent the grammatical structure of
   the program. (Abstract Syntax Tree **(AST)**)

3. **Code Generation:** taking an AST and turning it into executable code.

JS engines don't have the luxury of an abundance of time to perform their work and optimizations, because JS compilation doesn't happen in a build step ahead of time. It usually must happen in mere microseconds (or less!) right before the code is executed. To ensure the fastest performance under these constraints, JS engines use all kinds of tricks **(like JITs, which lazy compile and even hot re-compile)**

The most important observation we can make about processing of JS programs is that it occurs in (at least) two phases:

1.  **parsing/compilation** first
2.  then **execution**

While the JS specification does not require "compilation" explicitly, it **requires behavior that is essentially only practical with a compile-then-execute approach.**

There are three program characteristics you can observe to prove this to yourself:

- syntax errors
- early errors
- hoisting

### Syntax Errors from the Start

```js
var greeting = "Hello";

console.log(greeting);

greeting = ."Hi";
// SyntaxError: unexpected token .
```

👆🏼💁🏼 the only way the JS engine could know about the syntax error on the third line, before executing the first and second lines, is by the JS engine **first parsing the entire program before any of it is executed.**

### Early Errors

```js
console.log("Howdy");

saySomething("Hello", "Hi");
// Uncaught SyntaxError: Duplicate parameter name not
// allowed in this context

function saySomething(greeting, greeting) {
  "use strict";
  console.log(greeting);
}
```

👆🏼 SyntaxError here is thrown before the program is executed. In this case, it's because **strict-mode** (opted in for only the `saySomething(..)` function here) **forbids**, among many other things, functions to have **duplicate parameter names**; this has always been allowed in non-strict-mode.

💁🏼 The code must first be fully parsed before any execution occurs: _it know that the `saySomething(..)` function is even in strict-mode while processing the parameter list (the "use strict" pragma appears only later, in the function body)_

### Hoisting

```js
function saySomething() {
  var greeting = "Hello";
  {
    greeting = "Howdy"; // error comes from here
    let greeting = "Hi";
    console.log(greeting);
  }
}

saySomething();
// ReferenceError: Cannot access 'greeting' before
// initialization
```

👆🏼 What's happening is that the `greeting` variable for that statement belongs to the declaration on the next line, `let greeting = "Hi"`, rather than to the previous `var greeting = "Hello"` statement.

💁🏼 JS engine had already processed this code in an earlier pass, and **already set up all the scopes and their variable associations.**

The ReferenceError here technically comes from `greeting = "Howdy"` accessing the `greeting` variable too early, a conflict referred to as the Temporal Dead Zone (TDZ). [👀 [Ch 5](./ch5.md) will cover this in more detail.]

## Compiler Speak

👉🏼 How the JS engine identifies variables and determines the scopes of a program as it is compiled?

```js
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" },
];

function getStudentName(studentID) {
  for (let student of students) {
    if (student.id == studentID) {
      return student.name;
    }
  }
}

var nextStudent = getStudentName(73);

console.log(nextStudent);
// Suzy
```

All occurrences of variables/identifiers in a program serve in one of two "roles":

- **target** of an assignment
- **source** of a value

👀 How do you know if a variable is a target? 👉🏼 **Check if there is a value that is being assigned to it; if so, it's a target. If not, then the variable is a source.**

💁🏼 For the JS engine to properly handle a program's variables, it must **first label each occurrence of a variable as target or source.**

### Targets

#### What makes a variable a target?

4 target assignment operations in the previous code👇🏼

```
students = [ // ..
```

```js
for (let student of students) {
```

👆🏼 That statement assigns a value to `student` for each iteration of the loop.

```js
getStudentName(73);
```

👆🏼 the argument `73` is assigned to the parameter `studentID`.

```js
function getStudentName(studentID) {
```

⭐️ A function declaration is a special case of a target reference.

👆🏼 You can think of it sort of like `var getStudentName = function(studentID)`, but that's not exactly accurate. An identifier `getStudentName` is declared (at compile time), but the `= function(studentID)` part is also handled at compilation; **the association between getStudentName and the function is automatically set up at the beginning of the scope** rather than waiting for an = assignment statement to be executed.

### Sources

In `for (let student of students)`, we said that `student` is a target, but **`students`** is a source reference.

In the statement `if (student.id == studentID)`, both **`student`** and **`studentID`** are source references. `student` is also a source reference in return `student.name`.

In `getStudentName(73)`, **`getStudentName`** is a source reference (which we hope resolves to a function reference value).

In `console.log(nextStudent)`, **`console`** is a source reference, as is **`nextStudent`**.

## Cheating: Runtime Scope Modifications

👀 It should be clear by now that scope is determined as the program is compiled, and should not generally be affected by runtime conditions.
💁🏼 However, in `non-strict-mode`, there are technically still **two ways to cheat this rule, modifying a program's scopes during runtime.**

1. **`eval(..)`** function

```js
function badIdea() {
  eval("var oops = 'Ugh!';");
  console.log(oops);
}
badIdea(); // Ugh!
```

👆🏼 If the `eval(..)` had not been present, the `oops` variable in `console.log(oops)` would not exist, and would throw a ReferenceError. But `eval(..)` modifies the scope of the `badIdea()` function at runtime.

👎🏼 Cause **performance hit of modifying the already compiled and optimized scope, every time badIdea() runs.**

1. **`with`** keyword

```js
var badIdea = { oops: "Ugh!" };

with (badIdea) {
  console.log(oops); // Ugh!
}
```

👆🏼 The global scope was not modified here, but `badIdea` was turned into a scope at runtime rather than compile time, and its property oops becomes a variable in that scope.

👎🏼 Bad for performance and readability reasons.

## Lexical Scope

- JS's scope is determined at compile time; the term for this kind of scope is **"lexical scope"**
- key idea of "lexical scope" is that it's **controlled entirely by the placement of functions, blocks, and variable declarations**, in relation to one another.
  - If you place a variable declaration inside a function, the compiler handles this declaration as it's parsing the function, and associates that declaration with the function's scope.
  - If a variable is block-scope declared `(let / const)`, then it's associated with the nearest enclosing `{ .. }` block, rather than its enclosing function (as with `var`).
  - Furthermore, a reference (target or source role) for a variable must be resolved as coming from one of the scopes that are lexically available to it; otherwise the variable is said to be "undeclared" (which usually results in an error!).
- Compilation **creates a map** of all the lexical scopes that lays out what the program will need while it executes.
  - 🪄 In other words, while scopes are **identified during compilation**, they're **not actually created until runtime**, each time a scope needs to run.
