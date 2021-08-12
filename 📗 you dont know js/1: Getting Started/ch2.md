<h1 style="text-align:center"> Surveying JS 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/ch2.md)

## Each File is a Program

- Each standalone file is its own separate program.
- Since JS treats files as programs, one file may fail (during parse/compile or execution) and that will not necessarily prevent the next file from being processed. (其他 may 仍會執行)
- It's important to **_ensure that each file works properly, and that to whatever extent possible, they handle failure in other files as gracefully as possible._**
- Using build process tools (like **webpack**) that end up combining separate files from the project into a single file to be delivered to a web page.
  - When this happens, JS treats this single combined file as the entire program.

---

- The **only way** multiple standalone .js files act as a single program is by sharing their state (and access to their public functionality) via the **"global scope."**
- Since **ES6**, JS has also supported a **module format**
  - Modules are also file-based.
  - If a file is loaded via module-loading mechanism such as an `import` statement or a `<script type=module>` tag, all its code is treated as a single module.

---

> **REMINEDERS** 💡 Regardless of which code organization pattern (and loading mechanism) is used for a file (standalone or module), you should still think of each file as its own (mini) program, _which may then cooperate with other (mini) programs to perform the functions of your overall application._

## Values

- strings, numbers, and booleans
- ⭐️ **`null`** and **`undefined`**

  - While there are differences between them (some historic and some contemporary), for the **most part both values serve the purpose of indicating emptiness (or absence) of a value**.

    > **REMINEDERS** 💡 it's safest and best to use only `undefined` as the single empty value

- **symbol**
  - a special-purpose value that behaves as a hidden unguessable value.
  - are almost exclusively used as special keys on objects
  - You won't encounter direct usage of symbols very often in particular JS programs. They're mostly used in low-level code such as in libraries and frameworks.

### Type Determination

```=js
typeof 42;                  // "number"
typeof "abc";               // "string"
typeof true;                // "boolean"
⭐️ typeof undefined;           // "undefined"
⭐️⭐️ typeof null;                // "object" -- oops, bug!
typeof { "a": 1 };          // "object"
⭐️ typeof [1,2,3];             // "object"
⭐️ typeof function hello(){};  // "function"
```

## Variables

- The **`var`** keyword declares a variable to be used in that part of the program, and optionally allows an initial assignment of a value.
- The **`let`** allows a more limited access to the variable than `var` . This is called **"block scoping"** as opposed to regular or function scoping.

```=js
var adult = true;
if (adult) {
    var myName = "Kyle";
    let age = 39;
    console.log("Shhh, this is a secret!");
}
console.log(myName); // Kyle
console.log(age); // Error!
```

- **Block-scoping** (`let`) is very useful for _limiting how widespread variable declarations are in our programs,_ which helps prevent accidental overlap of their names.
- But `var` is still useful in that it communicates _"this variable will be seen by a wider scope (of the whole function)"._

---

- A third declaration form is **`const`** . It's like let but has an additional limitation that it must be given a value at the moment it's declared, and _cannot be re- assigned a different value later._
  - `const` declared variables are ❌ **not "unchangeable"**, they ✅ **just cannot be re- assigned**.
  - 🙅🏽 So don't use const like that:
    `const actors = [ "Morgan Freeman", "Jennifer Aniston" ]; actors[2] = "Tom Cruise"; // OK :( actors = []; // Error!`
    > **REMINEDERS** 💡 The best semantic use of a const is when you have a _simple primitive value_ that you want to give a useful name to!

---

### Declare identifiers (variables) in various scopes:

```
function hello(name){
  console.log(`Hello ${name}`)
}

hello("katy")       // 'Hello katy'
console.log(hello)  // ƒ hello()
console.log(name)   // ''
```

- The identifier `hello` is created in the outer scope, and it's also automatically associated so that it references the function.
- But the named parameter `myName` is created only inside the function, and thus is only accessible inside that function's scope.
- ⭐️⭐️⭐️ **_hello_ and _myName_ generally behave as `var` -declared.**

```=js
try {
    someError();
} catch (err) {
    console.log(err);
}


console.log(err)    // ReferenceError: err is not defined
```

- ⭐️⭐️⭐️ The `err` is a **block-scoped** variable that exists only inside the catch clause, as if it had been declared with let .

## Functions

- In JS, we should consider "function" to take the broader meaning of another related term: "**procedure**."
- It's extremely important to note that in JS, **functions are values that can be assigned** (as shown in this snippet) **and passed around.**

## Comparisons

```
⭐️ 3 === 3.0;              // true
"yes" === "yes";        // true
null === null;          // true
false === false;        // true

42 === "42";            // false
"hello" === "Hello";    // false
true === 1;             // false
0 === null;             // false
⭐️⭐️⭐️ "" === null;            // false
⭐️⭐️⭐️ null === undefined;     // false
```

- **All value comparisons in JS consider the type of the values being compared**, not just the `===` operator.
- Specifically, `===` **disallows any sort of type conversion (aka, "coercion") in its comparison**, where other JS comparisons (`==`) do allow coercion.

### comparisons of `NaN` and `-0`

```=js
NaN === NaN;            // false
0 === -0;               // true
```

- In the case of `NaN` , the `===` operator lies and says that an occurrence of NaN is not equal to another `NaN`.
- In the case of `-0` (yes, this is a real, distinct value you can use intentionally in your programs !), the `===` operator lies and says it's equal to the regular 0 value.
- 🪄 **It's best to avoid using `===` for `0` and `NaN`**
  - NaN 👉🏼 `Number.isNaN(...) `
  - -0 👉🏼 `Object.is(...) `
  - you could think of `Object.is(..)` as the "quadruple- equals" `====` , the **really-really-strict comparison!**

### ⭐️ comparisons of object values

```=js
[ 1, 2, 3 ] === [ 1, 2, 3 ];    // false
{ a: 42 } === { a: 42 }         // false
(x => x * 2) === (x => x * 2)   // false
```

- when it comes to objects, a content-aware comparison is generally referred to as "structural equality."
- JS does not define `===` as ❌ **structural equality for object values**. Instead, `===` uses ✅ **identity equality** for object values.

```=js
var x = [ 1, 2, 3 ];
// assignment is by reference-copy, so
// y references the *same* array as x,
// not another copy of it. var y = x;

y === x;              // true
y === [ 1, 2, 3 ];    // false
x === [ 1, 2, 3 ];    // false
```

- The array structure and contents don't matter in this comparison, only the **reference identity.**
- JS does not provide a mechanism for structural equality comparison of object values, only reference identity comparison.

---

### Coercive Comparisons

```=js
42 == "42";             // true
1 == true;              // true
```

**Coercion** means a value of one type being converted to its respective
representation in another type (to whatever extent possible).

- ⭐️ the `==` differs from `===` in that **it allows coercion before the comparison.**
  - In other words, they both want to compare values of like types, but `==` allows type conversions first, and once the types have been converted to be the same on both sides, then `==` does the same thing as `===`.
  - Instead of "loose equality," the `==` operator should be
    described as **"coercive equality."**

---

```
var arr = [ "1", "10", "100", "1000" ];
for (let i = 0; i < arr.length && arr[i] < 500; i++) {
    // will run 3 times
}
```

👆🏼 The `arr[i] < 500` **invokes coercion,** though, because the arr[i] values are all strings. Those comparisons thus become 1 < 500 , 10 < 500 , 100 < 500 , and 1000 < 500

```=jsx
var x = "10";
var y = "9";

⭐️ x < y;      // true, watch out!
```

👆🏼 These relational operators typically use numeric comparisons, except in the case where **both values being compared are already strings;** in this case, they use **alphabetical** (dictionary-like) comparison of the strings!

> **REMINEDERS** 💡 There's no way to get these relational operators to avoid coercion, other than to just never use mismatched types in the comparisons.

## Organize in JS

Two major patterns for organizing code (data and behavior) are used broadly across the JS ecosystem: **classes** and **modules**.

🪄 Being proficient in JS requires understanding both patterns and where they are appropriate (and not!)

### Classes

- A class in a program is a definition of a "type" of custom data structure that includes both data and behaviors that operate on that data.
- A class must be instantiated (with the `new` keyword) one or more times.

#### Inheritance / Polymorphism

```
class Publication {
    constructor(title,author,pubDate) {
        this.title = title;
        this.author = author;
        this.pubDate = pubDate;
    }

    print() {
        console.log(`
            Title: ${ this.title }
            By: ${ this.author }
            ${ this.pubDate }
        `);
    }
}
```

```
class Book extends Publication {
    constructor(bookDetails) {
        ⭐️ super(
            bookDetails.title,
            bookDetails.author,
            bookDetails.publishedOn
        );
        this.publisher = bookDetails.publisher;
        this.ISBN = bookDetails.ISBN;
    }

    print() {
        ⭐️ super.print();
        console.log(`
            Publisher: ${ this.publisher }
            ISBN: ${ this.ISBN }
        `);
    }
}

class BlogPost extends Publication {
    constructor(title,author,pubDate,URL) {
        super(title,author,pubDate);
        this.URL = URL;
    }

    print() {
        super.print();
        console.log(this.URL);
    }
}
```

- Both Book and BlogPost use the `extends` clause to extend the general definition of Publication to include additional behavior.
- The `super(..)` call in each constructor delegates to the parent Publication class's constructor for its initialization work, and then they do more specific things according to their respective publication type (aka, "sub-class" or "child class").

👉🏼 The fact that **both the inherited and overridden methods can have the same name and co-exist** is called **polymorphism**.

### Modules

- The module pattern has essentially the same goal as the class pattern, which is to group data and behavior together into logical units.
- Also like classes, modules can "include" or "access" the data and behaviors of other modules, for cooperation's sake.

But modules have some important differences from classes:

#### ⭐️ Classic Modules

- The key hallmarks of a classic module are an outer function (that runs at least once), which **returns an "instance" of the module with one or more functions exposed that can operate on the module instance's internal (hidden) data.**
- Because a module of this form is just a function, and calling it produces an **"instance"** of the module, another description for these functions is **"module factories".**

```=jsx
function Publication(title,author,pubDate) {
    var publicAPI = {
        print() {
            console.log(`
                Title: ${ title }
                By: ${ author }
                ${ pubDate }
            `);
        }
    };

    return publicAPI;
}

function Book(bookDetails) {
    var pub = Publication(
        bookDetails.title,
        bookDetails.author,
        bookDetails.publishedOn
    );

    var publicAPI = {
        print() {
            pub.print();
            console.log(`
                Publisher: ${ bookDetails.publisher }
                ISBN: ${ bookDetails.ISBN }
            `);
        }
    };

    return publicAPI;
}

function BlogPost(title,author,pubDate,URL) {
    var pub = Publication(title,author,pubDate);

    var publicAPI = {
        print() {
            pub.print();
            console.log(URL);
        }
    };

    return publicAPI;
}
```

- There are other variations to this factory function form that are quite common across JS, even in 2020; you may run across these forms in different JS programs:
  - AMD (Asynchronous Module Definition)
  - UMD (Universal Module Definition)
  - CommonJS (classic Node.js-style modules).
- The variations are minor (not quite compatible). However, all of these forms rely on the same basic principles.

#### Comparison w class

|                | Class                                                                                              | Module                                                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| retrive data   | form stores methods and data on an object instance, whichmust be accessed with `this` prefix       | methods and data are accessed as identifier variables in scope                                                                                                   |
| public/private | the "API" of an instance is implicit in the class definition—also, all data and methods are public | explicitly create and return an object with any publicly exposed methods, and any data or other unreferenced methods remain private inside the factory function. |

#### ⭐️⭐️ ES Modules (since ES6)

- ES modules (ESM), introduced to the JS language in ES6, are **meant to serve much the same spirit and purpose as the existing classic modules just described, especially taking into account important variations and use cases from AMD, UMD, and CommonJS.**

1. First, there's no wrapping function to define a module. The wrapping context is a file. **ESMs are always file-based; one file, one module.**

2. Second, you don't interact with a module's "API" explicitly, but rather use the `export` keyword to add a variable or method to its public API definition. If something is defined in a module but not exported, then it stays hidden (just as with classic modules).

3. Third, and maybe most noticeably different from previously discussed patterns, **you don't "instantiate" an ES module, you just import it to use its single instance.** ESMs are, in effect, "**singletons**," in that there's only one instance ever created, at first import in your program, and all other imports just receive a reference to that same single instance. _If your module needs to support multiple instantiations, you have to provide a classic module-style factory function on your ESM definition for that purpose._

##### Example

Consider the file `publication.js`:

```
function printDetails(title,author,pubDate) {
    console.log(`
        Title: ${ title }
        By: ${ author }
        ${ pubDate }
    `);
}

export function create(title,author,pubDate) {
    var publicAPI = {
        print() {
            printDetails(title,author,pubDate);
        }
    };

    return publicAPI;
}
```

To import and use this module, from another ES module like `blogpost.js`:

```=js
import { create as createPub } from "publication.js";

function printDetails(pub,URL) {
    pub.print();
    console.log(URL);
}

export function create(title,author,pubDate,URL) {
    var pub = createPub(title,author,pubDate);

    var publicAPI = {
        print() {
            printDetails(pub,URL);
        }
    };

    return publicAPI;
}
```

And finally, to use this module, we import into another ES module like `main.js`:

```=js
import { create as newBlogPost } from "blogpost.js";

var forAgainstLet = newBlogPost(
    "For and against let",
    "Kyle Simpson",
    "October 27, 2014",
    "https://davidwalsh.name/for-and-against-let"
);

forAgainstLet.print();
// Title: For and against let
// By: Kyle Simpson
// October 27, 2014
// https://davidwalsh.name/for-and-against-let
```
