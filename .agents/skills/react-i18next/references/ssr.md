# SSR with react-i18next — Full Reference

## Framework-Specific Solutions

### Next.js (App Router)
Use i18next directly with React Server Components. See the official guide:
https://www.locize.com/blog/i18n-next-app-router

### Next.js (Pages Router)
Use `next-i18next` which wraps react-i18next:
```bash
npm install next-i18next
```
- Leverages Next.js built-in internationalized routing (v10+)
- Handles SSR/SSG automatically
- Guide: https://locize.com/blog/next-i18next/
- For SSG / `next export`: https://locize.com/blog/next-i18n-static/

### Remix
Use `remix-i18next`:
```bash
npm install remix-i18next
```
- Guide: https://locize.com/blog/remix-i18n/

### Gatsby
Use `gatsby-plugin-react-i18next`:
- Guide: https://locize.com/blog/gatsby-i18n/

## Custom SSR

### Setting i18n Instance from Request

Use I18nextProvider to pass the request-bound i18n instance (e.g., from `i18next-http-middleware`):

```jsx
import { I18nextProvider } from 'react-i18next';

<I18nextProvider i18n={req.i18n}>
  <App />
</I18nextProvider>
```

### Passing Initial Data to Client

To avoid async translation loading on the client (and Suspense flicker), pass initial data down:

#### useSSR Hook

```jsx
import { useSSR } from 'react-i18next';

function InitSSR({ initialI18nStore, initialLanguage }) {
  useSSR(initialI18nStore, initialLanguage);
  return <App />;
}
```

- `initialLanguage`: calls `i18n.changeLanguage()` on the client
- `initialI18nStore`: prefills the i18next translation store

#### withSSR HOC

```jsx
import { withSSR } from 'react-i18next';
import App from './App';

const ExtendedApp = withSSR()(App);

// Render:
<ExtendedApp
  initialLanguage={serverLanguage}
  initialI18nStore={serverStore}
/>
```

The ExtendedApp also exposes `ExtendedApp.getInitialProps()` for frameworks that use it.
