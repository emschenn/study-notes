# 📖 Introduction to D3.js

> _Notes and codes for [Introduction to D3.js
> ](https://frontendmasters.com/courses/d3/) taught by Shirley Wu at FrontendMaster._

- [Draw a svg ](#draw-a-svg--here)
- [Select svg and bind data ](#select-svg-and-bind-data--here)
- [Dynamically generate svg ](#dynamically-generate-svg--here)
- [D3.js scales ](#d3js-scales--here)
- [Group elements ](#group-elements--here)
- [DOM Manipulation & Transition](#dom-manipulation--transition--here)
- [Positioning Functions ](#positioning-functions--here)
- [D3 & HTML](#d3--html)
- [Refernece](#refernece)

## Draw a svg [📔 here](https://observablehq.com/@sxywu/1-draw-a-flower-petal-on-the-screen?collection=@sxywu/introduction-to-d3-js)

```=css
<svg width=100 height=100 style='overflow: visible; margin: 5px;'>
  <path d='M0,0 C50,40 50,70 20,100 L0,85 L-20,100 C-50,70 -50,40 0,0'
    fill='none' stroke='#000' stroke-width=2 transform='translate(50,0)' />
</svg>
```

![](https://i.imgur.com/ZAhuLKd.png)

## Select svg and bind data [📔 here](https://observablehq.com/@sxywu/2-select-existing-petal-s-and-bind-movie-data)

### Selection

Takes in a selector string or DOM element and returns a D3.js selection.

- d3.select(selector)
- d3.selectAll(selector)
- selection.select(selector)
- selection.selectAll(selector)

`d3.select()` and `d3.selectAll()` query the entire DOM. `selection.select()` and `selection.selectAll()` are restricted to the descendents of the selection.

### Bind Data

- selection.datum(value)
- selection.data(data)

![](https://i.imgur.com/Y2vR9cR.png)

#### Example

![](https://i.imgur.com/imm2TQL.png)

```js
{
  const svg = html`
    <svg width=${
      rectWidth * barData.length
    } height=100 style='border: 1px dashed'>
      <rect /><rect /><rect /><rect /><rect />
    </rect>`;

  d3.select(svg)
    .selectAll("rect")
    .data(barData)
    // calculate x-position based on its index
    .attr("x", (d, i) => i * 50)
    .attr("y", (d) => 100 - d)
    // set height based on the bound datum
    .attr("height", (d) => d)
    // rest of attributes are constant values
    .attr("width", rectWidth)
    .attr("stroke-width", 3)
    .attr("stroke-dasharray", "5 5")
    .attr("stroke", "plum")
    .attr("fill", "pink");

  return svg;
}
```

## Dynamically generate svg [📔 here](https://observablehq.com/@sxywu/3-create-a-petal-for-each-movie)

```
d3.select(svg).selectAll('rect')
  .data(data).enter().append('rect')
```

![](https://i.imgur.com/eRLyxeQ.png)

- className

```
selection.selectAll('.bar')
  .data(data).enter().append('rect')
  .classed('bar', true)
```

## D3.js scales [📔 here](https://observablehq.com/@sxywu/4-size-each-petal-based-on-its-movies-rating)

- continuous → continuous
  - scaleLinear()
  - scaleLog()
  - scaleSqrt()
  - scaleTime()
- continuous → discrete
  - scaleQuantize()
- discrete → discrete
  - scaleOrdinal()
- discrete → continuous
  - scaleBand()

### Usage

```js
const scale = d3
  .scaleLinear()
  .domain([min, max]) // raw data
  .range([min, max]); // visual channel

scale(someValue); // returns translated value
```

To get min & max values from data:

```js
d3.min(data, (d) => d[someAttr]);
d3.max(data, (d) => d[someAttr]);
d3.extent(data, (d) => d[someAttr]); // returns [min, max]
```

#### Example

```js
const xScale = d3
  .scaleBand()
  .domain(d3.keys(data)) // sets domain to: ["0", "1", "2", "3", "4"]
  .range([0, width]) // [0 (left), 470px (right)]
  .padding(0.25);

const max = d3.max(data, (d) => d); // returns 97

const yScale = d3.scaleLinear().domain([0, max]).range([height, 0]); // [200px (bottom), 0 (top)]

d3.select(svg)
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d, i) => xScale(i))
  .attr("y", (d) => yScale(d));
// ...set other attributes
```

## Group elements [📔 here](https://observablehq.com/d/f63ddec3731bee1a)

```js
html`<g> ... </g>`;

g = svg.selectAll("g").data(flowers).enter().append("g");
```

#### Example

![](https://i.imgur.com/11EYKLE.jpg)

```js
path = g
  .selectAll("path")
  .data((d) => {
    return _.times(d.numPetals, (i) => {
      // create a copy of the parent data, and add in calculated rotation
      return Object.assign({}, d, { rotate: i * (360 / d.numPetals) });
    });
  })
  .enter()
  .append("path");
```

## DOM Manipulation & Transition [📔 here](https://observablehq.com/d/82efd3ed1e653a91)

What if our data updates and we want the DOM to update to match?

### ✨ the enter-update-exit pattern

The .data() function is powerful because it not only binds data to our selection and calculates the enter selection, it also calculates our update and exit selection as well.

![](https://i.imgur.com/EzGecv6.png)

With the **key function**, D3.js calculates the _update_, _exit_, and _enter_ selections:
![](https://i.imgur.com/vzHfCSx.jpg)

#### Old ways (to understand how its work🤔)

1. grab the _exit_ selection with `rect.exit()`, and remove those elements from the DOM:
   ```js
   rect.exit().remove();
   ```
2. create new elements with the _enter_ selection:
   ```js
   const enter = rect.enter().append('rect')
     // set attributes that don't depend on data:
     .attr('width', rectWidth)
     .attr('fill', 'pink')
     ...
   ```
3. **merge** the _enter_ and _update_ selection (the update selection is stored in rect since it's what `.data()` returns, no need for an accessor function). The **_enter+update_ selection together represents what should be in the DOM to match the new data**, and thus we want to set attributes that change when data changes:
   ```js
   enter
     .merge(rect) // enter + update selections
     // set attributes that change when data changes:
     .attr("x", (d, i) => i * rectWidth)
     .attr("y", (d) => 100 - d)
     .attr("height", (d) => d);
   ```

#### New ways (much convenient🪄)

```js
d3.select(svg).selectAll('rect')
  .data(newData, d => d)
  .join('rect') // takes care of enter & exit in one
  // returns the enter+update selection,
  // so we can set all our attributes on it:
  .attr('x', (d, i) => i * rectWidth)
  .attr('width', rectWidth)
  ...
```

#### Example

```js
d3.select(svg).selectAll('rect')
  .data(newData, d => d)
  .join(
    enter => {
      // return so it can be joined with update selection
      return enter.append('rect')
        // set attributes etc. on only enter selection
    },
    update => update,
    exit => {
      // do something with exit selection
    }
  )
  // .join() returns enter+update selection
  // so can also chain attributes here
  ...
```

### ✨ D3.js transitions

```js
// define the transition
const t = d3.transition().duration(1000);

selection
  // attributes or styles to transition FROM
  .transition(t);
// attributes or styles to transition TO
```

D3.js knows to animate the attributes or styles that comes **after** `.transition(t)`, and will use those as the values to transition **to**.

🚨 If there are no corresponding attribute declarations before `.transition(t)`, D3.js will use the SVG element's defaults to transition **from**.

#### Example

```js
function updateBars() {
  // select svg so that transition can be localized within selection
  const t = d3.select(svg).transition().duration(1000);

  // randomly generate an array of data
  const data = _.times(_.random(3, 8), (i) => _.random(0, 100));

  // ✨ YOUR CODE HERE
  d3.select(svg)
    .selectAll("rect")
    .data(data, (d) => d)
    .join(
      (enter) => {
        return (
          enter
            .append("rect")
            // attributes to transition FROM
            .attr("height", 0)
            .attr("y", svgHeight)
            .attr("x", (d, i) => i * rectWidth)
            .attr("fill", "pink")
            .attr("stroke", "plum")
            .attr("stroke-width", 2)
        );
      },
      (update) => update,
      (exit) => {
        return (
          exit
            .transition(t)
            // attributes to transition TO
            .attr("height", 0)
            .attr("y", svgHeight)
        );
      }
    )
    .attr("width", rectWidth)
    .transition(t) // enter + update selection
    // attribute to transition TO
    .attr("x", (d, i) => i * rectWidth)
    .attr("height", (d) => d)
    .attr("y", (d) => svgHeight - d);

  // update div with new data array:
  d3.select(code).text(JSON.stringify(data).replace(/\,/g, ", "));
}
```

## Positioning Functions [📔 here](https://observablehq.com/d/05844596efaad1c2)

### D3.js shape

[D3.js shape](https://github.com/d3/d3-shape) functions help us calculate the **path strings** we need to draw line charts, area charts, pie charts, etc. They take in raw data and return path strings.

### D3.js hierarchy

[D3.js hierarchy](https://github.com/d3/d3-hierarchy) helps us calculate the _x, y_-positions and (where applicable) the _width_, _height_, _radius for trees_, _tree maps_, _circle maps_, etc. They also take in the raw data and return new objects without mutating the original data.

### ✨ D3.js force

[D3.js force](https://github.com/d3/d3-force) layout is used to calculate positions for a node-and-link graph.

```js
const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3.forceLink(links).id((d) => d.id)
  )
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2))
  .on("tick", () => {
    // update node and link positions
  });
```

1. Takes array of nodes and assigns a random x, y-position to each of them
2. Loops through each node and applies the series of forces specified in `.force()`:
   - _Attractive_ forces pull nodes together to conserve space (e.g. links between nodes)
   - _Negative_ forces push nodes apart to avoid overlap between them (e.g. negative charges and collision forces)
   - All of these forces together nudge the node positions slightly, and these series of calculations happen in one "tick"
3. Runs thousands of "ticks" until the nodes are nudged to their "optimal" positions

To use the calculated node and link positions, we update the corresponding DOM elements either on each "tick" `(.on('tick', () => ...))` or on simulation end `(.on('end', () => ...))`.

> checkout this [blog post](https://medium.com/@sxywu/understanding-the-force-ef1237017d5) to learn more detail about how it works

#### Interesting work using D3.js force

- [Interactive Visualization of Every Line in Hamilton](https://pudding.cool/2017/03/hamilton/)
- [People Of The Pandemic](https://peopleofthepandemicgame.com/)

## D3 & HTML

- film flowers in [codepen](https://codesandbox.io/s/objective-rubin-luc9f?file=/barChart.html)

## Refernece

- Doc | [D3.js API](https://github.com/d3/d3/blob/main/API.md)

![](https://i.imgur.com/ut9yYkY.jpg)

- D3.js works | [bl.ocks](https://bl.ocks.org/)
- D3.js works | [Observable](https://observablehq.com/)
- Society | [Slack](https://d3-slackin.herokuapp.com/)
- Society | [Data Visualization](https://www.datavisualizationsociety.org/)
