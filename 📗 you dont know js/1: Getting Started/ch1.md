<h1 style="text-align:center">What is Javascript 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/ch1.md)

- [Why the name?](#why-the-name)
- [About the language...](#about-the-language)
- [The Gaps](#the-gaps)
  - [Transpiling](#-transpiling-new---old)
  - [Polyfill](#-polyfill-old---new)
- [Interpreted or Compiled?](#js-interpreted-script-or-a-compiled-program)
- [WASM](#wasm)
- [`"use strict"` mode](#use-strict--mode)

## Why the name?

Because this language was originally designed to _appeal to an audience_ of mostly **Java** programmers, and because the word "**script**" was popular at the time to refer to _lightweight programs._

- the JavaScript/JS that runs in your browser or in Node.js, is an implementation of the ES2019 standard.
  - can be called ✅ **JS, ECMAScript, ES2019** ❌ **JS6, ES8**

## About the language...

- JS's syntax and behavior are defined in the ES specification.
  - decied by **[TC39](https://tc39.es/), the technical steering committee** that manages JS
  - All major browsers and device makers have committed to keeping their JS implementations compliant with this one central specification.

---

- While the array of environments that run JS is constantly expanding _(from browsers, to servers (Node.js), to robots, to lightbulbs, to...)_, the one environment that rules JS is the **web**.
  - i.e., how JS is implemented for web browsers is, in all practicality, the only reality that matters.
- Various JS environments _(like browser JS engines, Node.js, etc.)_ add **APIs into the global scope** of your JS programs that give you environment-specific capabilities.
  - e.g., an `alert(..)` call is JS, but alert itself is really just a guest, not part of the official JS specification.
- The **developer console** is not trying to pretend to be a JS compiler that handles your entered code exactly the same way the JS engine handles a `.js` file 👉🏼 **They prioritize DX** (Developer Experience)

---

- JavaScript is most definitely a **multi-paradigm** language.
  - i.e., You can write procedural, class-oriented, or FP-style code, and you can make those decisions on a line-by-line basis instead of being forced into an all-or-nothing choice.
- ✅ JavaScript is preservation of **backwards compatibility**.
  - i.e., JS developers can write code with confidence that their code won't stop working unpredictably because a browser update is released
  - **Once it's in JS, it can't be taken out because it might break programs**, even if we'd really, really like to remove it!
- ❌ JS is not **forwards-compatible.**
  - i.e., including a new addition to the language in a program would cause the program to break if it were run in an older JS engine.
  - HTML and CSS, by contrast, are forwards-compatible but not backwards- compatible.
  - (since the language design can skip over the unrecognized CSS/HTML, while the rest of the CSS/HTML would be processed accordingly.)

## The Gaps

Since JS is **\*not** forwards-compatible\*, it means that there is a change that you will write that's valid JS, and the oldest engine that your site or application can't support.
👉🏼 It mean that JS developers need to **take special care to address this gap.**

### 🛠 Transpiling (new -> old)

Transpiling is a contrived and community-invented term to describe **using a tool to convert the source code of a program from one form to another** _(but still as textual source code)._

Typically, forwards-compatibility problems related to syntax are solved by using a transpiler, the most common one:

- [Babel](https://babeljs.io): convert from that newer JS syntax version to an equivalent older syntax.

> **REMINEDERS** 💡 Developers should focus on writing the clean, new syntax forms, and let the tools take care of producing a forwards-compatible version of that code

### 🛠 Polyfill (old -> new)

Polyfill is to provide a **definition for that missing API method that stands in** and acts as if the older environment had already had it natively defined.

- **Transpilers** like Babel typically detect which poly fills your code needs and provide them automatically for you.
- But _occasionally_ you may need to include/define them explicitly, which works similar to the snippet we just looked at.

> **REMINEDERS** 💡 Since JS isn't going to stop improving, the gap will never go away. Both techniques should be embraced as a standard part of every JS project's production chain going forward.

## JS: `Interpreted` script or a `Compiled` program?

The real reason it matters to have a clear picture on whether JS is interpreted or compiled **relates to the nature of how errors are handled.**

![](https://github.com/getify/You-Dont-Know-JS/raw/2nd-ed/get-started/images/fig3.png)

1. After a program leaves a developer's editor, it gets **transpiled by Babel**, then **packed by Webpack** (and perhaps half a dozen other build processes), then it gets delivered in that very different form to a JS engine.
2. The JS engine parses the code to an **AST**(Abstract Syntax Tres).
3. Then the engine converts that AST to a kind-of byte code, a **binary intermediate representation** (IR), which is then refined/converted even further by the **optimizing JIT compiler**.
4. Finally, the JS VM executes the program.

the reason that matters is, since JS is compiled, **we are informed of static errors (such as malformed syntax) before our code is executed.** That is a substantively different interaction model than we get with traditional "scripting" programs

## WASM

(to be modified)

## `"use strict"` mode

- Back in 2009 with the release of ES5, JS added strict mode as an opt-in mechanism for **encouraging better JS programs**.
- (along with the tool like linter) often helps **collaboration** on code by avoiding some of the more problematic mistakes that slip by in non-strict mode.
- Reminding you how JS should be written to have the highest quality and best chance at performance.
- ES6 modules assume strict mode, so all code in such files is automatically **defaulted to strict mode.**
