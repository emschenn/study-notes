# Grid

📔 Handout [HERE](https://estelle.github.io/cssmastery/grid/)

- [Terminology](#terminology)
- [Setting up the Grid](#setting-up-the-grid)
  - [Properties declared on the parent](#properties-declared-on-the-parent)
  - [Display](#display)
  - [Columns and Rows](#columns-and-rows)
  - [Naming Grid Lines 🌟](#naming-grid-lines-)
  - [fr and repeat()](#fr-and-repeat)
  - [Adding gutters](#adding-gutters)
- [Placement](#placement)
  - [Understanding Grid Lines](#understanding-grid-lines)
  - [item positioning properties](#item-positioning-properties)
- [Holy Grail Layout (with Grid!)](#holy-grail-layout-with-grid)
- [Alignment](#alignment)
  - [Row alignment: `justify-items`](#row-alignment-justify-items)
  - [Column alignment: `align-items` property](#column-alignment-align-items-property)
  - [Do both: `place-items` property](#do-both-place-items-property)
  - [Aligning the Grid: `justify-content` `align-content`](#aligning-the-grid-justify-content-align-content)
  - [Implicit track sizing](#implicit-track-sizing)
- [Good Learning Grid Resources 😃](#good-learning-grid-resources-)

---

## Terminology

- **Grid lines**: The vertical and horizontal lines that divide the grid and separate the columns and rows. Start counting at 1, not 0.
- **Grid cell**: A single child or unit of a CSS grid.
- **Grid area**: Any rectangular space surrounded by four grid lines. Can contain any number of grid cells.
- **Grid track**: The space between two grid lines. This space can be horizontal or vertical: a grid row or grid column
- **Grid row**: A horizontal grid track.
- **Grid column**: A vertical grid track.
- **Gutter**: Space between two rows and two columns.

## Setting up the Grid

### Properties declared on the parent

```=css
display
grid-template-columns
grid-template-rows
grid-template-areas
grid-template (shorthand)
grid-column-gap
grid-row-gap
grid-gap
```

```=css
justify-items
align-items
justify-content
align-content
grid-auto-columns
grid-auto-rows
grid-auto-flow
grid
```

### Display

```=css
display: grid | inline-grid
```

### Columns and Rows

🌟 Defines the columns and rows of the grid with a space-separated list of values representing the track size

- `<track-list>` = `<line-name>`? [ `<track-size>` | `<track-repeat>` ]
- `<track-size>` - can be a length, a percentage, or a fraction of the free space (fr) in the grid
- `<line-name>` - ident or string

```=css
grid-template-columns: none | <track-list> | <auto-track-list>
grid-template-rows: none | <track-list> | <auto-track-list>
grid-template-columns: 200px 1fr max-content minmax(min-content, 1fr);
```

#### 👀 Example

```=css
ol {
  grid-template-columns: repeat(2, 2fr) repeat(3, 1fr) 3fr;
  grid-template-rows: 2fr 125px repeat(2, 4em);
}
```

![](https://i.imgur.com/cOKYsYL.png)

---

### Naming Grid Lines 🌟

- You can name grid lines: none, some or all of the lines
- To name, put brackets around the ident

```=css
grid-template-columns:
  [start] 150px 150px 150px [end];
```

### fr and repeat()

#### fr: Fraction Unit 🌟

describes a fraction of the **available** space

#### repeat() 🌟

repeat notation: repeat(# of repeats, length)

- **length or percentage**: % are relative to the inline size of the grid container in column grid tracks, and the block size of the grid container in row grid tracks. If size of container depends on the size of its tracks, the % is treated as auto.
- **`flex` fr**: Positive fr value specifying the track’s flex factor. Each fr'ed track takes a share of the remaining space in proportion to its flex factor.
- **max-content**: Equal to the largest of the max-contents in the grid track.
- **min-content**: Equal to the largest of the min-contents in the grid track.
- **minmax(min, max)**: 🌟 A size between min and less. If max < min, then max is ignored and minmax(min,max) is treated as min.
- **auto**: 🌟 As a maximum, identical to max-content. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track.
- **fit-content(length or percent)**: 🌟 Represents the formula min(max-content, max(auto, argument)), which is calculated similar to auto (i.e. minmax(auto, max-content)), except that the track size is clamped at argument if it is greater than the auto minimum.

### Adding gutters

Gutter size: global spacing between grid items with:

- **grid-column-gap**: vertical space between columns
- **grid-row-gap**: horizontal space between rows
- **grid-gap**: Shorthand for grid-row-gap and grid-column-gap, in that order. Can take one or two lengths or percents.

Only a single size for each axis.

#### 👀 Example

```=css
ol {
  grid-template-columns: repeat(2, 2fr) repeat(3, 1fr) 3fr;
  grid-template-rows: 2fr 125px repeat(2, 4em);
  grid-gap: 10px 30px;
}
```

![demo](https://i.imgur.com/YB9Mujc.png)

## Placement

### Understanding Grid Lines

![img](https://i.imgur.com/GON5pE6.png=300x)

<span style='color:red'> Red: </span> Grid line

<span style='color:blue'> Blue: </span> Grid item

### item positioning properties

```=css
.myItem {
    grid-row-start: 2;
    grid-row-end: 4;
    grid-column-start: 2;
    grid-column-end: 5;
}
```

```=css
.myItem {
    grid-row: 2 / 4; (row-start/row-end)
    grid-column: 2 / 5; (col-start/col-end)
}
```

```=css
.myItem {
    grid-area: 2 / 2 / 4 / 5; (row-start/col-start/row-end/col-end)
}
```

- The **`grid-area`** shorthand - grid-column-end was omitted<br/>
  d = named grid-column-start || auto

      ```=css
      grid-area: a / b / c;
      ```

  - grid-row-end and grid-column-end omitted<br/>
    c = named grid-row-start || auto<br/>
    d = named grid-column-start || auto

    ```=css
    grid-area: a / b;
    ```

    - Only grid-row-start is declared<br/>

  if grid-row-start is named, all four longhands are set to that value. Otherwise, set to auto

      ```=css
      grid-area: a / b / c;
      ```

#### 👀 Example

```=css
ol {
  grid-template-columns: 1fr [start] repeat(3, 1fr) [end]repeat(8, 1fr);
}
.myItem { background-color: pink;
  grid-area: 2 / start / 4 / end;
}
```

![](https://i.imgur.com/Joz9m9p.png)

## Holy Grail Layout (with Grid!)

```=css
body {
  display:grid;
  grid-template-columns:8em repeat(2,1fr);
  grid-template-rows:6em 2em auto auto 2em;
  grid-gap: 20px;
}
aside {
  grid-row: 3/5;
  grid-column: 1/2;
}
article:nth-of-type(1){
  grid-row: 3/4;
  grid-column: 2/4;
}
footer, header, nav {
  grid-column: 1/4;
}
```

![](https://i.imgur.com/KQ4DVDj.png)

### Named Template Areas🪄🪄🪄

```=css
body {
  grid-template-areas:
      "header header header"
      "nav article aside"
      "footer footer footer";
}
```

```=css
header {
  grid-area: header;
}
nav {
  grid-area: nav;
}
article {
  grid-area: article;
}
aside {
  grid-area: aside;
}
footer {
  grid-area: footer;
}
```

![](https://i.imgur.com/Jugjog3.png)

## Alignment

- **Container** Properties

```=css
justify-items
align-items
justify-content
align-content
grid-auto-columns
grid-auto-rows
grid-auto-flow
grid
```

- **Item** Properties

```=css
justify-self
align-self
```

### Row alignment: `justify-items`

Aligns items in the inline direction (horizontal)

- aligning all the content within each cell

```=css
justify-items: normal | stretch |
   <baseline-position> | [ <overflow-position>? <self-position> ] |
  [ legacy || [ left | right | center ] ]
```

```=css
<baseline-position> = baseline | first baseline (start) | last baseline (end)
```

```=css
<overflow-position>? <self-position> = [safe | unsafe]? [right | center | left |
   start | flex-start | flex-end | end | self-start]
```

#### `<overflow-position>`

- `safe`: If it **overflows the alignment container,** it aligns as if the alignment mode were start.

- `unsafe`:
  No matter the relative sizes overflowing, the alignment value is honored.

- `legacy`:
  **Value inherits into descendants.** Computes to inherit (if declared) or normal (if defaulting) if left | center | right not present.

### Column alignment: `align-items` property

Aligns items in the block direction (vertical)

- aligns content of all the grid cells to the content within each cell
- individual grid cell content alignment can be overwritten with align-self and justify-self.

```=css
align-items:
  baseline | center |
  end | flex-end | flex-start | left |
  normal | right | safe | self-end | self-start |
  start | stretch | unsafe
```

### Do both: `place-items` property

- shorthand for align-items and justify items
- Order matters! **align items is first.**
- If only one value is declared, will be applied to both.

```=css
place-items: <align-items>  <justify-items>
```

### Aligning the Grid: `justify-content` `align-content`

Defines how the items are aligned **with respect to the grid** if the size of all the items combined is not the same size as the container.

```=css
justify-content: baseline | center | end | flex-end | flex-start |
   left | normal | right | space-around | space-between | space-evenly | start |
   stretch | safe | unsafe
```

```=css
align-content: baseline | center | end | flex-end | flex-start |
  left | normal | right | space-between | space-evenly | start |
  stretch | safe | unsafe
```

> 🌟 **Tip:** auto track sizes (and only auto track sizes) can be stretched by the align-content and justify-content properties

```=css
.parent {
  grid-template-columns: repeat(3, 150px);
  grid-template-rows: auto;
  align-content: space-between;
  justify-content: space-evenly;
}
```

![](https://i.imgur.com/M87pG1Z.png=400x)

### Implicit track sizing

When items are placed outside of the tracks defined by grid-template-rows, grid-template-columns, and grid-template-areas, implicit grid tracks by added. These properties size those tracks

```=css
grid-auto-columns:
grid-auto-rows:
grid-auto-flow:
```

## Good Learning Grid Resources 😃

- [Grid by Example](https://gridbyexample.com/)
- [hJen Simmons's Lab](https://labs.jensimmons.com/)
