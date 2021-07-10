# Backgrounds & Borders

📔 Handout [HERE](https://estelle.github.io/cssmastery/borders/)

- [Background](#background)
  - [`background-image`](#background-image)
    - [value types](#value-types)
    - [advanced usage](#advanced-usage)
  - [`background-repeat`](#background-repeat)
  - [`background-attachment`](#background-attachment)
  - [`background-position`](#background-position)
  - [`background-clip` & `background-origin`](#background-clip--background-origin)
  - [`background-size`](#background-size)
- [Border](#border)
  - [`border-style`](#border-style)
  - [`border-width`](#border-width)
  - [`border` shorthand](#border-shorthand)
  - [`border-radius`](#border-radius)
  - [`border-image`](#border-image)

---

##### Background properties

```=css
background-color
background-image'
background-repeat
background-attachment
background-position
background-clip
background-origin
background-size
background shorthand
```

##### Border properties

```=css
border-color
border-style
border-width
border shorthand
border-radius
```

##### Border Images

```=css
border-image-source
border-image-slice
border-image-width
border-image-outset
border-image-repeat
border-image shorthand
```

## Background

> ⚠️ Don't use background shorthand for risk of setting any of 8 properties to default values

### `background-image`

- Make sure there's enough contrast with text (or add drop shadow)
- Include a background color
- Doesn't print by default
- Not accessible

#### value types

```=css
none | <url>  | <gradient> |
  <image()> | <element()> | <image-set()>  | <cross-fade()>
```

```=css
none

url(singleImage.png)
url(firstImage.jpg), url(secondImage.jpg)
url(data:image/gif;base64,fOulrS123hEAAa517sdfQfda...)
url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='200'><circle cx='55' cy='190' r='25' fill='#FFF' /></svg>");

linear-gradient(to bottom, green, blue)
radial-gradient(circle, green, blue)
```

#### advanced usage

- Allows the use of any element, including `<canvas>` where images can be used. 🌟🌟

```=css
background-image: -moz-element('#someID');
background-image: element('#someID')
```

- Define which portion of the image to show:

```=css
background-image:
    -moz-image-rect(url(ico_sprite.jpg), 32, 64, 16, 16);
background-image: image('ico_sprite.jpg#xywh=32,64,16,16')
```

- Fallback in case your images doesn't load: _(to be supported soon...)_

```=css
background-image:
     image("try1.svg", "try2.png", "try3.gif", blue)
```

### `background-repeat`

```=css
background-repeat:
  repeat | repeat-x | repeat-y | no-repeat | space | round;
```

- `space`: Repeated as often as will fit without being clipped, spaced out evenly
- `round`: Repeated as often as will fit without being clipped then scaled so no space in between

### `background-attachment`

```=css
background-attachment: fixed | local | scroll
```

### `background-position`

Positioning relative to any corner

```=css
background-position: right 50px bottom 50px;
```

### `background-clip` & `background-origin`

```=css
background-clip: content-box | padding-box | border-box
```

> only set bg with content // content + padding // content + padding + border

![](https://i.imgur.com/adnQWXE.png=300x)

```=css
background-origin: border-box | padding-box | content-box
```

### `background-size`

- Use for creating gradients backgrounds
- Needed for hiDPI images

```=css
background-size: auto | contain | cover | <length>
```

- **auto**: image is actual size
- **cover**: image maintains aspect ratio, covering entire element even if that means part of the image is cut off.
- **contain**: image maintains aspect ratio, fitting the entire image into the element even if that means part of the background is showing or the image repeats.
- **length**: image maintains aspect ratio, growing or shrinking so that the width is the length defined
- **auto length**: image maintains aspect ratio, growing or shrinking so that the height is the length defined
- **length length**: image DOES NOT NECESSARILY maintain its aspect ratio, height and width both grow or shrink to the length defined

## Border

### `border-style`

<img src="https://i.imgur.com/JceL4S7.png" alt="drawing" width="200"/>

### `border-width`

```=css
border-width: (length) | thin | medium | thick | inherit {1,4};
```

### `border` shorthand

- style is REQUIRED.
- width defaults to medium
- color defaults to currentColor

```=css
border: width style color;
border-top: 5px dashed rgba(217,68,11, 0.8);
```

### `border-radius`

![](https://i.imgur.com/7EdcguE.png)

👀 from left->right

```=css
.circle {border-radius: 50%;}
```

```=css
.oval { border-radius: 50%;}
```

```=css
.different { border-radius: 10px 30px;}
```

```=css
.elliptical { border-radius: 10px / 30px;}
```

```=css
.uglier {
  border-radius: 10px 35px 20px 15px /
                 30px 35px 5px 5px;}
```

> 🌟🌟 “If values are given before and after the slash, then the values before the slash set the **horizontal radius** and the values after the slash set the **vertical radius**. If there is no slash, then the values set both radii equally.”![](https://i.imgur.com/3fTkVK9.png)

### `border-image`

- Syntax for non-prefixed differs
- Must also declare border-style
- [Border image tool](https://border-image.com/)
- [border-image tutorial](https://www.sitepoint.com/css3-border-image/)

```
border-image: source || slice / width / outset  || repeat;
```

```=css
div {
    border: solid transparent;
    border-width: 48px 137px 68px 84px;
    border-image:
      url(img/longcat.jpg) 48 137 68 84 fill stretch;
}
```

![](https://i.imgur.com/2zJuVRj.png)

> original img:
> <br/><img src="https://i.imgur.com/ZMKN8gV.png" alt="drawing" width="200"/>
