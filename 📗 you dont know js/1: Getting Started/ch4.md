<h1 style="text-align:center">The Bigger Picture 📝</h1>

### [📖](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/ch4.md)

this chapter divides the organization of the JS language into **3️⃣ main pillars**, then offers a brief **roadmap** of what to expect from the rest of the book series, and how author suggest us proceed 🏃🏻‍♂️

- [Scope and Closure](#scope-and-closure)
- [Prototypes](#prototypes)
- [Types and Coercion](#types-and-coercion)
- [With the Grain...](#with-the-grain)

## Scope and Closure

- The organization of variables into units of scope (functions, blocks) is one of the most foundational characteristics of any language
- 💁🏻‍♂️ **Lexical Scope:**
  - Scopes nest inside each other, and for any given expression or statement, only variables at that level of scope nesting, or in higher/outer scopes, are accessible.
  - Variables from lower/inner scopes are hidden and inaccessible.

---

**JS is lexically scoped**, though many claim it isn't, because of **2** particular characteristics of its model that are not present in other lexically scoped languages:

1. ⭐️ **hoisting:** when all variables declared anywhere in a scope are treated as if they're declared at the beginning of the scope.
2. ⭐️ **`var`-declared variables are function scoped** (even if they appear inside a block)

---

Other unique parts of JS:

- `let` / `const` declarations have a peculiar error behavior called the **"Temporal Dead Zone" (TDZ)** which results in **observable but unusable** variables.
- **Closure** is a natural result of lexical scope when the language has functions as first-class values,

```js
let a = "Hello";

const b = () => {
  console.log(a);
};

const c = b;

c(); // 'Hello;
```

👆🏼 When a function makes reference to variables from an outer scope, and that function is passed around as a value and executed in other scopes, it maintains access to its original scope variables; **this is closure.**

## Prototypes

- 👉🏼 JS is one of very few languages where you have the option to create objects directly and explicitly, **without first defining their structure in a class**.
- beauty and power of the prototype system: ⭐️ **the ability for two objects to simply connect with each other and cooperate dynamically** (during function/method execution) **through sharing a `this` context.**
  - **Classes:** (are just one pattern you can build on top of such power)
  - **FP**
  - ⭐️ **Behavior Delegation:** (another very different approach) is to simply embrace objects as objects, forget classes altogether, and let objects cooperate through the prototype chain.

> **🗣 AUTHOR －** _"classes aren't the only way to use objects!!"_

## Types and Coercion

- A tidal wave of interest in the broader JS community has begun to shift to **"static typing" approaches**, using type-aware tooling like _TypeScript_ or _Flow_.

> **🗣 AUTHOR －**
> JS developers should...
>
> - 👍🏼 Learn more about types
> - 👍🏼 Learn more about how JS manages type
> - 👍🏼 Type-aware tooling can help developers, assuming they have gained and used this knowledge in the first place
> - 👎🏼 Assume JS's type mechanism is bad and that we need to cover up JS's types with solutions outside the language

> **🗣 AUTHOR －** _"Even if you love TypeScript/Flow, you are not going to get the most out of those tools or coding approaches if you aren't deeply familiar with how the language itself manages value types."_

## With the Grain...

> **🗣 AUTHOR －**
>
> - 🙇🏻‍♂️ The more you follow and adhere to the guidance from these books — that you think carefully and analyze for yourself what's best in your code—the more you will stand out!
> - 🤔 Don't be afraid to go against the grain, as I have done with these books and all my teachings. Nobody can tell you how you will best make use of JS; that's for you to decide. I'm merely trying to empower you in coming to your own conclusions, no matter what they are.
> - 🤷🏻‍♂️ Work on building consensus with your fellow developers on why it's important to re-visit and re- consider an approach. But do so with just one small topic at a time, and let before-and-after code comparisons do most of the talking.
> - 💡 Always keep looking for better ways to use what JS gives us to author more readable code.
