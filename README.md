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

- `raiar-checkmark`

  Applies to `<input type="checkbox">`.  
  Adds a checkmark that appears when the element is checked.

- `raiar-list-text`

  Applies to `<ul>`.  
  Marks the list as a list containing only text elements, or other
  `.raiar-list-text`.

### Utility classes

You can enable utility classes for an element by adding the `raiar` class.
Utility classes are sometimes composed by a prefix and a suffix. Don't use a
prefix or a suffix in isolation.

- Prefix `align-items`

  All the following suffixes set `display: flex`.

  - Suffix `-baseline`

    Sets `align-items: baseline`.

  - Suffix `-center`

    Sets `align-items: center`.

  - Suffix `-end`

    Sets `align-items: flex-end`.

  - Suffix `-start`

    Sets `align-items: flex-end`.

  - Suffix `-stretch`

    Sets `align-items: stretch`.

- Prefix `flex`

  All the following suffixes set `display: flex`.

  - Suffix `-nowrap`

    Sets `flex-wrap: nowrap`

  - Suffix `-wrap`

    Sets `flex-wrap: wrap`

  - Suffix `-wrap-rev`

    Sets `flex-wrap: wrap-reverse`

  - Suffix `col`

    Sets `flex-direction: column`

  - Suffix `col-rev`

    Sets `flex-direction: column-reverse`

  - Suffix `row`

    Sets `flex-direction: row`

  - Suffix `row-rev`

    Sets `flex-direction: row-reverse`

- Prefix `gap`

  - No suffix

    Sets `display: flex` and sets a standard gap between children.

  - Suffix `-2x`

    Same as `gap`, but the gap is twice as large.

  - Suffix `-4x`

    Same as `gap-2x`, but the gap is twice as large.

- Prefix `justify-content`

  All of the following prefixes set `display: flex`.

  - Suffix `-around`

    Sets `justify-content: space-around`.

  - Suffix `-between`

    Sets `justify-content: space-between`.

  - Suffix `-center`

    Sets `justify-content: center`.

  - Suffix `-end`

    Sets `justify-content: flex-end`.

  - Suffix `-evenly`

    Sets `justify-content: space-evenly`.

  - Suffix `-start`

    Sets `justify-content: flex-start`.
