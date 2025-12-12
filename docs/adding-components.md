# Adding Components

This guide shows you how to add new components to your project.

## Adding shadcn/ui Components

The boilerplate uses shadcn/ui for UI components. To add a new component:

```bash
pnpm dlx shadcn@latest add <component-name>
```

Example:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dialog
```

This will:

- Download the component to `components/ui/`
- Add any required dependencies to `package.json`
- Update `components.json` if needed

## Creating Custom Components

### 1. Create the Component File

Create a new file in the `components/` directory:

```tsx
// components/my-component.tsx
import type { ReactNode } from "react";

interface MyComponentProps {
  title: string;
  children?: ReactNode;
}

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}
```

### 2. Use the Component

Import and use it in your pages:

```tsx
// app/[locale]/page.tsx
import { MyComponent } from "@/components/my-component";

export default function Page() {
  return (
    <MyComponent title="Hello">
      <p>This is my custom component</p>
    </MyComponent>
  );
}
```

## Component Best Practices

### Use TypeScript

Always define prop types for your components:

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  // Component code
}
```

### Use Tailwind Classes

Style components with Tailwind CSS:

```tsx
export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">{children}</div>
  );
}
```

### Use the cn() Utility

For conditional classes, use the `cn()` utility from `lib/utils.ts`:

```tsx
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "default" | "destructive";
  children: ReactNode;
}

export function Alert({ variant = "default", children }: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variant === "destructive" && "border-red-500 bg-red-50"
      )}
    >
      {children}
    </div>
  );
}
```

## Creating Client Components

For components that use hooks or browser APIs, add the "use client" directive:

```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Server Components (Default)

By default, components are server components. They can:

- Fetch data directly
- Access backend resources
- Reduce client-side JavaScript

```tsx
// This is a server component (default)
async function UserList() {
  const users = await fetch("https://api.example.com/users").then((res) =>
    res.json()
  );

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Organizing Components

### Small Components

Place in `components/` directory:

```
components/
├── header.tsx
├── footer.tsx
└── navigation.tsx
```

### Feature-Specific Components

Group related components in subdirectories:

```
components/
├── auth/
│   ├── login-form.tsx
│   └── signup-form.tsx
└── dashboard/
    ├── stats-card.tsx
    └── chart.tsx
```

### UI Components

shadcn/ui components go in `components/ui/`:

```
components/ui/
├── button.tsx
├── card.tsx
└── dialog.tsx
```

## Testing Components

Create a test file next to your component:

```tsx
// components/my-component.test.tsx
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./my-component";

describe("MyComponent", () => {
  it("renders the title", () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
});
```

Run tests:

```bash
pnpm test
```

## Common Patterns

### Loading States

```tsx
export function DataDisplay({
  data,
  isLoading,
}: {
  data?: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{data}</div>;
}
```

### Error Handling

```tsx
export function SafeComponent({ data }: { data?: string }) {
  if (!data) {
    return <div>No data available</div>;
  }

  return <div>{data}</div>;
}
```

### Composition

```tsx
export function Card({ children }: { children: ReactNode }) {
  return <div className="card">{children}</div>;
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="card-header">{children}</div>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="card-content">{children}</div>;
}

// Usage:
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content here</CardContent>
</Card>;
```
