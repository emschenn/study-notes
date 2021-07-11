# Gradients

📔 Handout [HERE](https://estelle.github.io/cssmastery/gradients/)

- [Basic](#basic)
  - [4 Gradient Types](#4-gradient-types)
  - [Conical Gradient (supported soon...)](#conical-gradient-supported-soon)
  - [Linear Gradient Syntax](#linear-gradient-syntax)
  - [Radial Gradient Syntax](#radial-gradient-syntax)
- [Color Stops](#color-stops)
- [Color Hints](#color-hints)
- [Direction](#direction)
  - [Angles](#angles)
- [Repeating](#repeating-linear-gradient)
- [Radial Gradients](#radial-gradients)
  - [Position](#position)
  - [Shapes: `circle` or `ellipse`](#shapes-circle-or-ellipse)
  - [Sizing With Keywords](#sizing-with-keywords)
  - [Repeating](#repeating)

---

## Basic

- Anywhere an image can be used (theoretically)
  - background-image, list-style-type, border-image, content, cursor

#### 4 Gradient Types

![](https://i.imgur.com/py6YVKI.png)

#### Conical Gradient (supported soon...)

![](https://i.imgur.com/qtSanh2.png)

### Linear Gradient Syntax

Things to remember:

- Use **'to'** with keyterms
- 0 deg is to top
- Angles go **clockwise**

```=css
linear-gradient([<angle>| to <side-or-corner>,]?
   [<color-stop>[, <color-hint>]?, ]# <color-stop>)
```

e.g.,

```=css
.slide {
  background-image: linear-gradient(to bottom, rebeccapurple 0%, palegoldenrod 100%);
}
```

### Radial Gradient Syntax

Things to remember:

- Use 'at' with position
- position is center of gradient
- If shape is specified as circle or omitted, the size can be a length/percent

```=css
radial-gradient([<shape>|| <size> at <position>]?
   [<color-stop>[, <color-hint>]?, ]# <color-stop>)
```

## Color Stops

```=css
<color> [<length> || <percentage>]?
```

- **Color?** See [Colors](https://estelle.github.io/cssmastery/colors/index.html#slide14)
- **Length?** Any length unit
- **Percent?** relative to gradient line which is relative to image size
- **Omitted?** 0%, 100%, or evenly distibuted in between
- **Duplicate?** Hard color stop
- **Out of Order?** previous declared value

##### 👀 More Example [Here](https://estelle.github.io/cssmastery/gradients/#slide18)

## Color Hints

- **Midpoint of transition between 2 stops**
- **Length?** Any length unit
- **Percent?** relative to gradient line which is relative to image size
- **Hard Stop?** Use 0%
- Point is relative to the 0 (zero) mark, not from the previous color stop

<img  src="https://i.imgur.com/R6K4aY4.png" alt="drawing" width="400"/>

## Direction

Gradient progresses toward the declared side or corner.

```=css
linear-gradient([<angle>| to **<side-or-corner>**,]?
   [<color-stop>[, <color-hint>]?, ]# <color-stop>)
```

```=css
to [left | right] || [top | bottom]
```

<img  src="https://i.imgur.com/3a0oJqE.png" alt="drawing" width="200"/>

### Angles

Gradient progresses the declared angle.

```=css
linear-gradient([**<angle>**| to <side-or-corner>,]?
   [<color-stop>[, <color-hint>]?, ]# <color-stop>)
```

- Degrees go clockwise, starting at 12:00
  - `top`: 0%;
  - `right`: 90%;
  - `bottom`: 180%;
  - `left`: 270%;
- 0 deg is the same as to top
- 45% is **NOT** the same as to top right
- **deg** is required

## Repeating Linear Gradient

Things to remember:

- Use **'to'** with keyterms
- Angles go counter clockwise
- 0deg is from left
- Width is last specified color-stop's position minus the first specified color-stop's position
- **Color stops repeat indefinitely**
- border color-stops will create hard transitions if gradient doesn't start and end with the same color.

```=css
repeating-linear-gradient([<angle>| to <side-or-corner>,]?
   [<color-stop>[, <color-hint>]?, ]# <color-stop>)
```

## Radial Gradients

Things to remember:

- Use **'at'** with position
- position is center of gradient
- If shape is specified as circle or omitted, the size can be a length/percent

```=css
radial-gradient([<shape>|| <size> at <position>]?
   [<color-stop>[, <color-hint>]?, ]# <color-stop>)
```

e.g.,

```=css
.slide {
  background-image:
    radial-gradient(ellipse at center,
      palegoldenrod 0%,
      rebeccapurple 100%);
}
```

### Position

- same values as background-position
- include 'at'
- location of gradient center point
- Gradient ray, no angled gradient line

### Shapes: `circle` or `ellipse`

declared explicitly, or implied via size declaration

- `circle`: single length value: radius
- `ellipse`: two length values: width height
- percentage size only for ellipses

### Sizing With Keywords

- **closest-side**
  - `circle`: gradient ray end touches closest side
  - `ellipse`: vertical ray touches closest of top or bottom edge. horizontal ray touchest closest of right or left side.
- **farthest-side**
  - `circle`: gradient ray end touches furthest side.
  - `ellipse`: vertical ray touches furthest of top or bottom edge. horizontal ray touchest furthest of right or left side.
- **closest-corner**
  - `circle`: radius is length from center of circle (position) to closest corner.
  - `ellipse`: gradient ray touches corner closest to center while maintaining aspect ratio.
- **farthest-corner** _Default_
  - `circle`: radius is length from center of circle (position) to furthest corner.
  - `ellipse`: gradient ray touches corner furthest from center while maintaining aspect ratio.

### Repeating

Things to remember:

- repeats the radial gradient after the 100% mark.
- Has no impact when 'furthest-corner' is used or defaults for gradient size
- Use **'at'** with position
- position is center of gradient
- If shape is specified as circle or omitted, the size can be a length/percent

```=css
repeating-radial-gradient([<shape>|| <size> at <position>]?
   [<color-stop>[, <color-hint>]?, ]# <color-stop>)
```
