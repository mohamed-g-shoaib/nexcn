# Trans Component — Full Reference

## Table of Contents
1. When to use Trans
2. Basic usage
3. Named components (v11.6.0+)
4. Overriding component props (v11.5.0+)
5. Simple HTML elements (v10.4.0+)
6. Interpolation
7. Plurals
8. Dynamic lists (v10.5.0+)
9. Index numbering rules
10. Trans props reference
11. i18next options for Trans
12. TypeScript usage

## When to Use Trans

Use Trans ONLY when you have React/HTML nodes integrated into a cohesive sentence (formatting like `<strong>`, `<em>`, link components, etc.). For plain text, `t()` is simpler and sufficient.

Trans does ONLY interpolation. It does NOT:
- Rerender on language change
- Load translations

You must pair it with `useTranslation` or `withTranslation` for those capabilities:
```jsx
import { Trans, useTranslation } from 'react-i18next';
function MyComponent() {
  const { t } = useTranslation('myNamespace');
  return <Trans t={t}>Hello World</Trans>;
}
```

## Basic Usage

```jsx
<Trans i18nKey="userMessagesUnread" count={count}>
  Hello <strong title={t('nameTitle')}>{{name}}</strong>,
  you have {{count}} unread message.
  <Link to="/msgs">Go to messages</Link>.
</Trans>
```

Translation strings:
```json
{
  "userMessagesUnread_one": "Hello <1>{{name}}</1>, you have {{count}} unread message. <5>Go to messages</5>.",
  "userMessagesUnread_other": "Hello <1>{{name}}</1>, you have {{count}} unread messages. <5>Go to messages</5>."
}
```

## Named Components (v11.6.0+)

Instead of index-based tags, use named tags:
```jsx
<Trans
  i18nKey="myKey"
  defaults="hello <italic>beautiful</italic> <bold>{{what}}</bold>"
  values={{ what: 'world' }}
  components={{ italic: <i />, bold: <strong /> }}
/>
```
JSON: `"myKey": "hello <italic>beautiful</italic> <bold>{{what}}</bold>"`

Advantages: simpler tags, can reuse same component multiple times.

Note: Existing self-closing HTML tag names are reserved and won't work as keys (e.g., `link`, `img`, `media`).

## Overriding Component Props (v11.5.0+)

Override props of components based on active language:
```jsx
<Trans
  i18nKey="myKey"
  components={{ CustomLink: <MyLink href="placeholder" /> }}
/>
```
Translation: `"myKey": "Click <CustomLink href=\"https://example.de/\">here</CustomLink>."`

The `href` from the translation overrides the one passed in `components`.

## Simple HTML Elements (v10.4.0+)

Elements without attributes and with only text children are kept readable:
```jsx
<Trans i18nKey="welcome">
  Hello <strong>{{name}}</strong>. <Link to="/inbox">See my profile</Link>
</Trans>
// JSON → "welcome": "Hello <strong>{{name}}</strong>. <1>See my profile</1>"
```

Elements that get converted to indexed nodes:
- Elements with attributes: `<i className="icon-gear" />`
- Elements with non-text children: `<strong title="x">{{name}}</strong>`
- Nested elements: `<b>bold <i>italic</i></b>`

Config options:
| Option | Default | Description |
|--------|---------|-------------|
| `transSupportBasicHtmlNodes` | `true` | Keep simple HTML element names |
| `transKeepBasicHtmlNodesFor` | `['br','strong','i','p']` | Which elements to keep |
| `transWrapTextNodes` | `''` | Wrap text nodes (e.g. `'span'` for Google Translate fix) |

## Interpolation

```jsx
const { name, age } = person;

<Trans>Hello {{ name }}.</Trans>
// JSON: "Hello {{name}}"

<Trans>Hello {{ firstname: person.name }}.</Trans>
// JSON: "Hello {{firstname}}"
```

TypeScript workaround for type errors with interpolation in JSX elements:
```tsx
type TransInterpolation = Record<string, string | number>;
<Trans>Hello <i>{{name} as TransInterpolation}</i></Trans>
```

## Plurals

Pass the `count` prop:
```jsx
<Trans i18nKey="newMessages" count={messages.length}>
  You have {{ count: messages.length }} messages.
</Trans>
```

As of v16.4.0, `count` is optional when `{{ count }}` appears in children — it's inferred automatically. Must be a JS number. An explicit `count` prop always takes precedence.

## Dynamic Lists (v10.5.0+)

```jsx
<Trans i18nKey="list_map">
  My dogs are named:
  <ul i18nIsDynamicList>
    {dogs.map(dog => <li key={dog}>{dog}</li>)}
  </ul>
</Trans>
// JSON → "list_map": "My dogs are named: <1></1>"
```

## Index Numbering Rules

Children of Trans are indexed by position:
```
Trans.children = [
  'Hello ',                          // 0: string → no tag
  { children: [{ name: 'Jan' }] },   // 1: <strong> → <1>{{name}}</1>
  ', you have ',                     // 2: string → no tag
  { count: 10 },                     // 3: object → interpolation, no tag
  ' unread messages. ',              // 4: string → no tag
  { children: ['Go to messages'] },  // 5: <Link> → <5>Go to messages</5>
  '.'                                // 6: string → no tag
]
```

Rules:
- String child → plain text, no wrapping
- Object child → interpolation, no wrapping
- Element child → wrap children in `<N></N>` where N is position index

## Trans Props Reference

| Prop | Type (default) | Description |
|------|----------------|-------------|
| `i18nKey` | `string` | Translation key. Optional if using text-based keys. Can include namespace: `'ns:key'` |
| `ns` | `string` | Namespace override |
| `t` | `function` | Custom t function |
| `count` | `integer` | Plural count. Optional since v16.4.0 if `{{ count }}` is in children |
| `context` | `string` | Context for context feature |
| `tOptions` | `object` | Extra options for t() |
| `parent` | `node` | Wrapper element (required for React < 16) |
| `i18n` | `object` | Custom i18next instance |
| `defaults` | `string` | Default value (useful for ICU format) |
| `values` | `object` | Interpolation values |
| `components` | `array/object` | Components for interpolation |
| `shouldUnescape` | `boolean (false)` | Unescape HTML entities |

## i18next Options for Trans

```js
i18next.init({
  react: {
    hashTransKey: function(defaultValue) { /* return key or false */ },
    defaultTransParent: 'div',    // required before React 16
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    transWrapTextNodes: '',       // set to 'span' for Google Translate fix
  }
});
```

## How to Find Correct Translation Strings

Four methods:
1. React DevTools: inspect `<Trans>` props.children array
2. Set `debug: true` in i18next.init() and watch console
3. Use `saveMissing` feature to auto-generate keys
4. Understand the index numbering rules above
