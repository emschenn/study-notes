# Table

📔 Handout [HERE](https://estelle.github.io/cssmastery/tables/)

- [Purpose](#purpose)
- [Properties](#properties)
  - [Caption](#caption)
  - [Borders & Spacing](#borders--spacing)
  - [Others](#others)

---

## Purpose

Presentation of Data

- Presenting
- Comparing
- Sorting
- Calculating
- Cross Referencing

And NOT for presentation 👀 !

```=css
<table>
  <caption></caption>
  <colgroup>
    <col/>
  </colgroup>
  <thead>
    <tr>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th></th>
    </tr>
  </tfoot>
</table>
```

## Properties

### Caption

- Specifies the title of table
- Always the first child of a `<table>`
- Can be positioned on top or bottom with caption-side
- Can be styled

```=css
table {
  caption-side: top;
}
caption {
  color: #CC0000;
}
```

### Borders & Spacing

- **border-collapse**

> When the borders are collapsed border-spacing is relevant.

```=css
border-collapse: separate | collapse | inherit
```

- **border-spacing**
  - one length: vertical and horizontal padding are the same.
  - two lengths: first is horizontal, second is vertical
  - Irrelevant if border-collapse: collapse
  - Empty space is part of the table, not the column, tbody, row or cell.

```=css
table, th, td {border: 1px solid;}
table {
  border-spacing: 10px 5px;
  border-collapse: collapse;
}
```

### Others

- **empty-cell**
  - ignored if border-collapse: separate
  - applies to elements with display of table-cell
  - property of table or the cells themselves

```=css
empty-cell: show | hide
```

- **table-layout**
  fixed renders faster

```=css
table-layout: auto | fixed
```

- **vertical-align**
  - applied to thead, tfoot, tbody, tr, td, th, but not table.
  - negative values are ok
  - additional values (sub, super, text-top, text-bottom,` <length>`, and `<percentage>`) equal baseline

```=css
vertical-align: baseline | sub | super | text-top |
                text-bottom | middle | top | bottom |
                <percentage> | <length>
```

- **display**

```=css
display: table;
display: table-row-group;
display: table-header-group;
display: table-footer-group;
display: table-row;
display: table-cell;
display: table-column-group;
display: table-column;
display: table-caption;
```
