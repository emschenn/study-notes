# Transforms

📔 Handout [HERE](https://estelle.github.io/cssmastery/transforms/)

- [2D Transforms](#2d-transforms)
  - [translate](#translate)
  - [scale](#scale)
  - [rotate](#rotate)
  - [skew](#skew)
  - [matrix](#matrix)
- [3D Transforms](#3d-transforms)
  - [translate](#translate-1)
  - [scale](#scale-1)
  - [rotate](#rotate-1)
  - [matrix](#matrix-1)
- [3D Transform Related Properties](#3d-transform-related-properties)
  - [perspective](#perspective)
  - [perspective-origin](#perspective-origin)
  - [transform-origin](#transform-origin)
  - [transform-style](#transform-style)
  - [ackface-visibility](#ackface-visibility)

---

- Take advantage of `transform-origin`
- Multiple values are **SPACE separated** (no commas)
- **The order of the values matters**
- [3D transforms](https://westciv.com/tools/3Dtransforms/index.html) are hardware accelerated
- Play with [Westciv's Transform Tool](https://westciv.com/tools/transforms/index.html)
- [Matrix](https://meyerweb.com/eric/tools/matrix/) is another syntax
- More about [transforms](http://www.standardista.com/css3/css3-transform-property-and-the-various-transform-functions/)

## 2D Transforms

### translate

specifies a 2D translation by the vector [x, y], where x is the translation-value parameter for the x axis and y is the optional translation value along the y axis. parameter. If _y_ is not provided, y==0.

- translate(`<length>`[, `<length>`])
- translateX(`<length>`)
- translateY(`<length>`)

### scale

specifies 2D scaling operation by the [sx,sy]. If sy is not provided, sy will equal sx (growsing or shrinking with the same scale). Scale(1, 1) or scale(1) leaves an element in it's default state. Scale(2, 2) or scale(2) causes the element to appear twice as wide and twice as tall as its default size, taking up 4-times the original area.

- scale(`<number>`[, ``<number>``])
- scaleX(`<number>`)
- scaleY(`<number>`)

### rotate

specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the _transform-origin_ property. For example, rotate(90deg) would cause elements to appear rotated one-quarter of a turn in the clockwise direction.

### skew

specifies a skew transformation along the X,Y axis by the given angle.

- skew(`<angle>` [,``<angle>``])
- skewX(`<angle>`)
- skewY(`<angle>`)

### matrix

Generally machine generated, specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix **[a b c d e f]**

- matrix(`<num>`, `<num>`, `<num>`, `<num>`, `<num>`, `<num>`)

### 🌟🌟 Order of transform functions matters

> i.e., if you rotate first, your translate direction will be on the rotated axis!

## 3D Transforms

### translate

specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.

- translate3d(`<x>`, `<y>`, `<z>`)
- translateX(`<x-length>`), translateY(`<y-length>`)
- translateZ(`<z-value>`)

### scale

specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.

- scale3d(`<number>`, `<number>`, `<number>`)
- scaleX(`<number>`), scaleY(`<number>`)
- scaleZ(`<number>`)

### rotate

specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters. If the direction vector is not of unit length, it will be normalized. A direction vector that cannot be normalized, such as [0, 0, 0], will cause the rotation to not be applied.

This function is equivalent to

```
matrix3d(1 + (1-cos(angle))*(x*x-1), -z*sin(angle)+(1-cos(angle))*x*y, y*sin(angle)+(1-cos(angle))*x*z, 0, z*sin(angle)+(1-cos(angle))*x*y, 1 + (1-cos(angle))*(y*y-1), -x*sin(angle)+(1-cos(angle))*y*z, 0, -y*sin(angle)+(1-cos(angle))*x*z, x*sin(angle)+(1-cos(angle))*y*z, 1 + (1-cos(angle))*(z*z-1), 0, 0, 0, 0, 1).
```

- rotate3d(`<number>`, `<number>`, `<number>`, `<angle>`)
- rotateZ(`<angle>`)

### matrix

specifies a 3D transformation as a 4x4 homogeneous matrix of 16 comma separated values in column-major order.

- matrix3d(`<number>`{15})

perspective(`<number>`)

specifies a perspective projection matrix. This matrix maps a **viewing cube** onto a pyramid whose base is infinitely far away from the viewer and whose peak represents the viewer's position. The viewable area is the region bounded by the four edges of the viewport (the portion of the browser window used for rendering the webpage between the viewer's position and a point at a distance of infinity from the viewer). The **depth**, given as the parameter to the function, represents the distance of the z=0 letters from the viewer. Lower values give a more flattened pyramid and therefore a more pronounced perspective effect. The value is given in pixels, so a value of 1000 gives a moderate amount of foreshortening and a value of 200 gives an extreme amount. The matrix is computed by starting with an identity matrix and replacing the value at row 3, column 4 with the value -1/depth. The value for depth must be greater than zero, otherwise the function is invalid.

## 3D Transform Related Properties

- **perspective**: none | length
- **perspective-origin**: pos relative to parent
- **transform-origin**: length | keyterm {1,3}
- **transform-style**: flat | preserve-3d
- **backface-visibility**: visible | hidden

### perspective

Screens are flat. 3D requires perspective.

1. `transform: perspective(100)` ...
2. `perspective: 100`

- The perspective() function must come first 🌟🌟
- Smaller numbers have a bigger impact 🌟

#### Difference

- **with the parent property,** all the transformed elements share the same perspective.
- **with the function,** each transformed element has it's own perspective.

e.g.,<br/><br/>
<img src="https://i.imgur.com/kPZgA4N.png" alt="drawing" width="400"/>

### perspective-origin

Defines the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.

- Property on **parent element**
- Positions the perspective relative to parent, defining the origin for the perspective property.
- Sets the X and Y position at which the **viewer appears to be looking** at the children of the element.

e.g.,<br/><br/>
<img src="https://i.imgur.com/zvu0cAM.png" alt="drawing" width="400"/>

### transform-origin

Specifies the x and y position of the origin, relative to the transform object.

- Keyword positions: left, right, bottom, top, center
- Length values
- Percentage values
- default is `50% 50%` (or center center)

### transform-style

How to handle nested elements are rendered in 3D space.

```=css
transform-style: flat | preserve-3d
```

- Default is flat
- Set on parent element
- Only works if the following are set to their default values:
  - overflow
  - clip
  - clip-path
  - filter
  - mask-border-source
  - mask-image
  - mix-blend-mode

```=css
.parent {
    transform: perspective(400px) rotateX(15deg) rotateY(-15deg);
    transform-style: preserve-3d;
}
.child {
    transform: perspective(400px) translateZ(90px) rotate(20deg);
}
```

![](https://i.imgur.com/jrudAVC.png)

### ackface-visibility

When an element is flipped, is the content that is flipped away from user visible or not.

```
backface-visibility: visible | hidden
```

```=css
.one:after,
.two:after { transform: rotateX(180deg); }
.one:after { backface-visibility: visible; }
.two:after { backface-visibility: hidden; }
```

![](https://i.imgur.com/Tjc45DT.png)
