<h1 style="text-align:center">Illustrating Lexical Scope 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch2.md)

- [In Metaphor...](#in-metaphor)
  - [KEY Takeaway 🗝](#key-takeaway-)
- [In Conversation...](#in-conversation)
  - [KEY Takeaway 🗝](#key-takeaway--1)
- [Nested Scope](#nested-scope)
  - [Lookup Failures](#lookup-failures)

The goal here is to think about how your program is handled by the JS engine in ways that more closely align with **_how the JS engine actually works_**.

## In Metaphor...

- Variable <-> Marble (🟢, 🔵, 🔴...)
- Sockets <-> Bucket (🪣)

The color of each marble is thus determined by which color scope we find the marble originally created in.

```=jsx
// outer/global scope: RED

var students = [
    { id: 14, name: "Kyle" },
    { id: 73, name: "Suzy" },
    { id: 112, name: "Frank" },
    { id: 6, name: "Sarah" }
];

function getStudentName(studentID) {
    // function scope: BLUE

    for (let student of students) {
        // loop scope: GREEN

        if (student.id == studentID) {
            return student.name;
        }
    }
}

var nextStudent = getStudentName(73);
console.log(nextStudent);   // Suzy
```

- 🔴 RED (outermost global scope)
- 🔵 BLUE (scope of function getStudentName(..))
- 🟢 GREEN (scope of/inside the for loop).

<img src="https://github.com/getify/You-Dont-Know-JS/raw/2nd-ed/scope-closures/images/fig2.png" alt="example" width="500"/>

- Scope bubbles are **determined during compilation** based on where the functions/blocks of scope are written, the nesting inside each other, and so on.
- Each scope bubble is entirely contained within its parent scope bubble—a scope is **never partially in two different outer scopes**.
- 💡 Remember we asserted in [Ch 1](./ch1.md) that `id` , `name` , and `log` **are all properties, not variables**; in other words, they're not marbles in buckets, so they don't get colored based on any the rules we're discussing in this book.
- ⭐️ **References (non-declarations) to variables/identifiers are allowed if there's a matching declaration either in the current scope,** or any scope **above/outside** the current scope, but not with declarations from lower/nested scopes.

> 📝 **The JS engine doesn't generally determine these marble colors during runtime!** <br/> the _"lookup"_ here is a rhetorical device to help you understand the concepts. During **compilation**, most or all variable references will match already-known scope buckets, so their color is already determined, and stored with each marble reference to avoid unnecessary lookups as the program runs. 👀 More on [ch3](./ch3.md)

---

### KEY Takeaway 🗝

- **Variables are declared in specific scopes,** which can be thought of as colored marbles from matching-color buckets.
- **Any variable reference that appears in the scope where it was declared, or appears in any deeper nested scopes, will be labeled a marble of that same color**—unless an intervening scope "shadows" the variable declaration; see _"Shadowing"_ in [Ch 3](./ch3.md).
- The determination of colored buckets, and the marbles they contain, happens **during compilation**. This information is used for variable (marble color) "lookups" during code execution.

## In Conversation...

- **Engine**: _responsible for start-to-finish compilation_ and _execution_ of our JavaScript program.
- **Compiler**: one of Engine's friends; handles all the dirty work of _parsing and code-generation_ (see previous section).
- **Scope Manager**: another friend of Engine; _collects and maintains a lookup list_ of all the declared variables/identifiers, and enforces a set of rules as to how these are accessible to currently executing code.

```=jsx
var students = [
    { id: 14, name: "Kyle" },
    { id: 73, name: "Suzy" },
    { id: 112, name: "Frank" },
    { id: 6, name: "Sarah" }
];
```

👆🏼👇🏼 The steps **Compiler** will follow to handle that statement:

1. Encountering `var students`, **Compiler** will ask **Scope Manager** to see if a variable named students already exists for that particular scope bucket.

   - If so, **Compiler** would ignore this declaration and move on.
   - Otherwise, **Compiler** will produce code that _(at execution time)_ **asks Scope Manager** to create a new variable called students in that scope bucket.

2. **Compiler** then produces code for **Engine** to later execute, to handle the `students = []` assignment.
   - The code **Engine** runs will first **ask Scope Manager** if there is a variable called students accessible in the current scope bucket.
   - If not, **Engine keeps looking** elsewhere (see "Nested Scope" below). Once **Engine** finds a variable, it **assigns the reference** of the `[ .. ]` array to it.

---

### KEY Takeaway 🗝

1. **Compiler sets up the declaration of the scope variable** (since it wasn't previously declared in the current scope).
2. While Engine is executing, to process the assignment part of the statement, Engine asks Scope Manager to look up the variable, ⭐️⭐️ **initializes it to `undefined` so it's ready to use, and then assigns the array value to it.**

## Nested Scope

Scopes can be lexically nested to any arbitrary depth as the program defines.

- **Each scope gets its own Scope Manager instance each time that scope is executed** (one or more times).
- Each scope automatically **has all its identifiers registered at the start of the scope being executed** (called "variable
  hoisting"; see [Ch5](./ch5.md)).

---

At the beginning of a scope

- If any identifier came from a `function` declaration, that variable is automatically initialized to its associated function reference.
- If any identifier came from a `var` declaration, that variable is automatically initialized to `undefined` so that it can be used
- otherwise (`let`/`const`), the variable **remains uninitialized** (aka, in its "TDZ," see [ch5](./ch5.md)) and cannot be used until its **full declaration-and-initialization** are executed.
  <br/> <br/>
  🗝
- One of the key aspects of lexical scope is that any time an identifier reference **cannot be found in the current scope, the next outer scope in the nesting is consulted;** that process is **repeated** until an answer is found or there are no more scopes to consult 🔁

### Lookup Failures

When Engine exhausts all lexically available scopes (moving outward) and still cannot resolve the lookup of an identifier, an error condition then exists.

However, depending on

- the mode of the program (`strict-mode` or not)
- role of the variable (i.e., target vs. source; see [ch1](./ch1.md))

this error condition will be handled differently.

#### Undefined Mess

- If the variable is a **source**, an unresolved identifier lookup is considered an undeclared (unknown, missing) variable ➡️ `ReferenceError` being thrown.
- If the variable is a **target**, and the code at that moment is running in **strict-mode** ➡️ the variable is considered undeclared and similarly throws a `ReferenceError`.

👀 To perpetuate the confusion even further, JS's `typeof` operator returns the string `"undefined"` for variable references in either state:

```=js
var studentName;
typeof studentName;     // "undefined"

typeof doesntExist;     // "undefined"
```

👆🏼 The terminology mess is confusing and terribly unfortunate. Unfortunately, JS developers just have to pay close attention to not mix up which kind of "undefined" they're dealing with! 🥲

#### Global ⁉️

If the variable is a **target** and **non strict-mode**, the troublesome outcome is that the global scope's Scope Manager will just create an **accidental global variable** to fulfill that target assignment!

```=jsx
function getStudentName() {
    // assignment to an undeclared variable :(
    nextStudent = "Suzy";
}

getStudentName();

console.log(nextStudent);
// "Suzy" -- oops, an accidental-global variable!
```

🗣

> **Engine:** Hey, Scope Manager (for the global scope), I have a target reference for nextStudent, ever heard of it?

#### `non-strict mode` response

> **(Global) Scope Manager:** Nope, but since we're in non-strict-mode, I helped you out and just created a global variable for you, here it is!

#### `strict mode` response

> **(Global)** Scope Manager: Nope, never heard of it. Sorry, I've got to throw a ReferenceError.

💡 Never rely on accidental global variables. Always use `strict-mode`, and always formally declare your variables!!
