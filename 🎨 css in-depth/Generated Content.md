# Generated Content

📔 Handout [HERE](https://estelle.github.io/cssmastery/generated/)

- [::before/::after](#beforeafter)
- [Accessibility](#accessibility)

## ::before/::after

- Basic Usage

```=css
element::before {
  /* the only 'required' attribute */
  content: "";
 }

element::after {
  /* without "content:", you have no content */
  content: "";
 }
```

- **Quotes** Usage

```=css
/* Specify pairs of quotes for two levels in two languages */
:lang(en) > q { quotes: '"' '"' "'" "'" }
:lang(fr) > q { quotes: "«" "»" "’" "’" }

/* Insert quotes before and after Q element content */
q::before { content: open-quote }
q::after  { content: close-quote }
```

- **Attribute Values** Usage

```=css
a[href^=http]:hover {
   position: relative;
}
a[href^=http]:hover:after {
   content: attr(href);
   position: absolute;
   top: 1em;
   left: 0;
   background-color: black;
   color: white;
   padding: 3px 5px;
   line-height:1;
}
```

- **Counter** Usage

```=css
body {counter-reset: invalidCount;}
:invalid {
  background-color: pink;
  counter-increment: invalidCount;
}
p:before {
  content: "You have "
      counter(invalidCount) " invalid entries";
}
```

- **Image**

```=css
.showMe {
	position:relative;
}
.showMe:hover::after {
	position:absolute;
	content: url(attr(data-url)); /* doesn't work */
	content: url(estelle.svg);    /* does work */
	width: 200px;
	height:200px; color: blue;
	bottom: -39px;
	left: 20px;
}
```

- **String**

```=css
element:before {
    content: '';                  /* empty */
    content: " (.pdf) ";          /* any text */
    content: "\2603";             /* unicode */
    content: " (" attr(href) ")"; /* attributes */
    content: counter(name);
    counter-increment: name;      /* counters */
}
```

## Accessibility

- Generated content can enhance but should not change actual content.
- Separation of concerns: content v. presentation.
- generated content is factored into element's accessible name computation
- All browsers except IE exposes generated content

> 💭 should be used to improve UI, and not modify the content itself

Improved Accessibility (future)

```=css
content: url(question.svg) / "More Information";
```

> 💭 It's like an alt of the generated content

Purely decorative

```=css
content: "\25BA" / "";
```
