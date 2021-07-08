# Selectors

📔 Handout [HERE](https://estelle.github.io/cssmastery/selectors/)

- [Relational selectors & Combinators](#relational-selectors--combinators)
- [Attribute Selectors](#attribute-selectors)
- [UI pseudo-classes](#ui-pseudo-classes)
- [Structural selectors](#structural-selectors)
- [Pseudo Classess](#pseudo-classess)
- [Specificity](#specificity)
- [Pseudo elements](#pseudo-elements)

---

## Relational selectors & Combinators

- 🌟 ol **>** li

child (only) selector

- 🌟 li.hasaclass **+** li

adjacent sibling immediate following li.hasaclass

- 🌟 li.hasaclass **~** li

all sibling following li.hasaclass

## Attribute Selectors

- E[attr]

Element E that has the attribute attr with any value.

- E[attr="val"]

Element E that has the attribute attr with the exact, case-sensitive if attribute is case sensitive, value val.

- E[attr|=val]

Element E whose attribute attr has a value val or begins with val- ("val" plus "-").

- 🌟 **E[attr^=val]**

Element E whose attribute attr starts with the value val.

```=css
a[href^=mailto] {background-image: url(emailicon.gif);}
a[href^=http]:after {content: " (" attr(href) ")";}
```

- 🌟 **E[attr$=val]**

Element E whose attribute attr ends in val.

```=css
a[href$=pdf] {background-image: url(pdficon.gif);}
a[href$=pdf]:after {content: " (PDF)";}
```

- E[attr*=val]

Element E whose attribute attr matches val anywhere within the attribute. Similar to E[attr~=val] above, except the val can be part of a word.

- **E[foo="bar" i]**

Only relevant if attribute value is case senstive

### 👀 Good use case 👍🏼

- show href when printing

```=css
@media print{
  abbr[title]:after {
    content: "(" attr(title) ")";
  }
  a[href^=http]:after {
    content: "(" attr(href) ")";
  }
}
```

## UI pseudo-classes

Based on current state of UI
e.g., :enabled, :disabled, :checked, :indeterminate

- Form related UI **pseudo-classes**

```=css
:default
:valid
:invalid 🌟

:required
:optional

:in-range
:out-of-range

:read-only
:read-write

:placeholder-shown

:user-error or :user-invalid
```

### 👀 Cool use case

```=css
body {counter-reset: invalidCount;}
:invalid {
  background-color: pink;
  counter-increment: invalidCount;
}
p:before {
  content: "You have " counter(invalidCount) " invalid entries";
}
```

## Structural selectors

- Target elements on the page based on their relationships to other elements in the DOM.
- Updates dynamically if page updates.
- Reduced need for extra markup, classes and IDs

```=css
:root
:empty
:blank
:nth-child()
:nth-last-child()
:first-child*
:last-child
:only-child     // for element which has only one child (based on parent)
:nth-of-type()
:nth-last-of-type()
:first-of-type
:last-of-type
:only-of-type   // for there is only one of the type(based on parent)
```

- **nth pseudo-classes**

```=css
:nth-child(3n)
:nth-last-child(odd)
:nth-of-type(5)
:nth-last-of-type(3n+1) 🌟
```

- **:root** - Selects the document root, which is < html >

  - Declare font-size on **:root** if using **rem** units
  - Style **:root** only if showing < head > (as in our exercise files)
  - In CSS4, define **Defining Variables** on root. (see Variables module)

- **:not** - Negation pseudo-class

```=css
div:not(.excludeMe)
div:not(.excludeMe):not(.excuseYou)
div:not(.excludeMe, .excuseYou) // Safari Only
```

- :matches(s1, s2)

```=css
li:matches([title], [role]) a {} // Safari only

li[title] a,
li[role] a {}
```

- **:has** - Parent Selectors (unsupported yet 🥲)

```=css
header:has(h1, h2, h3, h4, h5, h6)       // Contains a header
header:not(:has(h1, h2, h3, h4, h5, h6)) // Contains no headers
header:has(:not(h1, h2, h3, h4, h5, h6)) // Contains something that is not a header
```

## Pseudo Classess

- **Linguistic** 🌟

```=css
:lang(*-ch)     // any chinese language in HTML
:dir(ltr|rtl)   // direction form left to right and vice versa
```

- **Link** - a with an href attribute

```=css
:link
:visited

:any-link // :matches(:link, :visited)
```

- **User Action**
  - 🌟 Always style **:focus** when you style **:hover**
  - 🚫 Never, ever, ever do `*:focus { outline: none; }`

```=css
:hover
:active
:focus
```

- Drag and Drop

```=css
:drop               // drop targets while the user is “dragging”.Unfortunately, dropzone attribute is not yet supported
:drop(active)       // current drop target for the drag operation.
:drop(valid)        // drop target is valid for the object currently being dragged, like correct filetype.
:drop(invalid)      // drop target is invalid for the object currently being dragged, i.e. doesn't except the filetype of object being dragged.
:drop(valid active) // matches active drop target if it’s valid
```

- Target

```=css
:target

myPage.html#anchor

<div id="anchor">ipsum lorem....

div:target::first-line {
  font-weight: bold;
}
```

## Specificity

![CSS Specificity](https://i.imgur.com/M9QZEs1.jpg)

### How it works

- `0-0-0`: Global selector
- `1-0-0`: ID selector
- `0-1-0`: Class selector (Also attribute selector & pseudoclass)
- `0-0-1`: Element Selector

### 🚫 Avoid !important

- Hacking specificity

```=css
.disabled {cursor: default !important;}
p.btn {cursor: pointer;}
```

- v.

```=css
.disabled.disabled.disabled {cursor: default;}
p.btn {cursor: pointer;}
```

## Pseudo elements

- **Pseudo-classes** select elements that already exist.
- **Pseudo-elements** create "faux" elements you can style.

```=css
::first-line
::first-letter 🌟
::selection (not in specification) 🌟
```

- **Generated Content**

```=css
p:before {
  content: "before content - ";
  font-weight: bold;
}
p:after{
  content: " - after content";
  font-weight: bold;
}
<p>the content</p>
```

→ **before content -** the content **- after content**

- **Additional Pseudo-elements**

Highlight Pseudo-elements:

```=css
::selection
::inactive-selection
::spelling-error
::grammar-error
```

Other Pseudo-elements:

```=css
::marker
::placeholder
::content
```
