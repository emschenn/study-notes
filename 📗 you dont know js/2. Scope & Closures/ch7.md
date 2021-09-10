<h1 style="text-align:center">Using Closures 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch7.md)

- [See the Closure](#see-the-closure)
  - [Pointed Closure](#pointed-closure)
  - [Adding Up Closures](#adding-up-closures)
  - [Live Link, Not a Snapshot](#live-link-not-a-snapshot)
  - [Common Closures: Ajax and Events](#common-closures-ajax-and-events)
  - [What If I Can't See It?](#what-if-i-cant-see-it)
  - [Observable Definition](#observable-definition)
- [The Closure Lifecycle and Garbage Collection (GC)](#the-closure-lifecycle-and-garbage-collection-gc)
  - [Per Variable or Per Scope?](#per-variable-or-per-scope)
- [Illustration of Closure](#illustration-of-closure)
- [Why Closure?](#why-closure-an-example)
- [Closer to Closure](#closer-to-closure-️)

---

- **Closure builds on this approach:** for variables we need to use over time, instead of placing them in larger outer scopes, we can encapsulate (more narrowly scope) them but still preserve access from inside functions, for broader use.
  - Functions remember these referenced scoped variables via closure.
- Closure is one of the most important language characteristics ever invented in programming
  - it underlies major programming paradigms, including Functional Programming (FP), modules, and even a bit of class-oriented design.
- Getting comfortable with closure is **required for mastering JS** and effectively leveraging many important design patterns throughout your code.

## See the Closure

- Closure is a behavior of functions and **only functions.**
- For closure to be observed, a function must be invoked, and specifically it **must be invoked in a different branch of the scope chain** from where it was originally defined.

```js
// outer/global scope: RED(1)

function lookupStudent(studentID) {
  // function scope: BLUE(2)

  var students = [
    { id: 14, name: "Kyle" },
    { id: 73, name: "Suzy" },
    { id: 112, name: "Frank" },
    { id: 6, name: "Sarah" },
  ];

  return function greetStudent(greeting) {
    // function scope: GREEN(3)

    var student = students.find((student) => student.id == studentID);

    return `${greeting}, ${student.name}!`;
  };
}

var chosenStudents = [lookupStudent(6), lookupStudent(112)];

// accessing the function's name:
chosenStudents[0].name;
// greetStudent

chosenStudents[0]("Hello");
// Hello, Sarah!

chosenStudents[1]("Howdy");
// Howdy, Frank!
```

👆🏼 A closure example

- After each call to `lookupStudent(..)` finishes, it would seem like all its inner variables would be discarded and **GC**'d (garbage collected).
  - The inner function is the only thing that seems to be returned and preserved.
- **Each of those references from the inner function to the variable in an outer scope is called a closure.**
  - In academic terms, each instance of `greetStudent(..)` closes over the outer variables `students` and `studentID` .
- Closure allows `greetStudent(..)` to **continue to access those outer variables even after the outer scope is finished** (when each call to `lookupStudent(..)` completes).
  - Instead of the instances of `students` and `studentID` being GC'd, **they stay around in memory.**

### Pointed Closure

```js
var student = students.find(
  (student) =>
    // function scope: ORANGE(4)
    student.id == studentID
);
```

👆🏼 The arrow function is creating another scope bubble as well

- this arrow function passed as a callback to the array's `find(..)` method has to **hold the closure** over `studentID`, rather than `greetStudent(..)` holding that closure.
  - It's important not to skip over the fact that **even tiny arrow functions** can get in on the closure party.

### Adding Up Closures

⭐️ Closure is associated with an instance of a
function, rather than its single lexical definition.

```js
function adder(num1) {
  return function addTo(num2) {
    return num1 + num2;
  };
}

var add10To = adder(10);
var add42To = adder(42);

add10To(15); // 25
add42To(9); // 51
```

👆🏼

- Every time the outer `adder(..)` function runs, a new inner `addTo(..)` function instance is created, and for each new instance, a new closure.
  - So each inner function instance (labeled `add10To(..)` and `add42To(..)` in our program) **has its own closure **o ver its own instance of the scope environment from that execution of `adder(..)`.

Even though closure is based on lexical scope, which is handled at compile time, **closure is observed as a runtime characteristic of function instances.**

### Live Link, Not a Snapshot

⭐️ Closure is actually a live link, **preserving access to the full variable itself**.

👉🏼 _i.e.,_ By closing over a variable in a function, we can keep using that variable **(read and write)** as long as that function reference exists in the program, and from anywhere we want to invoke that function.

#### Example 1

```js
function makeCounter() {
  var count = 0;

  return function getCurrent() {
    count = count + 1;
    return count;
  };
}

var hits = makeCounter();

// later

hits(); // 1

// later

hits(); // 2
hits(); // 3
```

- The `count` variable is closed over by the inner `getCurrent()` function, which keeps it around instead of it being subjected to **GC**.
- The `hits()` function calls access and update this variable, returning an incrementing count each time.

👇🏼 Though the enclosing scope of a closure is typically from a function, that's not actually required; there only needs to be an inner function present inside an outer scope:

```js
var hits;
{
  // an outer scope (but not a function)
  let count = 0;
  hits = function getCurrent() {
    count = count + 1;
    return count;
  };
}
hits(); // 1
hits(); // 2
hits(); // 3
```

> **AUTHOR:** I deliberately defined `getCurrent()` as a function expression instead of a function declaration. This isn't about the dangerous quirks of FiB [(Ch 6)](ch6.md).

---

#### Example 2

```js
var studentName = "Frank";

var greeting = function hello() {
  // we are closing over `studentName`,
  // not "Frank"
  console.log(`Hello, ${studentName}!`);
};

// later

studentName = "Suzy";

// later

greeting();
// Hello, Suzy!
```

👆🏼 Developers sometimes might get tripped up trying to use closure to snapshot-preserve a value from some moment.

Closure is ✅ **value**-oriented ❌ **variable**-oriented.

#### Example 3

```js
var keeps = [];

for (var i = 0; i < 3; i++) {
  keeps[i] = function keepI() {
    // closure over `i`
    return i;
  };
}

keeps[0](); // 3 -- WHY!?
keeps[1](); // 3
keeps[2](); // 3
```

- A `for`-loop can trick us into thinking that each iteration gets its own new `i` variable; in fact, this program **only has one `i` since it was declared with var.**
- Of course, a single variable can only ever hold one value at any given moment. So if you want to preserve multiple values, you need a different variable for each. 👇🏼

```js
var keeps = [];

for (var i = 0; i < 3; i++) {
  // new `j` created each iteration, which gets
  // a copy of the value of `i` at this moment
  let j = i;

  // the `i` here isn't being closed over, so
  // it's fine to immediately use its current
  // value in each loop iteration
  keeps[i] = function keepEachJ() {
    // close over `j`, not `i`!
    return j;
  };
}
keeps[0](); // 0
keeps[1](); // 1
keeps[2](); // 2
```

or actually we can just 👇🏼

```js
var keeps = [];

for (let i = 0; i < 3; i++) {
  // the `let i` gives us a new `i` for
  // each iteration, automatically!
  keeps[i] = function keepEachI() {
    return i;
  };
}
keeps[0](); // 0
keeps[1](); // 1
keeps[2](); // 2
```

👆🏼 A `let` declaration in a `for` loop actually creates not just one variable for the loop, but actually **creates a new variable for each iteration of the loop.** [👀 ch5](ch5/md)

### Common Closures: Ajax and Events

Closure is most commonly encountered with **callbacks**:

```js
function lookupStudentRecord(studentID) {
  ajax(`https://some.api/student/${studentID}`, function onRecord(record) {
    console.log(`${record.name} (${studentID})`);
  });
}

lookupStudentRecord(114);
// Frank (114)
```

👆🏼

- The `onRecord(..)` callback is going to be invoked at some point in the future, after the response from the Ajax call comes back.
- This invocation will happen from the internals of the `ajax(..)` utility, wherever that comes from.
- Furthermore, when that happens, the `lookupStudentRecord(..)` call will long since have completed.

🤔 So Why then is `studentID` still around and accessible to the callback? **👉🏼✨Closure✨**

---

**Event handlers** are another common usage of closure:

```js
function listenForClicks(btn, label) {
  btn.addEventListener("click", function onClick() {
    console.log(`The ${label} button was clicked!`);
  });
}

var submitBtn = document.getElementById("submit-btn");

listenForClicks(submitBtn, "Checkout");
```

👆🏼 When the button is clicked, `label` still exists to be used.

### What If I Can't See It?

> If a tree falls in the forest but nobody is around to hear it, does it make a sound?

🤔 If a closure exists (implementation, or academic sense) but it cannot be observed in our programs, does it matter? 👉🏼 🙅🏻‍♂️ **No!**

#### Example 1

```js
function say(myName) {
  var greeting = "Hello";
  output();

  function output() {
    console.log(`${greeting}, ${myName}!`);
  }
}

say("Kyle");
// Hello, Kyle!
```

👆🏼

- The inner function `output()` accesses the variables `greeting` and `myName` from its enclosing scope.
- But the invocation of `output()` happens in that same scope, where of course `greeting` and `myName` are still available;
- 💁🏻‍♂️ That's **just lexical scope, not closure.**
- 💁🏻‍♂️ In fact, **global scope variables essentially cannot be (observably) closed over,** because they're always accessible from everywhere.

#### Example 2

```js
function lookupStudent(studentID) {
  return function nobody() {
    var msg = "Nobody's here yet.";
    console.log(msg);
  };
}

var student = lookupStudent(112);

student();
// Nobody's here yet.
```

👆🏼 Variables that are merely present but never accessed don't result in closure:

- The inner function `nobody()` doesn't close over any outer variables—it only uses its own variable `msg`.
- Even though `studentID` is present in the enclosing scope, `studentID` is not referred to by `nobody()`.
- 💁🏻‍♂️ The JS engine **doesn't need to** keep `studentID` around after `lookupStudent(..)` has finished running, so **GC** wants to clean up that memory! 👉🏼 _no observed closure here!_

#### Example 3

```js
function greetStudent(studentName) {
  return function greeting() {
    console.log(`Hello, ${studentName}!`);
  };
}

greetStudent("Kyle");

// nothing else happens
```

👆🏼 If there's no function invocation, closure can't be observed:

- The inner function is the one that could have had closure, and yet it's never invoked; the returned function here is just thrown away.
- **Even if** technically the JS engine created closure for a brief moment, it _was not observed_ in any meaningful way in this program.

### Observable Definition

⭐️ ⭐️ ⭐️ Closure is observed when **a function uses variable(s) from outer scope(s)** even while running in a scope **where those variable(s) wouldn't be accessible.**

The key parts of this definition are:

- Must be a **function** involved
- Must **reference** at least one **variable from an outer scope**
- Must be **invoked in a different branch** of the scope chain from the variable(s)

## The Closure Lifecycle and Garbage Collection (GC)

- Since closure is inherently tied to a function instance, its closure over a variable lasts **as long as there is still a reference to that function.**
- Once that final function reference is discarded, the last closure over that variable is gone, and the variable itself is GC'd.
- 💁🏻‍♂️ Closure can unexpectedly **prevent the GC of a variable** that you're otherwise done with, which **leads to run-away memory usage over time.**
  - That's why it's important to **discard function references** (and thus their closures) when they're not needed anymore.

```js
function manageBtnClickEvents(btn) {
  var clickHandlers = [];

  return function listener(cb) {
    if (cb) {
      let clickHandler = function onClick(evt) {
        console.log("clicked!");
        cb(evt);
      };
      clickHandlers.push(clickHandler);
      btn.addEventListener("click", clickHandler);
    } else {
      // passing no callback unsubscribes
      // all click handlers
      for (let handler of clickHandlers) {
        btn.removeEventListener("click", handler);
      }

      clickHandlers = [];
    }
  };
}

// var mySubmitBtn = ..
var onSubmit = manageBtnClickEvents(mySubmitBtn);

onSubmit(function checkout(evt) {
  // handle checkout
});

onSubmit(function trackAction(evt) {
  // log action to analytics
});

// later, unsubscribe all handlers:
onSubmit();
```

👆🏼

- When we call `onSubmit()` with no input on the last line, all event handlers are **unsubscribed**, and the **clickHandlers array is emptied.**
- Once all click handler function references are discarded, the closures of cb references to `checkout()` and `trackAction()` are discarded.

⭐️ When considering the overall health and efficiency of the program, unsubscribing an event handler when it's no longer needed can be even more important than the initial subscription!

### Per Variable or Per Scope?

🤔 Should we think of closure as applied **only to the referenced outer variable(s)**, or does closure **preserve the entire scope chain with all its variables?**

💁🏻‍♂️ Conceptually, closure is per variable rather than per scope. Ajax callbacks, event handlers, and all other forms of function closures are typically assumed to close over only what they explicitly reference.

#### Example 1 🤯 🤯 🤯

```js
function manageStudentGrades(studentRecords) {
  var grades = studentRecords.map(getGrade);

  return addGrade;

  // ************************

  function getGrade(record) {
    return record.grade;
  }

  function sortAndTrimGradesList() {
    // sort by grades, descending
    grades.sort(function desc(g1, g2) {
      return g2 - g1;
    });

    // only keep the top 10 grades
    grades = grades.slice(0, 10);
  }

  function addGrade(newGrade) {
    grades.push(newGrade);
    sortAndTrimGradesList();
    return grades;
  }
}

var addNextGrade = manageStudentGrades([
  { id: 14, name: "Kyle", grade: 86 },
  { id: 73, name: "Suzy", grade: 87 },
  { id: 112, name: "Frank", grade: 75 },
  // ..many more records..
  { id: 6, name: "Sarah", grade: 91 },
]);

// later

addNextGrade(81);
addNextGrade(68);
// [ .., .., ... ]
```

👆🏼

- Each time we call `addNextGrade(..)` with a new grade, we get back a current list of the top 10 grades, sorted numerically descending (see `sortAndTrimGradesList()`).
- From the end of the original `manageStudentGrades(..)` call, and between the multiple `addNextGrade(..)` calls, the grades variable is preserved inside `addGrade(..)` via closure
- `addGrade(..)` references `sortAndTrimGradesList` 👉🏼
  - That means it's also closed over that identifier, which happens to hold a reference to the `sortAndTrimGradesList()` function.
  - That second inner function has to stay around so that `addGrade(..)` can keep calling it, which also means any variables it closes over stick around—though, in this case, nothing extra is closed over there.
- `getGrade` variable (and its function) 👉🏼
  - It's referenced in the outer scope of `manageStudentGrades(..)` in the `.map(getGrade)` call. But it's not referenced in `addGrade(..)` or `sortAndTrimGradesList()`.
- (potentially) large list of student records we pass in as `studentRecords` 👉🏼
  - Is that variable closed over?
  - If it is, the array of student records is never getting GC'd, which leads to this program holding onto a larger amount of memory than we might assume.
  - But if we look closely again, none of the inner functions reference `studentRecords`.
- According to the per variable definition of closure, since `getGrade` and `studentRecords` are not referenced by the inner functions, they're not closed over. They should be freely available for GC right after the `manageStudentGrades(..)` call completes.
  - Try debugging this code in a recent JS engine, like v8 in Chrome, placing a **breakpoint** inside the `addGrade(..)` function. You may notice that the inspector does not list the `studentRecords` variable.
  - Engine **does not maintain `studentRecords` via closure!**

#### Example 2

```js
function storeStudentInfo(id, name, grade) {
  return function getInfo(whichValue) {
    // warning:
    //   using `eval(..)` is a bad idea!
    var val = eval(whichValue);
    return val;
  };
}

var info = storeStudentInfo(73, "Suzy", 87);

info("name");
// Suzy

info("grade");
// 87
```

👆🏼

- the inner function `getInfo(..)` is not explicitly closed over any of `id`, `name`, or `grade` variables.
  - And yet, calls to `info(..)` seem to still be able to access the variables, albeit through use of the `eval(..)` lexical scope cheat
- 💁🏻‍♂️ So **all the variables were definitely preserved via closure,** despite not being explicitly referenced by the inner function.
  - So does that disprove the per variable assertion in favor of per scope? 👉🏼 **Depends**

---

Many modern JS engines do apply an **optimization that _removes any variables from a closure scope_** that aren't explicitly referenced.

- However, as we see with `eval(..)`, there are situations where such an optimization cannot be applied, and the closure scope continues to contain all its original variables.
- In other words, **closure must be per scope**, **implementation wise**, and then an **optional optimization trims down the scope** to only what was closed over (a similar outcome as per variable closure).
- As recent as a few years ago, many JS engines **did not apply this optimization;**
  - it's possible your websites may still run in such browsers, especially on older or lower-end devices.
  - 💁🏻‍♂️ That means it's possible that **long-lived closures** such as event handlers may be **holding onto memory** much longer than we would have assumed.
- 🧚🏻‍♂️ In cases where a variable holds a large value (like an object or array) and that variable is present in a closure scope, if you don't need that value anymore and don't want that memory held, **it's safer (memory usage) to manually discard the value rather than relying on closure optimization/GC.**

#### Fix to Example 1

```js
function manageStudentGrades(studentRecords) {
  var grades = studentRecords.map(getGrade);

  // unset `studentRecords` to prevent unwanted
  // memory retention in the closure
  studentRecords = null;

  return addGrade;
  // ..
}
```

👆🏼

- We're not removing studentRecords from the closure scope; that we cannot control.
- We're ensuring that even if `studentRecords` remains in the closure scope, that variable is **no longer referencing the potentially large array of data;** the array can be GC'd.

> **⭐️ ⭐️ TAKEAWAY:** it's important to know where closures appear in our programs, and what variables are included. We should manage these closures carefully so we're only holding onto what's minimally needed and not wasting memory.

## Illustration of Closure

Closure is the **link-association** that connects that function to the scope/variables outside of itself, no matter where that function goes.

```js
// outer/global scope: RED(1)

function adder(num1) {
  // function scope: BLUE(2)

  return function addTo(num2) {
    // function scope: GREEN(3)

    return num1 + num2;
  };
}

var add10To = adder(10);
var add42To = adder(42);

add10To(15); // 25
add42To(9); // 51
```

<img src="https://github.com/getify/You-Dont-Know-JS/raw/2nd-ed/scope-closures/images/fig4.png" alt="book" width="300"/>

👆🏼 Visualization(I) of closure

- wherever a function is passed and invoked, closure preserves a **hidden link back to the original scope** to facilitate the access to the closed-over variables.
- It's more conceptually inspired, an academic perspective on closure.

<img src="https://github.com/getify/You-Dont-Know-JS/raw/2nd-ed/scope-closures/images/fig5.png" alt="book" width="300"/>

👆🏼 Visualization(II) of closure

- de-emphasizes "functions as first-class values," and instead embraces how functions (like all non-primitive values) are **held by reference** in JS, and assigned/passed by **reference-copy**
- A bit more implementation focused, how JS actually works.

---

Closure instead describes the magic of keeping alive a function instance, along with its whole scope environment and chain, for as long as there's at least one reference to that function instance floating around in any other part of the program.

Whichever the visualization, the observable outcomes in our program are the same.

## Why Closure? (An Example)

Imagine you have a button on a page that when clicked, should retrieve and send some data via an Ajax request:

```js
var APIendpoints = {
  studentIDs: "https://some.api/register-students",
  // ..
};

var data = {
  studentIDs: [14, 73, 112, 6],
  // ..
};

function makeRequest(evt) {
  var btn = evt.target;
  var recordKind = btn.dataset.kind;
  ajax(APIendpoints[recordKind], data[recordKind]);
}

// <button data-kind="studentIDs">
//    Register Students
// </button>
btn.addEventListener("click", makeRequest);
```

- The `makeRequest(..)` utility only receives an evt object from a click event.
  - From there, it has to retrieve the data-kind attribute from the target button element
- This works OK, but it's unfortunate (inefficient, more confusing) that the **event handler has to read a DOM attribute each time it's fired.**

Why couldn't an event handler remember this value?

👇🏼

```js
var APIendpoints = {
  studentIDs: "https://some.api/register-students",
  // ..
};

var data = {
  studentIDs: [14, 73, 112, 6],
  // ..
};

function setupButtonHandler(btn) {
  var recordKind = btn.dataset.kind;

  btn.addEventListener("click", function makeRequest(evt) {
    ajax(APIendpoints[recordKind], data[recordKind]);
  });
}

// <button data-kind="studentIDs">
//    Register Students
// </button>

setupButtonHandler(btn);
```

- With the `setupButtonHandler(..)` approach, the data-kind attribute is retrieved once and assigned to the `recordKind` variable at initial setup.
  - `recordKind` is then closed over by the inner `makeRequest(..)` click handle
- By placing `recordKind` inside `setupButtonHandler(..)` , we limit the scope exposure of that variable to a more appropriate subset of the program; storing it globally would have been worse for code organization and readability.
- Closure lets the inner `makeRequest()` function instance remember this variable and access whenever it's needed.

Building on this pattern, we could have looked up both the `URL` and `data` once, at setup:

👇🏼

```js
function defineHandler(requestURL, requestData) {
  return function makeRequest(evt) {
    ajax(requestURL, requestData);
  };
}

function setupButtonHandler(btn) {
  var recordKind = btn.dataset.kind;
  var handler = defineHandler(APIendpoints[recordKind], data[recordKind]);
  btn.addEventListener("click", handler);
}
```

- Now `makeRequest(..)` is closed over `requestURL` and `requestData` , which is a little bit **cleaner** to understand, and also slightly more **performant**.
- 💁🏻‍♂️ Two similar techniques from the Functional Programming (FP) paradigm that rely on closure are partial application and currying.
  - Briefly, with these techniques, we **alter the shape of functions that require multiple inputs so some inputs are provided up front, and other inputs are provided later**
  - the initial inputs are remembered via closure.
  - Once all inputs have been provided, the underlying action is performed.
- By creating a function instance that encapsulates some information inside (via closure), the **function-with-stored-information** can later be used directly **without needing to re-provide that input.**
  - This makes that part of the code **cleaner**, and also offers the opportunity to **label partially applied functions with better semantic names.**

## Closer to Closure 🧚🏻‍♂️

Explored two illustration models for mentally tackling closure:

- **Observational**: closure is a function instance remembering its outer variables even as that function is passed to and invoked in other scopes.
- **Implementational**: closure is a function instance and its scope environment preserved in-place while any references to it are passed around and invoked from other scopes.

Summarizing the benefits to our programs:

- Closure can improve **efficiency** by allowing a function instance to remember previously determined information instead of having to compute it each time.
- Closure can improve code **readability**, bounding scope-exposure by encapsulating variable(s) inside function instances, while still making sure the information in those variables is accessible for future use.
  - The resultant narrower, more specialized function instances are cleaner to interact with, since the preserved information doesn't need to be passed in every invocation.
