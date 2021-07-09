# Media Queries

📔 Handout [HERE](https://estelle.github.io/cssmastery/media/)

- [Media Queries Property](#media-queries-property)
- [Resolution Units](#resolution-units)
- [Media Query Syntax/Punctuation](#media-query-syntaxpunctuation)
- [Capability Detection](#capability-detection)
- [Viewport](#viewport)
- [More Specific CSS](#more-specific-css)

---

```=css
<link rel='stylesheet'
media='screen and (min-width: 320px) and (max-width: 480px)'
href='css/smartphone.css' />
```

```=css
@media screen and (max-width: 480px){
  selector { /* small screen */
    property: value;
  }
}

@media screen and (orientation: landscape) {
  selector { /* landscape properties */
    property: value;
  }
}

@media screen and (min-device-pixel-ratio: 1.5) {
  selector { /* properties for higher resolution screens */
    property: value;
  }
}
```

## Media Queries Property

- (min/max)-width: viewport width
- (min/max)-height: viewport height
- ~~(min/max)-device-width: screen width~~
- ~~(min/max)-device-height: screen height~~
- orientation: portrait(h>w) | landscape(w>h)
- (min/max)-aspect-ratio: width/height
- ~~(min/max)-device-aspect-ratio: device-width/height~~
- (min/max)-resolution: 72dpi | 100dpcm

## Resolution Units

- `dpi`: dots per inch (72, 96)
- `dpcm`: dots per centimeter (1dpcm ≈ 2.54dpi)
- `dppx`: dots per pixel
  1dppx = 96dpi (default resolution of images)

> `Note` 0 is invalid. 0 is not equal to 0dpi, 0dpcm, or 0dppx.

## Media Query Syntax/Punctuation

- **"only"** leaves out older browsers

```=css
media="only print and (color)"
```

- **"and"** - both parts must be true

```=css
media="only screen and (orientation: portrait)"
```

- **"not"** - if untrue

```=css
media="not screen and (color)"
```

- **Comma** separates selectors - any part can be true

```=css
media="print, screen and (min-width: 480px)"
```

## Capability Detection

```=css
@supports (display: flex){
  /* rules for browsers supporting unprefixed flex box */
}
```

## Viewport

```=css
<meta name="viewport" content="width=device-width,
            initial-scale=1, maximum-scale=1"/>
```

- **width**: Width of the viewport in number of pixels or `device-width` (width of screen)
- **height**: Height of the viewport in number of pixels or `device-height` (height of screen)
- **initial-scale**: zoom level when page is first loaded
- **maximum-scale/minimum-scale**
- **user-scalable**: Are users allowed to zoom the page

e.g.,

```=css
@viewport {
  width: device-width; zoom: 0.5;
}
```

- **min-width/max-width/width**: ‘auto’, ‘device-width’, ‘device-height’, an absolute length, or a percentage as specified
- **min-height/max-height/height**: ‘auto’, ‘device-width’, ‘device-height’, an absolute length, or a percentage as specified
- **zoom/min-zoom/max-zoom/user-zoom**: auto, positive number or percentage / Max/Minimum zoom factor allowed. auto, positive number or percentage
- **orientation**: auto, portrait or landscape.

e.g.,

```=css
@media screen and (max-width:400px) {
  @-ms-viewport { width:320px; // or device-width;}
}
```

> If <meta> is set to disable zoom, there is no delay on onClick events.

> If <meta> is set to disable zoom, you're a jerk!

## More Specific CSS

### Mobile Specfic

- Tap Highlight Color

```=css
 -webkit-tap-highlight-color: #bada55;
```

- Prevent Select & Hold dialogue

```=css
 -webkit-user-select: none;
```

- Prevent Images Dialog

```=css
 -webkit-touch-callout: none;
```

- Prevent accidental OS popups (panning)

```=css
-ms-touch-action: none;
```

### CSS without Media Queries

- 🌟 **CSS Hyphenations**, <WBR> and &Shy;

break a word into ddddd-
sdddddd

```=css
@media screen and (min-width: 38em){
  #content { padding: 0 21%; }
}
 p {
  hyphens: auto;
}
```

- **Column**

```=css
column-count: 1;
column-width: 10em;
column-rule: 1px solid #bbb;
column-gap: 2em;
```

> 🌟 You can also use media queries in svg file to create a responsive svg
