# Raiar

**Raiar** is a front-end web framework providing JS web components and
configurable Sass sheets. Raiar was created for my projects, but there's nothing
stopping you from using it too.

---

**Raiar is young and isn't meant to compete with larger frameworks such as
Bootstrap. Raiar also uses newer CSS features, causing poor portability and it's
not recommended for most projects.**

---

## Desktop and mobile

In Raiar, "mobile" means the content is being viewed on a narrow screen with a
portrait orientation. This definition is used by Raiar's device mixins.

## JS components

- [`raiar-alert`](components/alert.js)
- [`raiar-modal`](components/modal.js)
- [`raiar-slider`](components/slider.js)

## Inputs

The following inputs must be nested inside a `<label>`:

- `<input>`:
  - Default `<input>`
  - `type="checkbox"`
  - `type="email"`
  - `type="password"`
  - `type="radio"`
  - `type="search"`
  - `type="text"`
  - `type="url"`
- `<textarea>`

## Classes

- `raiar-dark`

  Applies to `<html>`.  
  Enables the dark mode.

- `raiar-card`

  Makes a block pop out as a card, with rounded edges and a drop shadow.

- `raiar-gap`

  Makes a container `flex` and sets a standard gap between its children.

- `raiar-vertical`

  Makes a container `flex` and sets its `flex-direction` to `column`.

- `raiar-horizontal`

  Makes a container `flex` and sets its `flex-direction` to `row`.

- `raiar-wrap`

  Makes a container `flex` and sets sets `flex-wrap: wrap`.

- `raiar-checkmark`

  Applies to `<input type="checkbox">`.  
  Adds a checkmark that appears when the element is checked.

- `raiar-list-text`

  Applies to `<ul>`.  
  Marks the list as a list containing only text elements, or other
  `.raiar-list-text`.
