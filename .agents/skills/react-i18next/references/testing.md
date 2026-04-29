# Testing react-i18next — Full Reference

## Approach 1: Mock the Module (Jest)

### Mock useTranslation hook

```js
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));
```

### Mock withTranslation HOC

```js
jest.mock('react-i18next', () => ({
  withTranslation: () => (Component) => {
    Component.defaultProps = {
      ...Component.defaultProps,
      t: (key) => key,
    };
    return Component;
  },
}));
```

### Spy on t function

```jsx
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

it('calls t with correct args', () => {
  const tSpy = jest.fn((str) => str);
  useTranslation.mockReturnValue({
    t: tSpy,
    i18n: { changeLanguage: () => new Promise(() => {}) },
  });

  const wrapper = mount(<MyComponent />);

  expect(tSpy).toHaveBeenCalledWith('some.key', { some: 'variable' });
});
```

## Approach 2: Export Bare Component

```js
// MyComponent.js
export function MyComponent({ t }) {
  return <div>{t('hello')}</div>;
}
export default withTranslation('ns')(MyComponent);
```

```js
// MyComponent.test.js
import { MyComponent } from './MyComponent';

it('renders', () => {
  const wrapper = mount(<MyComponent t={(key) => key} />);
  expect(wrapper.text()).toBe('hello');
});
```

## Approach 3: Full i18next Setup (No Mocking)

Create a test i18n config:

```js
// i18nForTests.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translationsNS'],
  defaultNS: 'translationsNS',
  debug: false,
  interpolation: { escapeValue: false },
  resources: { en: { translationsNS: {} } },
});

export default i18n;
```

Use in tests:

```jsx
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18nForTests';

it('renders with i18n', () => {
  const wrapper = mount(
    <I18nextProvider i18n={i18n}>
      <MyComponent />
    </I18nextProvider>
  );
  // assertions...
});
```

To get `i18n.language` to return a value, add languages to resources:
```js
i18n.init({
  fallbackLng: 'en',
  resources: { en: {}, de: {} },
});
```

## Full Jest Example

See: https://github.com/i18next/react-i18next/tree/master/example/test-jest
