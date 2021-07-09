# Flexbox

📔 Handout [HERE](https://estelle.github.io/cssmastery/flexbox/)

- [Components of Flexbox](#components-of-flexbox)
- [The Basics using Flex](#the-basics-using-flex)
- [The Flex Container](#the-flex-container)
- [The Flex Item](#the-flex-item)
- [Flexibility](#flexibility)

---

## Components of Flexbox

- **Creation:** display
- **Direction:** flex-flow (flex-direction, flex-wrap)
- **Alignment:** justify-content, align-items, align-self, align-content
- **Ordering:** order
- **Flexibility:** flex (flex-grow, flex-shrink, flex-basis)

## The Basics using Flex

1. Add `display: flex;` to the parent of the elements to be flexed.
2. Set `flex-direction` to horizontal or vertical
3. Set `flex-wrap` to control wrap direction

- **block-level** flex container box

```=css
display: flex;
```

- **inline-level** flex container box

```=css
display: inline-flex;
```

### What is a flex item

- Flex items
  - All non-absolutely positioned child nodes
  - Generated Content
  - anonymous flex items => non-empty text nodes
- Not flex items
  - ::first-line & ::first-letter
  - white space
- Kind of
  - absolutely/fixed positioned elements

### Impacted CSS Properties

- Changed Properties
  - `margin`: adjacent flex items margins do not collapse
  - `min-width` & `min-height`: default is auto, not 0
  - `visibility`: collapse;
- Ignored Properties
  - column-\* properties
  - float
  - clear
  - vertical-align

### Flex Properties

- `flex-direction`

  - row
  - row-reverse
  - column
  - column-reverse

- `flex-wrap`

  - nowrap
  - wrap
  - wrap-reverse

- `flex-flow`: Shorthand for flex-direction and flex-wrap

  ```=css
  flex-flow: row-reverse  wrap;
  ```

## The Flex Container

☝🏼 Controlling Flex Items from the flex container

- `justify-content`: aligns flex items along the main axis (horizontal)

  - flex-start
  - flex-end
  - center
  - space-between
  - space-around
  - space-evenly

- `align-items`: aligns flex items along the cross axis (vertical)

  - flex-start
  - flex-end
  - center
  - baseline
  - stretch

- `align-content`: Only applies to multi-line flex containers.
  - flex-start
  - flex-end
  - center
  - space-between
  - space-around
  - space-evenly
  - **stretch**

## The Flex Item

☝🏼 Controlling Flex Items **from the flex items themselves**

- `align-self`: Override the align-items on a per flex item basis

  - auto
  - flex-start
  - flex-end
  - center
  - baseline
  - stretch

- `order` 🌟

  **The default value is 0.** Anything lower will come before those without set values. Anything above will come after.

  ```=css
  div:nth-of-type(3n) {
  order: -1;
  }
  ```

## Flexibility

- **flex-grow:** How to divide the extra space. Non-negative number. default: 1.
- **flex-shrink:** How to shrink if there's not enough room. Non-negative number. default: 1.
- **flex-basis:** the starting size before free space is distributed. length value, content or auto . If set to auto, sets to flex item’s main size property.

e.g.,

```=css
  flex: 1 0 220px;
  // by default make it 220px and
  // if there's any room to grow, divide it evenly that have the same growth factor(1)
```

e.g.,

![eg](https://i.imgur.com/fwjQ13v.png)

> each div is 20% (but the default flex-grow=1)

> b.width = a.width \* 2 (since 40%/20%)
