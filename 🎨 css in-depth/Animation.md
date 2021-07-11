# Animation

📔 Handout [HERE](https://estelle.github.io/cssmastery/animations/)

- [Transitions](#transitions)
  - [Animatable Properties](#animatable-properties)
  - [Transition Features (or Limitations)](#transition-features-or-limitations)
- [Animations](#animations)
  - [Animations Features (or Limitations)](#animations-features-or-limitations)
  - [Keyframes](#keyframes)
  - [USE Animation](#use-animation)
    - [`animation-timing-function`](#animation-timing-function)
    - [`animation-iteration-count`](#animation-iteration-count)
    - [`animation-delay`](#animation-delay)
    - [`animation-direction`](#animation-direction)
    - [`animation` (shorthand)](#animation-shorthand)
    - [`animation-fill-mode`](#animation-fill-mode)
    - [`animation-play-state`](#animation-play-state)

---

## Transitions

Enables the transition of properties from one state to the next over a defined length of time

- **transition-property:** `properties` (or 'all') that transition
- **transition-duration:** `s` or `ms` it takes to transition
- **transition-timing-function:** bezier curve of transition
  - `ease` - 🌟 specifies a transition effect with a slow start, then fast, then end slowly (this is default)
  - `linear` - specifies a transition effect with the same speed from start to end
  - `ease-in` - specifies a transition effect with a slow start
  - `ease-out` - specifies a transition effect with a slow end
  - `ease-in-out` - 🌟 specifies a transition effect with a slow start and end
  - `cubic-bezier(n,n,n,n)` - lets you define your own values in a cubic-bezier function
- **transition-delay:** `s` or `ms` before transition starts
- **transition:** shorthand for 4 transition properties

### Animatable Properties

#### 🪄 Anything that has intermediate values!

```=css
✅
code {
  opacity: 1;
}
code:halfway {
  opacity: 0.5;
}
code:hover {
  opacity: 0;
}
```

```=css
🚫
code {
  display: block;
}
code:halfway {
  display: ???
}
code:hover {
  display: none;
}
```

#### 🪄 2 values that have REAL intermediary values

```=css
✅
code {
  font-size: 100%;
}
code:halfway {
  font-size: 110%;
}
code:hover {
  font-size: 120%;
}
```

```=css
🚫
code {
  height: auto;
}
code:halfway {
  height: ???
}
code:hover {
  height: 1000px;
}
```

#### Transitionable Properties

![](https://i.imgur.com/KdXuYaQ.png)

### Transition Features (or Limitations)

- Single Iteration
- Reverse goes to initial state
- No granular control
- Limited methods of initiation
- Can't force them to finish

#### transitionend event

- Event thrown only when `transition` completes
- `transitionend` for EVERY property
- `transitionend` for each long-hand property within a shorthand

#### 👀 Cool Example [Here](https://estelle.github.io/cssmastery/animations/#slide19)

## Animations

### Animations Features (or Limitations)

- Single, many or infinite iterations
- Single or bi-directional
- Granular control
- Can be initiated on page load
- Has more robust JS Hooks
- Can be paused
- Lowest priority in UI Thread

#### Essentials

- @keyframes
- animation-name
- animation-duration
- animation-timing-function
- animation-iteration-count
- animation-direction
- animation-play-state
- animation-delay
- animation-fill-mode
- animation (shorthand)

### Keyframes

```=css
@keyframes writing {
    0% { // or from
      left: 0;
    }

    100% {  // or to
      left: 100%;
    }
}
```

- Don't forget the %
- Don't quote the animation name
- !important isn't work in animation

### USE Animation

```=css
@keyframes drawALine {
  0%{
    width:0;
    color:green;
  }
  100% {
    width: 100%;
    color:blue;
  }
}
```

```=css
.pencil {
   animation-name: drawALine;
    animation-duration: 3s;
}
```

> Whichever is the last animation is the keyframe I should be

#### `animation-timing-function`

```=css
ease           linear
ease-in        ease-out
ease-in-out    cubic-bezier(x1, y1, x2, y2)
step-start
step-end
steps( X, start|end)
```

- **cubic-bezier**

  - Learn more about cubic-bezier [HERE](https://cubic-bezier.com/#.17,.67,.83,.67)

- **step()**

  - How many step it should take fron 0%-100% (drop at end or start)
    e.g.,

    ```
    steps(4, end)
    ```

    ![](https://i.imgur.com/tsnzLin.png)

#### `animation-iteration-count`

```=css
animation-iteration-count: <number> | infinitie
```

> Partial Iteration or zero ok too

#### `animation-delay`

```=css
animation-delay: <sec>
```

> Can be any number (even negative value)

#### `animation-direction`

```=css
animation-direction: normal | alternate | reverse | alternate-reverse;
```

#### `animation` (shorthand)

```=c
.pencil {
  animation-name: drawALine;
  animation-duration: 5s;
  animation-delay: 100ms;
  animation-timing-function: ease-in-out;
  animation-iteration-count: 5;
  animation-direction: normal;
}
```

equals to...

```=c
.pencil {
  animation: drawALine 5s ease-in-out 100ms 5;
}
```

#### `animation-fill-mode`

Let the element retain the style values from the last keyframe when the animation ends

```=css
animation-fill-mode: values: none | forwards | backwards | both
```

- **none**: _Default value._ Animation will not apply any styles to the element before or after it is executing
- **forwards**: retain the style values that is set by the last keyframe (depends on animation-direction and animation-iteration-count)
- **backwards**: get the style values that is set by the first keyframe (depends on animation-direction), and retain this during the animation-delay period
- **both**: follow the rules for both forwards and backwards, extending the animation properties in both directions

#### `animation-play-state`

```=c
animation-play-state: paused | running
```

e.g.,

```=c
.pencil {
	transform-origin: center 300px;
	animation: writingInCircles 3s linear infinite;
}
.pencil:hover {
	animation-play-state:paused;
}
```
